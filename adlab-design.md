# AdLab Lead Generation — Design Reference

> Single source of truth for visual decisions. All values map directly to `globals.css @theme`.
> Never hardcode a color, size, or shadow — reference the token instead.

---

## Source of Truth

This project uses a **Figma-hosted design system**. The following rules apply
to every build and iteration session:

- All design decisions originate from the Figma file — read it via MCP first
- This design.md is a reference companion, not a replacement for the Figma file
- If any value in this file conflicts with what MCP reads from Figma,
  **Figma always wins**
- Before writing any component, read the relevant Figma frame via MCP and
  extract the current values — do not rely on memory or this file alone
- If new values are found in Figma that are not yet in globals.css @theme,
  add them to @theme first before using them anywhere

---

## 1. Brand Personality

AdLab Lead Generation is a professional AI-powered lead generation tool. The visual language reflects:

- **Trustworthy and calm** — an almost-white surface palette keeps the UI quiet so data reads clearly
- **Decisive and action-oriented** — one strong blue drives all primary actions; nothing competes with it
- **Structured but not cold** — generous rounded corners and barely-visible shadows soften the grid without feeling playful
- **Information-dense without feeling cluttered** — tight caption type and consistent spacing rhythm let agents scan quickly

**In practice:** think Bloomberg meets a modern SaaS dashboard. Clean, fast, no decorative noise.

---

## 2. Color Palette

### Base palette

| Token | Hex | Name |
|---|---|---|
| `--color-white` | `#ffffff` | Pure white |
| `--color-black` | `#000000` | Pure black |
| `--color-grey-10` | `#fcfcfc` | Dashboard bg |
| `--color-grey-50` | `#f4f4f4` | Foreground fill |
| `--color-grey-100` | `#eaeaea` | Stroke / divider |
| `--color-grey-150` | `#dfdfdf` | Disabled border |
| `--color-grey-400` | `#aaaaaa` | Placeholder / muted |
| `--color-grey-950` | `#101010` | Near-black (sidebar bg) |
| `--color-blue-100` | `#d1e1ff` | Blue tint bg |
| `--color-blue-150` | `#bad2ff` | Blue hover tint |
| `--color-blue-400` | `#4787fe` | Blue hover state |
| `--color-blue-500` | `#1969fe` | Primary brand blue |
| `--color-yellow-100` | `#fcebd5` | Yellow tint bg |
| `--color-yellow-500` | `#ee9c2e` | Warning / draft |
| `--color-purple-100` | `#e1def5` | Purple tint bg |
| `--color-purple-500` | `#6a59ce` | Unassigned / info |
| `--color-red-100` | `#ffd3d3` | Error tint bg |
| `--color-red-400` | `#ff5150` | Error / destructive |

### Semantic aliases — use these in components, not raw values

| Token | Resolves to | Use for |
|---|---|---|
| `--color-surface-primary` | `#ffffff` | Cards, modals, panels |
| `--color-surface-dashboard` | `#fcfcfc` | Page background |
| `--color-surface-fg-01` | `#f4f4f4` | Input fills, ghost surfaces |
| `--color-surface-stroke` | `#eaeaea` | All borders and dividers |
| `--color-frame` | `#f0f0f0` | Skeleton / placeholder frames |
| `--color-text-heading-01` | `#000000` | Page titles, H1–H2 |
| `--color-text-heading-02` | `#171717` | Section headings |
| `--color-text-heading-04` | `#424242` | Card headings, nav active |
| `--color-text-heading-05` | `#5a5a5a` | Subheadings, body |
| `--color-text-heading-06` | `#777777` | Labels, captions, meta |
| `--color-text-body` | `#5a5a5a` | Default paragraph text |
| `--color-btn-primary-bg` | `#1969fe` | Primary button fill |
| `--color-btn-primary-text` | `#ffffff` | Primary button label |
| `--color-spot-blue` | `#1969fe` | Active listings spot icon |

### Color usage rules

- **One primary action per view** — only `--color-btn-primary-bg` gets the blue fill
- **Spot colors map to listing states**: blue → active, yellow → draft, purple → unassigned, red → error/alert
- Tint variants (`-100`) are used as icon badge backgrounds paired with their `500` icon
- Never use raw grey values for text — always use a `--color-text-*` semantic token
- The sidebar background is `--color-grey-950`; all nav text on dark bg uses `--color-white` or `--color-grey-400`

