# 💎 Elena Vance Archives - Premium Creator Media Platform

A modern, luxurious, ultra-fast content discovery and media platform built with Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Prisma ORM, and custom real-time telemetry analytics.

---

## 🛠️ 100% Free-Tier Tech Stack Breakdown

| Layer | Provider / Tool | Free Tier Limits |
| :--- | :--- | :--- |
| **Hosting & Deployment** | **Vercel** | Hobby Plan (100% Free, Edge Network, Automatic HTTPS) |
| **Database** | **Supabase** or **Neon.tech** | 500MB PostgreSQL DB (Unlimited queries, SSL connection) |
| **ORM** | **Prisma 6** | Open Source |
| **Real-time Caching** | **Upstash Redis** | 10,000 requests/day (Free REST API) |
| **Image Optimization** | **ImageKit.io** | 20GB/month bandwidth & 20GB media storage |
| **Video Storage & CDN** | **Cloudflare R2** | 10GB/month free storage, 0$ Egress fees |
| **Monetization** | **Google AdSense** | 100% Free Publisher Account |

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js 18.x or 20.x installed
- Git installed

### 1. Clone & Install Dependencies
```bash
cd smr
npm install
```

### 2. Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your free credentials in `.env`:
```env
# PostgreSQL Database (Free from Supabase or Neon.tech)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres?schema=public"

# NextAuth / Auth.js Secret
NEXTAUTH_SECRET="super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare R2 (Free 10GB Video Storage)
CLOUDFLARE_R2_ACCOUNT_ID="your_account_id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"
CLOUDFLARE_R2_BUCKET_NAME="smr-media-bucket"
CLOUDFLARE_R2_PUBLIC_DOMAIN="https://pub-cloudflare-r2.r2.dev"

# ImageKit (Free 20GB Image Optimization)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_key"
IMAGEKIT_PRIVATE_KEY="private_key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_handle"

# Upstash Redis (Free Real-time Analytics & Rate Limiting)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"

# Google AdSense Publisher ID
NEXT_PUBLIC_ADSENSE_PUB_ID="ca-pub-1234567890123456"
```

### 3. Generate Prisma Client & Run Local Server
```bash
npx prisma generate
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Key Project Features & Routes

- `/` — Homepage Masonry Feed with Creator Hero Banner & Trending Carousel
- `/explore` — Category Discovery Grid Cards & Filters
- `/videos` — Short-Form & Editorial Video Vault with Custom Player
- `/images` — Unsplash & Behance Style Photo Gallery
- `/trending` — Real-Time Engagement Velocity Feed
- `/categories` — 10 Curated Category Archives
- `/creator` — Creator Biography, Stats, Press Kit & Proposal Form
- `/media/[id]` — Detail Lightbox with Comments & Affiliate Widgets
- `/bookmarks` & `/history` — Local Storage Synced Saved Archives
- `/admin` — Studio Control Center (Realtime visitors, AdSense revenue estimates, traffic channels, device breakdown & infrastructure health)
- `/admin/upload` — Drag & Drop Upload Zone with AI Captioning & Auto-tagging
