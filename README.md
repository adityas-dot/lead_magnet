# Thumbstack — Lead Magnet

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)
![Strapi v5](https://img.shields.io/badge/Strapi-v5-4945ff?style=flat-square&logo=strapi)
![Neon](https://img.shields.io/badge/Neon-Serverless_Postgres-00e599?style=flat-square&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448c5?style=flat-square&logo=cloudinary)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=flat-square&logo=vercel)

A modern, full-stack Lead Magnet landing page featuring an interactive multi-step quote estimator, dynamic content powered by Strapi v5 headless CMS with Neon PostgreSQL, and Cloudinary media delivery.

---

## Key Features

- **Interactive Shopify Quote Estimator:** Multi-step lead capture form with instant estimate calculations.
- **Dynamic Content:** Landing page sections fully manageable via Strapi v5 CMS.
- **Cloudinary CDN Integration:** Persistent media storage with responsive image optimization.
- **Before/After Showcase:** Interactive comparison sliders with touch/drag support.
- **Responsive & Animated:** Fluid micro-interactions, marquee sliders, and 1:1 responsive layouts.

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Strapi v5 (Headless CMS)
- **Database:** SQLite (Local) / Neon Serverless PostgreSQL (Production)
- **Media CDN:** Cloudinary
- **Hosting:** Vercel (Frontend) & Render (Backend)

---

## Getting Started

### 1. Backend (Strapi)
```bash
cd backend
npm install
npm run develop
```
> Admin URL: `http://localhost:1337/admin`

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
> App URL: `http://localhost:3000`

---

## Media Migration (Cloudinary)

To migrate local media files directly to Cloudinary and update database URLs:

```bash
cd backend
npm run migrate:cloudinary
```

---

## License
This project is licensed under the MIT License.