---

## 3. Typography

### Font families

| Token | Family | Role |
|---|---|---|
| `--font-sans` | `"Geist", sans-serif` | All UI text — labels, body, captions, buttons |
| `--font-display` | `"Helvetica Neue", Helvetica, Arial, sans-serif` | Large display headings (H4, H6 size class) |

Geist handles everything functional. Helvetica Neue appears only at large heading sizes (19px+) to add typographic contrast.

### Type scale

| Token | Size | Weight | Line-height | Family | Use |
|---|---|---|---|---|---|
| `--text-h4` / `--weight-medium` | `29px` | `500` | `1.2` | Display | Hero headings, page titles |
| `--text-h6` / `--weight-medium` | `19px` | `500` | `1.2` | Display | Section headings |
| `--text-body` / `--weight-regular` | `16px` | `400` | `1.406` | Sans | Default body copy |
| `--text-caption-1` / `--weight-regular` | `14px` | `400` | `1.2` | Sans | Card labels, nav items |
| `--text-caption-1` / `--weight-medium` | `14px` | `500` | `1.2` | Sans | Emphasized labels, stat values |
| `--text-caption-2` / `--weight-regular` | `12px` | `400` | `1.2` | Sans | Secondary meta text |
| `--text-caption-2` / `--weight-medium` | `12px` | `500` | `1.2` | Sans | Tags, badges |
| `--text-caption-3` / `--weight-regular` | `10px` | `400` | `1.2` | Sans | Fine print, timestamps |
| `--text-caption-3` / `--weight-medium` | `10px` | `500` | `1.2` | Sans | Micro labels, step indicators |

### Typography rules

- Use `--leading-tight` (1.2) for all headings and captions
- Use `--leading-body` (1.406) only for paragraph / multi-line body copy
- Never go below `--text-caption-3` (10px) for readable UI text
- Stat numbers use `--text-h4` + `--weight-medium` + `--font-display`

---

## 4. Spacing Rhythm

| Token | Value | Typical use |
|---|---|---|
| `--space-0` | `0px` | Reset / flush |
| `--space-2` | `2px` | Icon nudges, micro gaps |
| `--space-4` | `4px` | Icon padding, tight inline gaps |
| `--space-6` | `6px` | Badge padding, compact row gaps |
| `--space-8` | `8px` | Input padding (vertical), icon-to-label gap |
| `--space-10` | `10px` | Card inner padding (vertical), nav item padding |
| `--space-12` | `12px` | Card inner padding (horizontal), button padding |
| `--space-14` | `14px` | Section sub-gap |
| `--space-16` | `16px` | Default component gap, field spacing |
| `--space-20` | `20px` | Card-to-card gap, section content gap |
| `--space-24` | `24px` | Section header gap |
| `--space-32` | `32px` | Page section spacing |
| `--space-40` | `40px` | Large layout gaps |
| `--space-64` | `64px` | Page-level padding, hero sections |

**Rhythm rule:** prefer `--space-8 / 12 / 16 / 24 / 32` for vertical rhythm. Use odd values (10, 14) only when matching the Figma spec exactly.

---

## 5. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Badges, tags, small chips |
| `--radius-md` | `6px` | Input fields, dropdowns, small buttons |
| `--radius-lg` | `8px` | Secondary buttons, compact cards |
| `--radius-xl` | `10px` | Primary cards, panels, main content containers |
| `--radius-2xl` | `16px` | Modal dialogs, large cards |
| `--radius-3xl` | `18px` | Featured/hero cards |
| `--radius-4xl` | `20px` | Large overlays, image containers |
| `--radius-full` | `9999px` | Avatars, pill buttons, circular icons |

**Rule:** cards and main content panels use `--radius-xl` (10px) as standard. Never mix radius values within the same card.

---

