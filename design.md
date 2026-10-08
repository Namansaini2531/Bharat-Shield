# Design System Specification (Design.md)

## Overview

MiniMax stages itself as a Chinese AI infrastructure brand with a sophisticated dual identity. Marketing surfaces and platform pages anchor in stark white canvas with deep-black typographic emphasis — the brand voice is confident, technical, almost editorial. But each model release gets its own vibrant gradient identity card: M2.7 in volcanic coral-red, Music 2.6 in magenta-pink, Hailuo in deep blue, Speech 2.8 in saturated orange-purple. Together these vibrant tiles read like album covers laid out on the homepage — each one declaring its own product personality.

DM Sans anchors every surface from oversized 80px hero displays down to 12px micro labels. The geometric, slightly humanist character of the face suits both the dense documentation surfaces (where 14px body type carries 1.5 line-height for long-form prose) and the high-impact marketing displays (where -2px letter-spacing tightens 80px headlines). Buttons are universally pill-shaped (`rounded-full`) with a sharp two-tier system: black-pill primary (the dominant CTA) and outline-pill secondary. Cards split into two distinct families: vibrant gradient product showcases (32px corner softening) and quiet white documentation cards (16px corner softening).

**Key Characteristics:**
- Stark monochrome palette — black ({colors.primary}) and white ({colors.canvas}) — broken open by saturated brand-color gradient cards
- Distinct product-color encoding: each model line has its own vibrant brand color (coral M2.7, magenta Music 2.6, blue Hailuo, orange Speech 2.8)
- DM Sans across the entire system; Inter as fallback
- Pill-shaped buttons ({rounded.full}) and pill-shaped tabs everywhere; rectangular forms only inside data tables and dense docs
- Hero typography uses tight 1.10 line-height with -2px letter-spacing for impact
- Documentation surfaces use a 3-column layout: left sidebar nav, center prose body, right table-of-contents
- Black promo banners ({colors.primary}) above the nav for time-bound brand moments

## Colors

> Source pages: minimax.io/ (homepage), /models/text/m27 (product showcase), platform.minimax.io/docs/guides/models-intro (documentation), /subscribe/token-plan (pricing). Token coverage was identical across all four pages.

### Brand & Accent
- **Brand Coral** (`#ff4b3e` / `#ff5545`): Signature high-impact accent. Used on M2.7 product card, "Token Plan" hero band, promo CTA strips, and "NEW" badges. Carries the brand's most attention-grabbing energy.
- **Brand Magenta** (`#d926a9` / `#e02874`): Secondary product-card identity (Music 2.6); used for music/audio product encoding.
- **Brand Blue** (`#2563eb`): Hailuo video product identity; primary blue accent across the system.
- **Brand Blue Deep** (`#1e40af`): Form-control activation, link emphasis.
- **Brand Blue 700** (`#1d4ed8`): Documentation tag and reference text color.
- **Brand Cyan** (`#06b6d4`): Atmospheric blue for product gradients and decorative wash.
- **Brand Blue 200** (`#dbeafe`): Code badges, info-tag backgrounds.
- **Brand Purple** (`#7c3aed` / `#6d28d9`): Speech 2.8 and minor purple-product identity; gradient mate for magenta cards.

### Surface
- **Canvas White** (`#ffffff`): Primary page background and card surface.
- **Surface** (`#f8fafc` / `#16161a`): Subtle section backgrounds, search-pill rest, sidebar-nav active state.
- **Surface Soft** (`#f1f5f9` / `#1a1a1e`): Quieter section divisions.
- **Hairline** (`#e2e8f0` / `#2a2b30`): 1px input border and primary divider.
- **Hairline Soft** (`#f1f5f9` / `#1e1e24`): Quieter table-row divider and secondary section break.

