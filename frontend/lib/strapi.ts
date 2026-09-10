/** Base URL for Strapi CMS API */
const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://lead-magnet-strapi.onrender.com";
export const STRAPI_URL = RAW_STRAPI_URL.replace(/\/+$/, "");

/** Centralized SVG icon paths for social media platforms */
export const SOCIAL_ICONS: Record<string, string> = {
    Instagram: "/images/insta_logo.svg",
    YouTube: "/images/youtube_logo.svg",
    Facebook: "/images/facebook.svg",
    LinkedIn: "/images/linkedin-icon.svg",
};

/**
 * Normalizes media input (string, object, or array) into a fully qualified Cloudinary or Strapi URL.
 */
export function getMediaUrl(
    media?: any
): string {
    if (!media) return "";
    let rawUrl: string | undefined | null;

    if (typeof media === "string") {
        rawUrl = media;
    } else if (Array.isArray(media)) {
        const first = media[0];
        rawUrl =
            first?.url ||
            first?.data?.attributes?.url ||
            first?.data?.url ||
            first?.attributes?.url ||
            (typeof first === "string" ? first : null);
    } else if (typeof media === "object") {
        rawUrl =
            media?.url ||
            media?.data?.attributes?.url ||
            media?.data?.url ||
            media?.attributes?.url;
    }

    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        return rawUrl;
    }
    return `${STRAPI_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
}

/**
 * Fetches page content from Strapi (Collection Type: pages + Single Types: header, footer).
 */
export async function getLandingPage(slug: string = "lead-magnet") {
    try {
        // Deep populate query for all section components inside Dynamic Zone
        const sectionsPopulate = [
            "populate[sections][on][sections.hero][populate][brands][populate][logo]=true",
            "populate[sections][on][sections.hero][populate][primaryCta]=true",
            "populate[sections][on][sections.hero][populate][quoteForm][populate]=*",
            "populate[sections][on][sections.storefront-problems][populate][items]=true",
            "populate[sections][on][sections.storefront-problems][populate][summary]=true",
            "populate[sections][on][sections.conversion-insights][populate][cards][populate][image]=true",
            "populate[sections][on][sections.work-showcase][populate][items][populate][beforeImage]=true",
            "populate[sections][on][sections.work-showcase][populate][items][populate][afterImage]=true",
            "populate[sections][on][sections.work-showcase][populate][items][populate][mobileBeforeImage]=true",
            "populate[sections][on][sections.work-showcase][populate][items][populate][mobileAfterImage]=true",
            "populate[sections][on][sections.engagement-fit][populate][suitablePoints]=true",
            "populate[sections][on][sections.engagement-fit][populate][notSuitablePoints]=true",
            "populate[sections][on][sections.our-work][populate][projects][populate][images]=true",
            "populate[sections][on][sections.our-work][populate][projects][populate][mobileImages]=true",
            "populate[sections][on][sections.final-cta][populate][logos][populate][logo]=true",
            "populate[sections][on][sections.final-cta][populate][primaryCta]=true",
            "populate[sections][on][sections.final-cta][populate][secondaryCta]=true",
            "populate[sections][on][sections.our-process][populate][marqueeItems]=true",
            "populate[sections][on][sections.our-process][populate][cta]=true",
            "populate[sections][on][sections.our-process][populate][cards][populate][icon]=true",
            "populate[sections][on][sections.our-process][populate][cards][populate][services]=true",
            "populate[sections][on][sections.our-process][populate][cards][populate][cta]=true",
            "populate[sections][on][sections.our-process][populate][video]=true",
            "populate[sections][on][sections.our-process][populate][image]=true",
            "populate[stickyCTA][populate][primaryCta]=true",
            "populate[stickyCTA][populate][secondaryCta]=true",
            "populate[stickyCTA][populate][callbackForm]=true",
        ].join("&");

        // 1. Try fetching from the new Collection Type: /api/pages
        let pageJson: any = null;

        // Attempt 1A: by slug with deep population
        const slugRes = await fetch(
            `${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&${sectionsPopulate}`,
            { cache: "no-store" }
        ).catch(() => null);

        if (slugRes && slugRes.ok) {
            pageJson = await slugRes.json().catch(() => null);
        }

        // Attempt 1B: without slug filter if slug query was empty or 404
        if (!pageJson?.data || (Array.isArray(pageJson.data) && pageJson.data.length === 0)) {
            const allPagesRes = await fetch(
                `${STRAPI_URL}/api/pages?${sectionsPopulate}`,
                { cache: "no-store" }
            ).catch(() => null);

            if (allPagesRes && allPagesRes.ok) {
                pageJson = await allPagesRes.json().catch(() => null);
            }
        }

        // Attempt 1C: fallback to simpler wildcard populate if deep populate failed
        if (!pageJson?.data || (Array.isArray(pageJson.data) && pageJson.data.length === 0)) {
            const simpleRes = await fetch(
                `${STRAPI_URL}/api/pages?populate=*`,
                { cache: "no-store" }
            ).catch(() => null);

            if (simpleRes && simpleRes.ok) {
                pageJson = await simpleRes.json().catch(() => null);
            }
        }

        // Normalize pageData from Strapi response (Strapi 4 attributes vs Strapi 5 flat)
        let pageData: any = null;
        if (pageJson?.data) {
            const rawItem = Array.isArray(pageJson.data) ? pageJson.data[0] : pageJson.data;
            if (rawItem) {
                pageData = rawItem.attributes ? { id: rawItem.id, ...rawItem.attributes } : rawItem;
            }
        }

        // 2. Fetch Header and Footer Single Types in parallel
        const [headerRes, footerRes] = await Promise.all([
            fetch(`${STRAPI_URL}/api/header?populate=*`, { cache: "no-store" }).catch(() => null),
            fetch(`${STRAPI_URL}/api/footer?populate[footer][populate]=*`, { cache: "no-store" }).catch(() => null),
        ]);

        let headerData: any = null;
        let footerData: any = null;

        if (headerRes && headerRes.ok) {
            const headerJson = await headerRes.json().catch(() => null);
            const h = headerJson?.data;
            const unwrappedH = h?.attributes || h;
            headerData = unwrappedH?.Header || unwrappedH?.header || unwrappedH;
        }

        if (footerRes && footerRes.ok) {
            const footerJson = await footerRes.json().catch(() => null);
            const f = footerJson?.data;
            const unwrappedF = f?.attributes || f;
            footerData = unwrappedF?.footer || unwrappedF?.Footer || unwrappedF;
        }

        // If Collection Type (/api/pages) has data, return it
        if (pageData) {
            return {
                ...pageData,
                header: headerData || pageData.header,
                footer: footerData || pageData.footer,
                stickyCTA: pageData.stickyCTA,
            };
        }

        console.warn("[Strapi Fetch] No published page found in /api/pages");
        return null;
    } catch (err: unknown) {
        if (err && typeof err === "object" && "digest" in err && (err as { digest: string }).digest === "DYNAMIC_SERVER_USAGE") {
            throw err;
        }
        console.error("Error fetching landing page:", err);
        return null;
    }
}