const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const cloudinary = require('cloudinary').v2;

// 1. Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary credentials missing in .env!');
  console.error('Ensure CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET are present.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

console.log(`🔑 Checking Cloudinary Credentials:`);
console.log(`   Cloud Name : ${cloudName}`);
console.log(`   API Key    : ${apiKey}`);
console.log(`   API Secret : ${apiSecret.substring(0, 4)}...${apiSecret.substring(apiSecret.length - 3)} (length: ${apiSecret.length})\n`);

async function verifyCredentials() {
  try {
    await cloudinary.api.ping();
    console.log(`✅ Cloudinary credentials verified successfully!\n`);
  } catch (err) {
    console.error(`\n❌ Cloudinary Authentication Error: ${err.message}`);
    console.error(`👉 Cloudinary dashboard (https://console.cloudinary.com/) me jaao:`);
    console.error(`   1. "Settings" -> "API Keys" kholo.`);
    console.error(`   2. Check karo ki Cloud Name (${cloudName}), API Key (${apiKey}), aur Secret sahi hain ya copy karte waqt koi letter miss ho gaya.`);
    console.error(`   3. backend/.env me updated values daal kar wapas run karo.\n`);
    process.exit(1);
  }
}

// 2. Open SQLite Database
const dbPath = path.resolve(__dirname, '../', process.env.DATABASE_FILENAME || '.tmp/data.db');
if (!fs.existsSync(dbPath)) {
  console.error(`❌ Database not found at: ${dbPath}`);
  process.exit(1);
}

console.log(`📂 Connecting to database: ${dbPath}`);
const db = new Database(dbPath, { timeout: 15000 });

// Find correct table name (Strapi v5 uses 'files', v4 uses 'upload_files')
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('files', 'upload_files')").all();
if (tables.length === 0) {
  console.error('❌ Could not find files table in database.');
  process.exit(1);
}
const tableName = tables[0].name;
console.log(`✅ Using table: ${tableName}`);

const uploadsDir = path.resolve(__dirname, '../public/uploads');

async function uploadLocalFile(relOrAbsPath, fallbackName) {
  let targetPath = relOrAbsPath;
  if (!path.isAbsolute(targetPath)) {
    // If it starts with /uploads/ or uploads/
    const clean = targetPath.replace(/^\/?uploads\//, '');
    targetPath = path.join(uploadsDir, clean);
  }

  if (!fs.existsSync(targetPath)) {
    // Try fallback to uploads folder with fallbackName
    if (fallbackName && fs.existsSync(path.join(uploadsDir, fallbackName))) {
      targetPath = path.join(uploadsDir, fallbackName);
    } else {
      return null;
    }
  }

  try {
    const res = await cloudinary.uploader.upload(targetPath, {
      resource_type: 'auto',
      folder: 'lead_magnet',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    return res;
  } catch (err) {
    if (err.message && err.message.includes('Invalid Signature')) {
      console.error(`\n❌ Fatal Cloudinary Error: Invalid Signature! API Secret ya Key galat hai.`);
      process.exit(1);
    }
    console.error(`  ⚠️ Upload failed for ${targetPath}:`, err.message);
    return null;
  }
}

async function migrate() {
  await verifyCredentials();

  const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
  console.log(`🔍 Found ${rows.length} total media records in Strapi.`);

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const file = rows[i];
    const isAlreadyCloudinary = file.provider === 'cloudinary' && file.url && file.url.includes('cloudinary.com');

    if (isAlreadyCloudinary) {
      skippedCount++;
      continue;
    }

    console.log(`\n[${i + 1}/${rows.length}] Processing: ${file.name || file.hash}`);

    // Upload main file
    const mainFallback = `${file.hash}${file.ext || ''}`;
    const uploadRes = await uploadLocalFile(file.url, mainFallback);

    if (!uploadRes) {
      console.log(`  ❌ Local file not found for: ${file.url}`);
      failedCount++;
      continue;
    }

    let updatedFormats = file.formats;
    if (file.formats) {
      try {
        const formatsObj = typeof file.formats === 'string' ? JSON.parse(file.formats) : file.formats;
        for (const formatKey of Object.keys(formatsObj)) {
          const fmt = formatsObj[formatKey];
          if (fmt && fmt.url && !fmt.url.includes('cloudinary.com')) {
            const fmtFallback = `${fmt.hash}${fmt.ext || ''}`;
            const fmtRes = await uploadLocalFile(fmt.url, fmtFallback);
            if (fmtRes) {
              fmt.url = fmtRes.secure_url;
              fmt.provider_metadata = {
                public_id: fmtRes.public_id,
                resource_type: fmtRes.resource_type,
              };
            }
          }
        }
        updatedFormats = JSON.stringify(formatsObj);
      } catch (e) {
        console.warn(`  ⚠️ Could not parse formats JSON for file ${file.id}`);
      }
    }

    const providerMetadata = JSON.stringify({
      public_id: uploadRes.public_id,
      resource_type: uploadRes.resource_type,
    });

    // Update in database
    const updateStmt = db.prepare(`
      UPDATE ${tableName}
      SET url = ?, provider = 'cloudinary', provider_metadata = ?, formats = ?
      WHERE id = ?
    `);

    updateStmt.run(uploadRes.secure_url, providerMetadata, updatedFormats, file.id);
    console.log(`  🚀 Uploaded -> ${uploadRes.secure_url}`);
    migratedCount++;
  }

  console.log('\n========================================');
  console.log(`🎉 Migration Completed!`);
  console.log(`   Migrated to Cloudinary : ${migratedCount}`);
  console.log(`   Already on Cloudinary  : ${skippedCount}`);
  console.log(`   Failed / Not Found     : ${failedCount}`);
  console.log('========================================\n');
  db.close();
}

migrate().catch((err) => {
  console.error('Fatal Migration Error:', err);
  if (db) db.close();
  process.exit(1);
});