### Text
- **Ink** (`#0f172a` / `#ffffff`): Primary headline and CTA text — the brand's near-black anchor.
- **Ink Strong** (`#000000` / `#ffffff`): Pure black used in promo banners and hero displays for maximum contrast.
- **Charcoal** (`#334155` / `#94a3b8`): Body text on light surfaces.
- **Slate** (`#64748b`): Secondary text, metadata.
- **Steel** (`#94a3b8` / `#64748b`): Tertiary text, table headers, sidebar inactive items.
- **Stone** (`#78716c` / `#a8a29e`): Muted captions and tab inactive labels.
- **Muted** (`#9ca3af` / `#71717a`): Footer link text and de-emphasized labels.

### Semantic
- **Success Background** (`#ecfdf5`): Pale-green wash for success badges and confirmations.
- **Success Text** (`#065f46`): Deep-green ink for success badge labels.
- Error tones derive from a `#d45656` / `#ef4444` red used in input border error states.

## Typography

### Font Family
**DM Sans** (primary): Geometric variable sans-serif. Used across every surface, every role. Fallbacks: Inter, Helvetica Neue, Helvetica, Arial. Monospace: `JetBrains Mono`.

DM Sans was chosen for its dual fluency: it scales cleanly from 80px hero displays (where -2px letter-spacing creates magazine-grade tightness) down to 12px micro labels (where the slightly humanist counters maintain legibility). The face has no italic variant in the brand's deployment — emphasis comes from weight (500/600/700) instead.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `typography.hero-display` | 80px | 600 | 1.10 | -2px | Homepage hero ("MiniMax Music 2.6") |
| `typography.display-lg` | 56px | 600 | 1.10 | -1.5px | Section openers, major page heroes |
| `typography.heading-lg` | 40px | 600 | 1.20 | -1px | Sub-page headlines ("Token Plan", "Models Overview") |
| `typography.heading-md` | 32px | 600 | 1.25 | -0.5px | Subsection headers ("Full-Stack Model Matrix") |
| `typography.heading-sm` | 24px | 600 | 1.30 | 0 | Card titles, feature headers |
| `typography.card-title` | 20px | 600 | 1.40 | 0 | Product-card titles, feature-tile headers |
| `typography.subtitle` | 18px | 500 | 1.50 | 0 | Section subtitles, lead body |
| `typography.body-md` | 16px | 400 | 1.50 | 0 | Primary body text |
| `typography.body-md-bold` | 16px | 700 | 1.50 | 0 | Body emphasis |
| `typography.body-sm` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `typography.body-sm-medium` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels |
| `typography.caption` | 13px | 400 | 1.70 | 0 | Documentation captions, fine print |
| `typography.caption-bold` | 13px | 600 | 1.50 | 0 | Badge labels, table-header text |
| `typography.micro` | 12px | 400 | 1.50 | 0 | Footer microcopy, chip labels |
| `typography.button-md` | 14px | 600 | 1.40 | 0 | Pill button labels |

### Principles
- **Tight hero leading** (1.10) and aggressive negative letter-spacing on display sizes create a magazine-quality typographic display.
- **Generous body leading** (1.50) keeps long-form documentation comfortable; captions push to 1.70 for scientific-paper-grade clarity.
- **Weight discipline:** 400 (body), 500 (medium emphasis), 600 (headings/buttons), 700 (strong inline emphasis). Heavier weights are not used.
- **Single typeface** strategy — never mix DM Sans with another sans-serif. Monospace fallback for code.

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment).
- **Tokens**: `spacing.xxs` (4px) · `spacing.xs` (8px) · `spacing.sm` (12px) · `spacing.md` (16px) · `spacing.lg` (20px) · `spacing.xl` (24px) · `spacing.xxl` (32px) · `spacing.xxxl` (40px) · `spacing.section-sm` (48px) · `spacing.section` (64px) · `spacing.section-lg` (80px) · `spacing.hero` (96px).
- **Section rhythm**: Marketing pages separate at `spacing.hero` (96px) above-fold, then `spacing.section-lg` (80px) below; documentation tightens to `spacing.section` (64px); table rows compress to `spacing.md` (16px).
- **Card internal padding**: Vibrant product cards use `spacing.xxl` (32px); documentation cards use `spacing.lg`–`spacing.xl` (20–24px); promo strips expand to `spacing.section` (64px).