## 6. Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-xs` | `0px 0px 4px 0px rgba(0,0,0,0.08)` | Focused inputs, hovered icons |
| `--shadow-soft` | `0px 0px 4px 0px rgba(186,186,186,0.25)` | Floating tooltips, popovers |
| `--shadow-card` | `0px 2px 1.5px rgba(234,234,234,0.15), 0px 0px 1.5px rgba(235,234,234,0.25)` | Default card resting state |
| `--shadow-sm` | `0px 2px 8px 0px rgba(232,230,230,0.2)` | Hovered card |
| `--shadow-md` | `0px 2px 13.3px 0px rgba(197,197,197,0.1)` | Dropdown menus, date pickers |
| `--shadow-lg` | `0px 6px 14px 0px rgba(135,133,133,0.12)` | Modal dialogs, raised panels |
| `--shadow-inset-sm` | `inset 0px 1.5px 2px 0px rgba(0,0,0,0.08)` | Pressed button state |
| `--shadow-inset-light` | `inset 0px 1.5px 2px 0px #ffffff` | Inner highlight on pill/chip |
| `--shadow-inset-focus` | `inset 0px 0px 4px 0px #1969fe` | Focus ring on inputs |
| `--shadow-inset-inner` | `inset 0px -2px 1px 0px rgba(244,244,244,0.4)` | Bottom-lit surfaces |

**Rules:**
- Use `--shadow-card` at rest, `--shadow-sm` on hover — never jump to `--shadow-lg`
- Focus states always use `--shadow-inset-focus` — never browser default outline
- Dark surfaces carry no shadow — shadows only on white/light surfaces

---

## 7. Component Patterns

### Sidebar Navigation
- Fixed left sidebar, `--color-grey-950` background, exactly **168px** wide, full height
- Logo at top with `--space-16` padding all around
- Nav section labels (MAIN NAVIGATION, ADMIN): `--text-caption-3`, `--weight-medium`,
  `--color-grey-400`, uppercase, `--space-6` bottom margin
- Nav items: icon + label, `--text-caption-1` / `--weight-medium`, height 40px,
  `--space-10` vertical padding, `--space-12` horizontal padding
- Icon-to-label gap: `--space-8`
- Active item: `--color-text-heading-04` text, `--color-blue-100` background,
  2px left border in `--color-blue-500`
- Inactive item: `--color-grey-400` text, no background
- Hover item: `--color-surface-fg-01` background, `--color-text-heading-05` text
- Transition: none — snap states, no animation
- Admin items with children: chevron icon right-aligned, rotates on expand
- Badge count: small pill, `--color-blue-500` bg, white text, `--radius-full`,
  `--text-caption-3` / `--weight-medium`

### Setup / Onboarding Card (Sidebar)
- Dark card (`--color-grey-950`), inverted text (`--color-white`)
- Progress indicator: "Step X/Y Completed" in `--text-caption-3`, `--color-grey-400`
- CTA button: white fill, dark text — inverted primary button pattern
- `--radius-xl`, `--space-16` padding, positioned at bottom of sidebar above user row

### User Profile Row (Sidebar Bottom)
- Avatar (32px, `--radius-full`) + name + email stacked
- `--space-16` padding all around
- Top border: `1px solid rgba(255,255,255,0.08)`
- Chevron icon right-aligned for account menu trigger

### Top Navigation Bar
- Full width, fixed height: **64px**, bg: `--color-surface-primary`
- Bottom border: `1px solid --color-surface-stroke`
- Padding: `--space-16` horizontal
- Left: "Welcome, [Name]!" — "Welcome," in `--weight-regular`,
  name in `--weight-semibold`, both `--text-caption-1`, `--color-text-heading-01`
- Center: Search input, `--radius-md`, bg: `--color-surface-fg-01`,
  border: `1px solid --color-surface-stroke`, placeholder: "Search" in `--color-grey-400`,
  keyboard shortcut hint right-aligned inside field in `--text-caption-2`
- Right: notification bell icon (`--color-text-heading-06`) + user avatar
  (32px, `--radius-full`), gap: `--space-16`

### Page Header
- White bar below top nav, bg: `--color-surface-primary`
- Bottom border: `1px solid --color-surface-stroke`
- Left: page title (`--text-h6`, `--font-display`, `--color-text-heading-01`) +
  subtitle below (`--text-caption-1`, `--color-text-heading-06`)
- Right: action buttons (primary + secondary), gap: `--space-8`
- Padding: `--space-16` vertical, `--space-32` horizontal

### Stat Cards (Dashboard)
- White card (`--color-surface-primary`), `--radius-xl`, `--shadow-card`
- Icon: 40×40 tinted square (`--radius-lg`), spot color bg + spot color icon
- Large number: `--text-h4`, `--font-display`, `--color-text-heading-01`
- Label below number: `--text-caption-2`, `--color-text-heading-06`
- Four cards in equal-width grid, gap: `--space-16`
- Internal padding: `--space-16` vertical, `--space-20` horizontal

