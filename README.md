# Project CALM

Patient-education website about calcium in the arteries (#HarBlockageSameNahiHota), in English and Hindi, with doctor videos and a QR page for each doctor.

**To host it or hand it over, read [DEPLOYMENT.md](DEPLOYMENT.md).** It covers Hostinger setup, the database, environment variables and using the `/admin` page.

## Quick start (local)

```bash
npm install
npm run dev   # http://localhost:3000 · admin: /admin (PIN 1234 locally)
```

Requires Node.js 20.9 or newer.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP / Framer Motion / Lenis · Three.js · MySQL for the doctor-video list (`mysql2`)

| Path | What's there |
|---|---|
| `src/app` | Pages and the admin API (`src/app/api/admin/videos`) |
| `src/components` | Page sections |
| `src/data/content.ts`, `content.hi.ts` | All site text, English and Hindi |
| `src/lib/videos.ts` | Doctor-video storage: MySQL when `DB_` settings are set, else `data/doctor-videos.json` |
| `data/doctor-videos.json` | The video list for local development, and the seed for a new database |
| `.env.example` | Every setting the live site needs |
