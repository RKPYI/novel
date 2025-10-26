<div align="center">
  <img src="public/rantale-dark.svg" alt="Rantale" width="200" style="margin-top:2rem" />
  <h1>Rantale</h1>
  <p>A minimal novels app built with Next.js (App Router), Prisma, SWR, and shadcn/ui.</p>
</div>

---

### Quick start
- Install deps: `npm i` (or `pnpm i`, `yarn`)
- Dev server: `npm run dev` → http://localhost:3000

### Features
- Browse novels and view a novel’s detail page
- Typed API helper, SWR data fetching, and Prisma schema
- [More to comes]

### Tech stack
- Next.js 16 (App Router + Turbopack)
- TypeScript, SWR
- BetterAuth (Authentication + Session Management + Cookies)
- Prisma (PostgreSQL or compatible)
- shadcn/ui, lucide-react

### Notable paths
- UI: `src/components/novels/`
- Hooks: `src/hooks/`
- API: `src/app/api/novels/`
- Detail page: `src/app/(root)/novels/[slug]/page.tsx`