### Buttons

**Primary**
- bg: `--color-btn-primary-bg`, text: `--color-btn-primary-text`
- `--radius-md`, `--shadow-xs` at rest, `--shadow-inset-sm` on press
- Font: `--text-caption-1`, `--weight-medium`
- Padding: `--space-10` vertical, `--space-12` horizontal

**Secondary / Ghost**
- Border: `1px solid --color-surface-stroke`, bg: transparent
- Text: `--color-text-heading-04`, icon: `--color-icon-button-secondary`
- Same radius and padding as primary

### Input Fields
- Border: `1px solid --color-surface-stroke`, bg: `--color-surface-primary`
- `--radius-md`, padding: `--space-12` horizontal, `--space-10` vertical
- Placeholder: `--color-grey-400`
- Focus: `--shadow-inset-focus`, border shifts to `--color-blue-500`
- Icon-prefixed inputs: icon left-aligned inside field, `--color-grey-400`

### Tab Bar
- Underline style — active tab has `2px` bottom border in `--color-blue-500`
- Active label: `--color-text-heading-04`, `--weight-medium`
- Inactive label: `--color-text-heading-06`, `--weight-regular`
- Font: `--text-caption-1`, no background fill on tabs

### Empty States
- Centered illustration, `--color-grey-400` stroke
- Heading: `--text-h6`, `--color-text-heading-01`
- Subtext: `--text-body`, `--color-text-body`
- CTA: primary button centered below text

### Loading Skeletons
- Background: `--color-frame` (`#f0f0f0`)
- Apply `--radius-xl` on all skeleton blocks to match their live counterparts
- Dimensions must match the exact size of the content they replace
- No animation unless explicitly requested

### Error States
- Background: `--color-red-100`, icon and text: `--color-red-400`
- Same layout structure as empty states — illustration replaced with error icon
- Heading: `--text-h6`, `--color-text-heading-01`
- Subtext: `--text-body`, `--color-text-body`
- CTA: primary button if a recovery action exists

### Spot Icon Badges (Status Indicators)

| Status | Bg token | Icon/text token |
|---|---|---|
| Active | `--color-blue-100` | `--color-blue-500` |
| Draft | `--color-yellow-100` | `--color-yellow-500` |
| Unassigned | `--color-purple-100` | `--color-purple-500` |
| Alert / Error | `--color-red-100` | `--color-red-400` |

Badge container: `--radius-lg`, padding `--space-8`, size ~40×40px

---

## 8. Layout

- **Sidebar:** fixed, exactly **168px** wide, full-height, `--color-grey-950`
- **Main content:** fills remaining width, bg `--color-surface-dashboard`
- **Top nav bar:** fixed, full width minus sidebar, height 64px, `--color-surface-primary`
- **Page header:** white bar below top nav, title + subtitle + actions, bottom border
- **Content area padding:** `--space-32` on all sides
- **Card grid:** CSS grid, equal columns, gap `--space-16`
- **Z-index order:** sidebar → top nav → modals → tooltips

### Next.js Layout Assembly
- `layout.tsx` wraps all pages — Sidebar and Navbar components live here only
- Individual `page.tsx` files render only their own content area
- Never rebuild Sidebar or Navbar inside a page component
- Main content area uses `ml-[--sidebar-width]` and `pt-[--topnav-height]`
  to offset from the fixed sidebar and top nav
- All pages share the same shell automatically via App Router

---

## 9. Interaction States

- **Hover:** background shifts one step lighter/darker, no scale transform
- **Active/Pressed:** `--shadow-inset-sm` on buttons
- **Focus:** `--shadow-inset-focus` on inputs — never use browser default outline
- **Disabled:** `--color-grey-150` border, `--color-grey-400` text, no shadow, cursor not-allowed
- **Transition:** none on nav items. `150ms ease` on buttons and inputs only.

---

## 10. Component File Map

Never rebuild these inside page files. Every reusable element has a fixed home.

