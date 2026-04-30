# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture

**AdLab Lead Generation** — a Next.js 16 full-stack app for AI-assisted lead generation with advertising integrations.

- **Framework:** Next.js App Router (React 19, TypeScript 5)
- **Styling:** Tailwind CSS 4 via PostCSS (`@import "tailwindcss"` in globals.css)
- **Forms:** React Hook Form + Zod for validation
- **Path alias:** `@/*` → `./src/*`

### Key Integrations (declared in package.json, not yet wired up)

| Package | Purpose |
|---|---|
| `@anthropic-ai/sdk` | Claude AI |
| `@supabase/supabase-js` | Database (PostgreSQL) |
| `@upstash/redis` | Caching layer |
| `google-ads-api` | Google Ads |
| `next-auth` | Authentication |

### Design System

All visual decisions are governed by `adlab-design.md` at the project root. The Figma design system is the **primary source of truth** — always read it via MCP before writing any component. If any value in `adlab-design.md` conflicts with Figma, **Figma wins**.

Key rules:
- **Never hardcode** a color, size, shadow, or radius — always use a CSS token from `globals.css @theme`
- If a Figma value is not yet in `@theme`, add it there first before using it anywhere
- Use **semantic tokens** in components (`--color-text-heading-04`, `--color-surface-stroke`, etc.), not raw base tokens
- Component file map is fixed — see `adlab-design.md § 10`. Never rebuild Sidebar/Navbar inside a page file
- `layout.tsx` holds Sidebar + Navbar; individual `page.tsx` files render only their own content
- Main content area offsets: `ml-[--sidebar-width]` + `pt-[--topnav-height]`
- Card rest shadow: `--shadow-card`; hover: `--shadow-sm`. Focus rings: `--shadow-inset-focus` only
- Button/input transitions: `150ms ease`. Nav items: no transition (snap states)

### Figma-to-Code Workflow

Full workflow is defined in `skill.md`. Summary:

| User has | Action |
|---|---|
| Figma URL | Read via MCP, build page (Stage 1) |
| Built page needing refinement | Re-read Figma via MCP, iterate to 1:1 (Stage 2) |
| Approved page | Generate/update `adlab-design.md` (Stage 3) |
| `adlab-design.md` + IA flow | Build full app (Stage 4) |

**Output defaults:**
- `.tsx` components only — no `.html`, no inline styles, no `<style>` blocks
- Tailwind utility classes from `@theme` only — no arbitrary values like `w-[208px]`
- Icons: Lucide React — never emoji as substitutes
- Fonts: `next/font` in `layout.tsx` — never CDN `@import`
- Never approximate values — read Figma fresh via MCP every session

### Current State

The project is in early scaffolding — only `src/app/layout.tsx` and `src/app/page.tsx` exist. API routes go in `src/app/api/`, shared components in `src/components/`, utilities in `src/lib/`. No environment variables are documented yet; they will be needed for Supabase, Anthropic, Google Ads, Upstash Redis, and NextAuth.