### Grid & Container
- Marketing pages use a 1280px max-width with 32px gutters.
- Homepage product matrix renders as a 4-column row of 32px-rounded gradient cards, each ~280–320px wide.
- AI Product Matrix below uses a 4-column grid with 16px/24px-rounded cards.
- Documentation surfaces use a 3-column layout: left sidebar nav (~220px), center prose body (~720px max-width), right TOC (~180px).

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `rounded.xs` | 4px | Code chips, micro-controls |
| `rounded.sm` | 6px | Compact controls, table cells |
| `rounded.md` | 8px | Inputs, search pill |
| `rounded.lg` | 12px | Recommendation tiles |
| `rounded.xl` | 16px | Standard feature cards, quiet white documentation cards |
| `rounded.xxl` | 20px | Larger feature panels |
| `rounded.xxxl` | 24px | AI product tile feature variants |
| `rounded.hero` | 32px | Vibrant gradient product cards, promo CTA strip |
| `rounded.full` | 9999px | All buttons, all pill tabs, all badges |

### Photography Geometry
- Vibrant product cards use 32px corner softening — distinct from the 16px used on quiet white cards. The doubled radius is the visual signature of "this is a featured product moment."
- Product imagery inside cards is treated as photographic content without rounded internal frames.
- Avatar circles are `rounded.full` (perfect circles).

## Components

### Buttons
- **`button-primary`** — Black pill primary CTA (`rounded-full`, 11px 24px, 14px font, weight 600).
- **`button-secondary`** — Outlined pill secondary action (`rounded-full`, 11px 24px, 1px solid ink).
- **`button-tertiary`** — White-fill quiet pill (`rounded-full`, 11px 24px, 1px solid hairline).
- **`button-icon-circular`** — 36×36px circular utility button (`rounded-full`).

### Vibrant Product Cards
- **`product-card-coral`** — Coral gradient background (`#ff4b3e`), white text, 32px radius (`rounded.hero`), 32px padding.
- **`product-card-magenta`** — Magenta gradient background (`#d926a9`), white text, 32px radius, 32px padding.
- **`product-card-blue`** — Blue gradient background (`#2563eb`), white text, 32px radius, 32px padding.
- **`product-card-purple`** — Purple gradient background (`#7c3aed`), white text, 32px radius, 32px padding.

### Cards & Containers
- **`card-base`** — Standard documentation/feature card (16px radius, 1px hairline border, 20-24px padding).
- **`ai-product-tile`** — AI Product Matrix tile (24px radius, 1px hairline border, icon top, card title, description).
- **`promo-cta-card`** — Saturated coral/gradient strip (32px radius) with embedded white pill CTA.

### Tabs
- **`pill-tab`** & **`pill-tab-active`** — Pill-shaped tabs (`rounded.full`, active state switches to solid black/primary).
- **`segmented-tab`** & **`segmented-tab-active`** — Underline-style navigation tabs.

### Badges & Status
- **`badge-success`** — Pale-green confirmation badge (`rounded.full`).
- **`badge-new`** — Coral "NEW" / "Live" pill (`rounded.full`).
- **`badge-beta`** — Pale-blue "BETA" pill (`rounded.full`).
- **`badge-code`** — Inline code chip (`rounded.sm`).
- **`promo-banner`** — Sticky black promotional strip above top nav.

## Do's and Don'ts

### Do
- Use black (`colors.primary` / `ink`) as the dominant CTA pill.
- Reserve product brand colors (coral, magenta, blue, purple) ONLY for product-identity moments and vibrant cards.
- Pair 32px gradient cards with 16px/24px cards in the same viewport.
- Apply `rounded.full` (9999px) to every button, every pill tab, every badge.
- Use DM Sans with tight line-height and negative letter-spacing for headlines.

### Don't
- Don't use brand colors on generic body text or large background surfaces.
- Don't use square or slightly rounded buttons — pills (`rounded-full`) are mandatory.
- Don't mix multiple sans-serif typefaces.
- Don't use heavy drop shadows on flat documentation cards.