| Component | File path |
|---|---|
| Sidebar | `/src/components/Sidebar.tsx` |
| Top navigation bar | `/src/components/Navbar.tsx` |
| Stat card | `/src/components/StatCard.tsx` |
| Listing card | `/src/components/ListingCard.tsx` |
| Modal | `/src/components/Modal.tsx` |
| Tab bar | `/src/components/TabBar.tsx` |
| Empty state | `/src/components/EmptyState.tsx` |
| Error state | `/src/components/ErrorState.tsx` |
| Skeleton loader | `/src/components/Skeleton.tsx` |
| Spot icon badge | `/src/components/SpotBadge.tsx` |
| Button | `/src/components/Button.tsx` |
| Input field | `/src/components/Input.tsx` |

---

## 11. Ready-to-Paste `@theme` Block

```css
@import "tailwindcss";

@theme {
  /* Colors — Base */
  --color-white:          #ffffff;
  --color-black:          #000000;
  --color-grey-10:        #fcfcfc;
  --color-grey-50:        #f4f4f4;
  --color-grey-100:       #eaeaea;
  --color-grey-150:       #dfdfdf;
  --color-grey-400:       #aaaaaa;
  --color-grey-950:       #101010;
  --color-blue-100:       #d1e1ff;
  --color-blue-150:       #bad2ff;
  --color-blue-400:       #4787fe;
  --color-blue-500:       #1969fe;
  --color-yellow-100:     #fcebd5;
  --color-yellow-500:     #ee9c2e;
  --color-purple-100:     #e1def5;
  --color-purple-500:     #6a59ce;
  --color-red-100:        #ffd3d3;
  --color-red-400:        #ff5150;

  /* Colors — Semantic */
  --color-surface-primary:        #ffffff;
  --color-surface-dashboard:      #fcfcfc;
  --color-surface-fg-01:          #f4f4f4;
  --color-surface-stroke:         #eaeaea;
  --color-frame:                  #f0f0f0;
  --color-text-heading-01:        #000000;
  --color-text-heading-02:        #171717;
  --color-text-heading-04:        #424242;
  --color-text-heading-05:        #5a5a5a;
  --color-text-heading-06:        #777777;
  --color-text-body:              #5a5a5a;
  --color-icon-nav-active:        #424242;
  --color-icon-explainer:         #777777;
  --color-icon-button-primary:    #ffffff;
  --color-icon-button-secondary:  #212121;
  --color-btn-primary-bg:         #1969fe;
  --color-btn-primary-text:       #ffffff;
  --color-spot-blue:              #1969fe;

  /* Typography */
  --font-sans:        "Geist", sans-serif;
  --font-display:     "Helvetica Neue", Helvetica, Arial, sans-serif;
  --text-h4:          29px;
  --text-h6:          19px;
  --text-body:        16px;
  --text-caption-1:   14px;
  --text-caption-2:   12px;
  --text-caption-3:   10px;
  --weight-regular:   400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --leading-tight:    1.2;
  --leading-body:     1.406;

  /* Spacing */
  --space-0:    0px;
  --space-2:    2px;
  --space-4:    4px;
  --space-6:    6px;
  --space-8:    8px;
  --space-10:   10px;
  --space-12:   12px;
  --space-14:   14px;
  --space-16:   16px;
  --space-20:   20px;
  --space-24:   24px;
  --space-32:   32px;
  --space-40:   40px;
  --space-64:   64px;

  /* Layout */
  --sidebar-width:  168px;
  --topnav-height:  64px;

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-xl:   10px;
  --radius-2xl:  16px;
  --radius-3xl:  18px;
  --radius-4xl:  20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs:          0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  --shadow-soft:        0px 0px 4px 0px rgba(186, 186, 186, 0.25);
  --shadow-card:        0px 2px 1.5px 0px rgba(234, 234, 234, 0.15),
                        0px 0px 1.5px 0px rgba(235, 234, 234, 0.25);
  --shadow-sm:          0px 2px 8px 0px rgba(232, 230, 230, 0.2);
  --shadow-md:          0px 2px 13.3px 0px rgba(197, 197, 197, 0.1);
  --shadow-lg:          0px 6px 14px 0px rgba(135, 133, 133, 0.12);
  --shadow-inset-sm:    inset 0px 1.5px 2px 0px rgba(0, 0, 0, 0.08);
  --shadow-inset-light: inset 0px 1.5px 2px 0px #ffffff;
  --shadow-inset-focus: inset 0px 0px 4px 0px #1969fe;
  --shadow-inset-inner: inset 0px -2px 1px 0px rgba(244, 244, 244, 0.4);
}
```
