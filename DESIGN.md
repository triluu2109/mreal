# Design System: M-Real Estate
**Framework:** Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui  
**Source:** `src/app/globals.css`, component library in `src/components/`

---

## 1. Visual Theme & Atmosphere

**Mood:** "Premium Navy & Gold" — authoritative, luxurious, and trustworthy. The design communicates prestige and financial security, drawing directly from the logo's iconic Navy + Gold palette.

The aesthetic is anchored by **Deep Navy Blue** (`#1D2E6F`) as the primary structural color paired with **Rich Metallic Gold** (`#C9971D`) as the accent. These sit on a **Pure White** canvas with **Pale Frost** section alternation. The result feels like a premium private banking experience applied to real estate — confident, heritage-rich, and premium.

**Density:** Medium. Generous vertical section padding (`80px`) creates breathing room between content blocks. Card grids maintain comfortable 20–24px gutters. Not sparse, not cluttered.

**Motion Style:** Purposeful scroll-triggered animations via Framer Motion (`whileInView`, `once: true`). Fade-in + slide-up as default (opacity 0→1, y 24→0, 0.5s). Hover: cards lift 4–6px with navy shadow deepen. No excessive motion.

---

## 2. Color Palette & Roles

### Primary Brand Colors (extracted from logo)

| Descriptive Name | Hex | Role |
|---|---|---|
| **Deep Midnight Navy** | `#1D2E6F` | Primary brand color. TopBar bg, CTA buttons, heading accents, nav hover, floating phone button. Drawn from "REAL" text in logo. |
| **Bright Navy Azure** | `#2A3E8F` | Light navy. Hover state for primary buttons, link hover backgrounds (`bg-navy/5`). |
| **Abyssal Navy Dark** | `#141F4A` | Dark navy. Active/pressed button state, depth gradient endpoint in Vision/Mission section. |
| **Rich Metallic Gold** | `#C9971D` | Accent brand color. Section label text, price highlights, icon accents, "Gửi bán" TopBar CTA, footer column headings. Drawn from "ESTATE" text and building gradient in logo. |
| **Warm Harvest Gold** | `#DDB840` | Light gold. Hover state on gold buttons, gradient endpoints. |
| **Aged Antique Gold** | `#A37A12` | Dark gold. Pressed/active gold button state. |

### Neutral Backbone

| Descriptive Name | Hex | Role |
|---|---|---|
| **Ink Near-Black** | `#1C1C2E` | Primary text color (slightly warmer than pure black, with a hint of navy). All headings, body foreground. |
| **Charcoal Shadow** | `#2D2D44` | Secondary dark with navy undertone. Subtle dark backgrounds. |
| **Pale Frost** | `#F5F5F5` | Section alternating background. Creates visual rhythm between white and off-white sections. |
| **Urban Gray Text** | `#666666` | Body paragraphs, descriptions, meta info. Clearly secondary. |
| **Steel Border** | `#E0E0E0` | Borders for cards, inputs, dividers. Light and unobtrusive. |
| **Soft Pewter** | `#999999` | Muted placeholder text, timestamps, meta labels. |

### Semantic UI Tokens

| Token | Value | Role |
|---|---|---|
| `--primary` | `#1D2E6F` (Deep Navy) | shadcn primary actions |
| `--accent` | `#C9971D` (Metallic Gold) | Accent/ring color |
| `--background` | `#FFFFFF` | Page canvas |
| `--foreground` | `#1C1C2E` | Default text |
| `--ring` | `#C9971D` | Focus ring / selection highlight |

### Section-Specific Color Context

- **TopBar:** Deep Navy (`#1D2E6F`) background, white text, Gold icons, Gold "Gửi bán" CTA pill
- **Navigation bar:** White background, Ink Near-Black text, Gold on hover
- **Hero Section:** Full-bleed photography with dark-left gradient overlay, Navy "M-REAL ESTATE" pill badge
- **About Section:** White bg; navy floating badge card (7+ years), gold stats numbers, navy CTA button
- **Vision/Mission Section:** Full-width navy gradient (`navy-dark → navy → navy-light`) — the primary brand moment; glass-morphism frosted white cards
- **Combined Listings:** Gray-bg (`#F5F5F5`) — horizontal card rows; Sale column uses navy tabs + gold prices; Rental column uses gold accents + navy prices, separated by a navy border
- **Footer:** Ink Near-Black (`#1C1C2E`) body; Deep Navy CTA banner; Gold column headings; B&W logo with `brightness(0) invert(1)` filter

---

## 3. Typography Rules

### Font Families

