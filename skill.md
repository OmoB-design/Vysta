---
name: figma-to-code
description: >
  Converts Figma designs into pixel-perfect, production-quality code by using
  both a reference screenshot and Figma's exported CSS. Use this skill whenever
  the user shares a Figma frame image alongside CSS code (from Figma's "Copy as
  CSS" feature), or when they mention "Figma to code", "build from Figma",
  "match this design", "replicate this UI", or are trying to extract a design
  system from Figma. Also trigger when the user uploads a design.md or asks to
  generate one from a built page. This skill covers the full workflow: building
  a page 1:1 from a Figma frame, iterating until pixel-perfect, and generating
  a reusable design.md system file that can be applied to new app flows.
---

## Stack Override

This project uses Next.js 14 (App Router) + Tailwind CSS v4 + TypeScript.
All output defaults in this skill are overridden as follows:

- Output format: .tsx React components, not .html files
- CSS: Tailwind utility classes only — no inline styles, no <style> blocks
- Design tokens: defined in globals.css @theme, used as Tailwind classes
- Fonts: loaded via next/font in layout.tsx — not Google Fonts CDN @import
- File locations: pages in /src/app, components in /src/components
- Never write vanilla HTML — always write JSX with Tailwind classes
- Figma access: via MCP — read designs directly from Figma URLs,
  do not wait for pasted CSS code

## Design System Source of Truth

This project uses a Figma-hosted design system. These rules apply to every
session without exception:

- Always read the Figma file via MCP before writing any code
- The Figma design system is the primary source of truth — not design.md,
  not memory, not assumptions
- If any value in design.md conflicts with what MCP reads from Figma,
  Figma always wins
- Before building any component, read the relevant Figma frame and extract
  the current values from the live design system
- If Figma contains values not yet in globals.css @theme, add them to
  @theme first before using them anywhere
- Never approximate, guess, or carry over values from a previous session —
  always read fresh from Figma

---

# Figma-to-Code Skill

This skill replicates Figma designs into production-grade code with pixel-level
fidelity, then optionally extracts a reusable design.md design system that can
be applied to any future app or flow.

## How the Workflow Works

The user will typically arrive with one or more of:

- A Figma URL (read directly via MCP — no CSS paste required)
- A design.md file (reference companion to the Figma design system)
- An IA flow (sitemap, screen list, or written description of pages/flows)

Match your task to the stage they're at:

| What they have | What to do |
|---|---|
| Figma URL | Build the page (Stage 1) |
| Built page, wants refinement | Iterate to 1:1 (Stage 2) |
| Happy with page | Generate design.md (Stage 3) |
| design.md + IA flow | Build a full new app (Stage 4) |

## Stage 1 — Build from Figma Frame

### Inputs
- Figma frame URL (Claude reads it directly via MCP)
- Reference screenshot if provided alongside the URL

### How to read the Figma file

Use the Figma MCP connection to read the design system and frame directly
from the URL. Extract all design values — colors, spacing, typography,
radius, shadows — from the live Figma design system.

Map extracted values to the existing tokens in globals.css @theme.
If a value from Figma is not yet in @theme, add it there first —
never hardcode it inline or use an arbitrary Tailwind value.

### Build approach

- Read the Figma frame via MCP first — do not skip this step
- Identify layout regions: nav, sidebar, main, cards, footer
- Map component hierarchy and spacing rhythm from the Figma design system
- Apply all values via Tailwind classes from @theme — never approximate
- One component per file in /src/components
- Use next/font for font loading in layout.tsx
- Use Lucide React for all icons — never emoji as icon substitutes
- Build in this order: layout shell first, then individual page components

### What to prioritize

- Spacing and layout fidelity — these define the feel
- Typography: size, weight, line-height, letter-spacing — these define the voice
- Color accuracy from the Figma design system — exact token values only
- Component states (hover, active, focus, disabled) as defined in Figma

### What to skip in Stage 1

- Do not invent interactions not visible in the Figma design
- Do not add pages or sections not in the Figma frame
- Do not hardcode any CSS value — if not in @theme, add it there first
- Do not use arbitrary Tailwind values like w-[208px] or text-[14px]
- Do not rebuild Sidebar or Navbar inside page components — layout.tsx only

## Stage 2 — Iterate to 1:1

The user will give feedback on spacing, typography, or layout. Treat this
as a pixel-pushing session.

### Approach
- Re-read the relevant Figma frame via MCP to get the exact current values
- Make the change using the exact token value from globals.css @theme
- Re-present the updated component after changes for visual comparison
- If the user shares additional Figma frames, read them via MCP immediately,
  extract new token values, add them to @theme, then use them

### Common corrections to watch for
- Icon sizes (Figma often exports SVG at 1x but displays at 2x)
- Font weight 500 vs 600 — verify against the Figma design system via MCP
- Border radius on nested elements — Figma applies radius per-layer
- Shadow values — copy them verbatim into @theme, never rewrite

## Stage 3 — Generate design.md

Once the user is happy with the built page, generate a design.md file.
This is a portable reference companion that supports future sessions when
building new screens without re-reading every Figma frame from scratch.

Note: design.md is a companion document, not a replacement for the Figma
design system. Future sessions should always read Figma via MCP first and
use design.md as a structural guide.

### design.md must include

- Brand identity and personality
- Full color palette with semantic aliases and usage context
- Typography scale: font, size, weight, line-height, and use per role
- Spacing scale with token names and typical uses
- Border radius values and their uses
- Shadow values copied verbatim from Figma
- Component patterns for every major UI element with exact token references
- Layout rules: sidebar width, top nav height, content padding, grid,
  and Next.js layout assembly rules
- Component file map listing every component and its path in /src/components
- Interaction states: hover, active, focus, disabled, and transitions
- Full copy-paste ready @theme block

Key principle: design.md should contain enough information that a future
Claude session can build a new screen that looks like it belongs to the
same product — but must always defer to Figma via MCP for exact values.

## Stage 4 — Build a New App from design.md + IA Flow

The user provides:
- Their design.md (generated in Stage 3)
- A Figma file URL for the design system
- An IA flow — screen list, sitemap, user journey, or short description
- 2 lines of context: what the product is and who it is for

### How to execute

- Read the Figma design system via MCP first
- Parse design.md as a structural guide for component patterns and layout
- Map the IA — identify all screens and their relationships
- Build layout.tsx first with Sidebar and Navbar — this shell wraps all pages
- Build each screen as a page.tsx inside its own folder under /src/app
- Use only the design language from the Figma design system — do not
  introduce new colors, fonts, or spacing not found in Figma or @theme
- Build each reusable UI element as its own component in /src/components
- For 4 or more screens, build one at a time and confirm before moving on

## Output Defaults (Stack Override Applied)

- Format: .tsx React components using Next.js App Router
- Styling: Tailwind CSS utility classes only — no inline styles
- Tokens: all values from globals.css @theme — never hardcoded
- Source: Figma design system read via MCP — always the primary reference
- Fonts: next/font in layout.tsx
- Icons: Lucide React — never emoji as icon substitutes
- Responsiveness: match the Figma frame breakpoint by default
- Interactivity: hover states, active nav states, and tab switching via
  React state; avoid complex logic unless requested

## Common Mistakes to Avoid

- Do not guess any value — read Figma via MCP for every build session
- Do not rely on design.md alone — it is a companion, not the source
- Do not use arbitrary Tailwind values like w-[208px] or text-[14px]
- Do not hardcode any CSS value — if not in @theme, add it there first
- Do not write vanilla HTML — always JSX with Tailwind classes
- Do not wait for pasted CSS — read Figma directly via MCP
- Do not rebuild Sidebar or Navbar in page files — layout.tsx only
- Do not invent loading or error states — follow the patterns in design.md
- Do not carry values over from memory between sessions — always read fresh

## Tips for Multi-Frame Sessions

If the user shares additional Figma frames during a session:
- Read each new frame via MCP immediately
- Cross-reference new values against the Figma design system for consistency
- Extract any new token values and add them to @theme before using them
- Flag any conflicts with existing tokens and ask the user to confirm
- Accumulate component patterns — reuse existing components wherever possible