| Usage | Font | Weight Range | CSS Variable |
|---|---|---|---|
| **Headings, Labels, Buttons** | Montserrat (Google Fonts) | 500, 600, 700, 800 | `--font-heading` |
| **Body, Paragraphs, UI text** | Inter (Google Fonts) | 400, 500, 600 | `--font-sans` |

Both fonts loaded with `subset: ["latin", "vietnamese"]` for correct Vietnamese diacritics.

### Heading Scale

- **H1 (Hero):** `clamp(2.5rem, 6vw, 4.5rem)`, Montserrat 800, white on dark overlay
- **H2 (Section):** `clamp(1.4rem, 2.5vw, 2.2rem)`, Montserrat 700, Ink Near-Black (`#1C1C2E`) with a keyword in Navy or Gold
- **H3 (Cards):** `0.875rem–1rem`, Montserrat 600, Ink Near-Black; transitions to Navy on hover
- **Body:** `0.875rem–1rem`, Inter 400, Urban Gray (`#666666`)

### Label Style (Section Labels)
- Font: Montserrat 600
- Size: `0.75rem` (12px)
- Letter spacing: `0.15em` (very wide)
- Case: ALL CAPS
- Color: **Deep Navy** (`#1D2E6F`) — changed from gold to navy to align with primary brand color
- Appears above every H2 as a category indicator

### Text Gradient
- Used for logo-style decorative text: `135deg`, Gold → Warm Harvest Gold
- Implementation: `-webkit-background-clip: text; -webkit-text-fill-color: transparent`

---

## 4. Component Stylings

### Buttons

**Primary / Navy CTA (`.btn-navy`):**
- Shape: Subtly rounded corners (`border-radius: 0.5rem`)
- Background: Deep Navy (`#1D2E6F`)
- Text: White, Montserrat 600
- Padding: `12px 32px`
- Hover: Navy-light + lifts `translateY(-1px)` + navy shadow (`0 4px 20px rgba(29,46,111,0.30)`)
- Active: Navy-dark

**Accent / Gold CTA (`.btn-gold`):**
- Shape: Same subtly rounded
- Background: Metallic Gold (`#C9971D`)
- Text: White, Montserrat 600
- Hover: Gold-light + lifts + gold shadow (`0 4px 16px rgba(201,151,29,0.40)`)
- Active: Antique Gold (`#A37A12`)

**Outline Button (`.btn-navy-outline`):**
- Transparent bg, 2px Navy border
- Hover: Fills with Navy, text inverts to white

**Ghost Link Button:**
- No border, no bg; gold or navy text; hover: arrow chevron shifts right

### Cards / Containers

**Horizontal Listing Cards (new CombinedListingsSection):**
- Layout: `flex` row — thumbnail (144–176px fixed width) + info panel
- Image: `overflow-hidden`, `group-hover:scale-105 transition-transform duration-500`
- Background: Pure White
- Shadow: Whisper-soft at rest → elevated on hover (navy-tinted shadow)
- Radius: Generously rounded (`rounded-xl`, 12px)
- For-sale price: Gold bold
- Rental price: Navy bold
- For-sale CTA chip: Navy border + navy hover fill
- Rental CTA chip: Gold border + gold hover fill

**Property & Project Cards (original grid style):**
- Same radius, shadow, and hover behavior
- Status badges: Pill-shaped (`rounded-full`), color-coded

**Vision/Mission Glass Cards:**
- Background: `rgba(255,255,255,0.10)`, hover `rgba(255,255,255,0.20)`
- Border: `rgba(255,255,255,0.20)`
- Backdrop blur: `backdrop-blur-sm`
- All text: white

**Footer Office Cards:**
- Background: `rgba(255,255,255,0.05)` on dark footer
- No visible border, rounded-xl

### Inputs / Forms

- Border: `1px solid #E0E0E0`
- Radius: `rounded-md` (~6px)
- Background: White
- Focus ring: 2px Gold (`#C9971D`)
- Error: Red border + red helper text

### Navigation (Header)

**TopBar:** Deep Navy (`#1D2E6F`) bg — white text — Gold icons and phone — Gold "Gửi bán" pill button

**Main Nav:** White bg — Ink Near-Black text — Gold on hover — dropdown with `slide-down` animation — sticky on scroll

### Floating Contact Buttons

- Position: Fixed, bottom-left corner (to avoid overlap with chatbot on bottom-right)
- Stack: Messenger (blue `#0099FF`) → Phone (Navy + pulsing gold ring) → Zalo (dark)
- Each: `48×48px` circle, `rounded-full`, elevated shadow

---

## 5. Layout Principles

### Combined Listings (Side-by-Side)

The key layout innovation: **Sale and Rental sections are displayed in a 2-column grid** instead of stacked vertically.

- Left column: For-sale listings (horizontal card rows, navy tabs, gold prices)
- Right column: Rental listings (horizontal card rows, green "Còn trống" badge, navy prices)
- Divider: `2px border-l border-navy/10` on large screens only
- Each column has its own section label, H2, and "Xem tất cả" link

### Grid System
- Responsive: `sm` 640px → `md` 768px → `lg` 1024px → `xl` 1280px
- Container max-width: `1280px`

### Whitespace Strategy
- Section padding: `80px` vertical (`.section-padding`)
- Card padding: `16–20px`
- Card grid gap: `20–24px`
- Between label + H2: `8–12px`

### Visual Rhythm (Section Alternation)
1. Navy TopBar → White Header (sticky)
2. Hero (full-bleed photography)
3. White → About
4. Navy gradient → Vision/Mission (brand moment)
5. Pale Frost → Combined Listings (Sale + Rental side by side)
6. White → New Projects
7. White → Documents
8. Pale Frost → News
9. Pale Frost → Booking Form
10. Navy CTA strip → Ink Near-Black → Footer

---

## 6. Icon System

- **Library:** Lucide React
- **Sizes:** `11–13px` inline; `16–22px` section/CTA; `22–28px` feature icons
- **Color:** Gold (`text-gold`) for decorative/spec icons; Navy (`text-navy`) for interactive icons; White on dark backgrounds
- **Style:** Outline (Lucide default) — clean, thin

---

## 7. Key Files Reference

| File | Role |
|---|---|
| `src/app/globals.css` | Master design tokens: Navy+Gold colors, radius, shadows, animations, utility classes |
| `src/app/layout.tsx` | Root layout: fonts (Inter + Montserrat), metadata (M-Real Estate) |
| `src/components/layout/Header.tsx` | Navy TopBar + white sticky nav + Gold CTA + search |
| `src/components/layout/Footer.tsx` | Navy CTA strip + Ink footer + BW logo + Gold section headers |
| `src/components/layout/FloatingButtons.tsx` | Fixed Messenger/Phone/Zalo (bottom-left) |
| `src/components/sections/HeroSection.tsx` | Full-bleed auto-slider with 4 project photos |
| `src/components/sections/AboutSection.tsx` | Split layout: images left + navy badge + gold stats + navy CTA |
| `src/components/sections/VisionMissionSection.tsx` | Full-width navy gradient + 3 glass cards |
| `src/components/sections/CombinedListingsSection.tsx` | **2-column side-by-side**: Sale (left) + Rental (right) with navy tabs |
| `src/components/sections/NewProjectsSection.tsx` | 5-col asymmetric: featured + 2 cards |
| `src/components/sections/DocumentsSection.tsx` | 3-col document library |
| `src/components/sections/NewsSection.tsx` | Featured article + article list |
| `src/components/sections/BookingFormSection.tsx` | M-Real Estate branded booking form |

---

## 8. Asset Structure

```
assets/
├── logo/
│   ├── logo.png              # Square color logo (navy/gold, "REAL ESTATE" icon)
│   ├── logo-rectangle.png    # Horizontal color logo — used in header
│   └── logo-rectangle-bw.png # Horizontal black logo — used in footer (with invert filter)
├── project/                  # Hero/section background images
└── cart/
    ├── 1PN/                  # 1-bedroom unit photos
    ├── 2PN/                  # 2-bedroom unit photos
    └── 3PN/                  # 3-bedroom unit photos
```

**Footer logo technique:** `logo-rectangle-bw.png` (black on white) + CSS `filter: brightness(0) invert(1)` = white logo on dark footer background.

---

## 9. Prompting Notes (for Stitch / AI Generation)

When generating new screens consistent with this system, use:

- *"Premium real estate website with Deep Navy Blue (#1D2E6F) as primary and Metallic Gold (#C9971D) as accent on a white canvas"*
- *"Montserrat headings in ink near-black (#1C1C2E); navy small-caps section labels with wide 0.15em letter-spacing"*
- *"Generously rounded cards (12px) with whisper-soft shadows that deepen with navy tint on hover"*
- *"Navy sticky header with gold icon accents and navy CTA phone button"*
- *"Full-width navy gradient section for Vision/Mission with glass-morphism white cards"*
- *"Side-by-side two-column listings: left column For Sale (navy tabs, gold prices), right column Rental (gold accents, navy prices), separated by a subtle navy divider"*
- *"Footer in ink near-black (#1C1C2E) with navy CTA banner, gold column headings, and white-inverted BW logo"*
