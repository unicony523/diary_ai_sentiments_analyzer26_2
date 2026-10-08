---
name: Pastel Cloud Diary
colors:
  surface: '#f6faff'
  surface-dim: '#bedef9'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ebf5ff'
  surface-container: '#e0f0ff'
  surface-container-high: '#d4ebff'
  surface-container-highest: '#c9e6ff'
  on-surface: '#001e2f'
  on-surface-variant: '#42474e'
  inverse-surface: '#113348'
  inverse-on-surface: '#e5f2ff'
  outline: '#72787f'
  outline-variant: '#c2c7cf'
  surface-tint: '#336289'
  primary: '#336289'
  on-primary: '#ffffff'
  primary-container: '#7ca9d4'
  on-primary-container: '#003e63'
  inverse-primary: '#9ecbf8'
  secondary: '#834f5e'
  on-secondary: '#ffffff'
  secondary-container: '#ffbdce'
  on-secondary-container: '#7c4958'
  tertiary: '#6e5d1e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b9a35d'
  on-tertiary-container: '#473900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#9ecbf8'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#154a70'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#f7b5c6'
  on-secondary-fixed: '#340e1b'
  on-secondary-fixed-variant: '#683847'
  tertiary-fixed: '#fae195'
  tertiary-fixed-dim: '#dcc57b'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#554506'
  background: '#f6faff'
  on-background: '#001e2f'
  surface-variant: '#c9e6ff'
typography:
  display-lg:
    fontFamily: Comfortaa
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Comfortaa
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Comfortaa
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Comfortaa
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  title-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  label-md:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Quicksand
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system expresses a soothing, tender, and whimsical diary aesthetic inspired by daydream skies, soft cumulus clouds, and iridescent stationery stickers. The brand personality is gentle, comforting, nostalgic, and playful. It serves users seeking mindful journaling, personal reflection, cozy habit tracking, and cute aesthetic storytelling.

The visual style blends **Soft Tactile Neomorphism** with **Pastel Stationery Minimalism**. Surfaces emulate creamy, rounded diary sheets floating over soft atmospheric sky backdrops. Tactile cues are gentle—pillowy elevations, dreamy luminous gradients, soft-toned strokes reminiscent of gel pens, and iridescent accent stickers. High-contrast harsh borders are strictly avoided in favor of friendly curves, generous inner breathing space, and cloud-like tactile warmth.

## Colors

The palette is rooted in airy pastel sky gradients, warm cream stationery sheets, and playful marshmallow accents:

- **Primary (`#7CA9D4`)**: A deeper, restful sky blue used for actionable elements, key active states, icons, and emphasized headings. Supported by cloud tints: `#C6E2F7` (soft mist) and `#EBF5FB` (sky tint background fill).
- **Secondary (`#F7B5C6`)**: A soft strawberry-cream pastel pink used for joyful highlights, favorite heart toggles, mood tags, and holographic sticker accents.
- **Tertiary (`#FFE699`)**: A sweet buttercup/peach tint (`#FFE699` paired with `#FFD1B3`) for warm highlights, sunny weather icons, and attention-worthy callout tags.
- **Neutral (`#4C6B82`)**: A muted soft denim blue-gray that replaces harsh black, providing crisp readability with a gentler, pen-and-ink diary warmth. Neutral surface fills include `#FBFDFE` (cream cloud white) and `#F0F6FA` (tinted canvas backdrops).

Holographic and dreamy sticker elements should utilize smooth multi-stop linear gradients blending `#C6E2F7`, `#F7B5C6`, and `#FFE699` at a 45-degree angle.

## Typography

The typographic hierarchy pairs **Comfortaa** (display & headers) with **Quicksand** (body & labels) to evoke a friendly, rounded, handwritten-adjacent charm while preserving digital legibility.

- **Headlines & Titles**: Comfortaa provides organic, circular geometry that mimics rounded bubble lettering and playful stationery headers.
- **Body & Labels**: Quicksand offers proportional rounded terminals that maintain high legibility for diary entries, multi-line notes, and metadata chips.
- **Rhythm & Lined-paper Alignment**: For journaling surfaces, body text line-height aligns strictly with a 24px or 28px ruled baseline grid, mirroring lined notebook stationery with light pastel-blue ruling (`rgba(162, 201, 228, 0.35)`).

## Layout & Spacing

The layout model simulates layered diary sheets, memo notes, and decorative planner spreads. It utilizes a fluid responsive container system constrained to comfortable reading widths on large devices (maximum content width: 1040px).

- **Mobile (<640px)**: A 4-column layout with 1rem canvas padding, allowing maximum focus on one journal card or entry sheet at a time.
- **Tablet (640px - 1024px)**: An 8-column layout accommodating side-by-side note lists and active writing canvas.
- **Desktop (>1024px)**: A 12-column layout organized like an open stationery desk: left navigation/calendar, central paper page, and right sticker/mood palette.
- **Component Padding**: Containers, cards, and modal dialogs adopt generous internal padding (`space-lg` to `space-xl`) to enhance the airy, floating cloud feel.

## Elevation & Depth

Elevation conveys the feeling of plush paper stickers, floating cloud puffs, and pressed diary sheets:

- **Level 0 (Flat / Lined Paper Canvas)**: Background canvas filled with light sky tint (`#EBF5FB`) or cream white (`#FBFDFE`), using subtle ruled borders (`1px solid rgba(198, 226, 247, 0.45)`).
- **Level 1 (Stationery Pages & Cards)**: Soft, diffused cloud shadow. `box-shadow: 0 8px 24px -4px rgba(124, 169, 212, 0.16), 0 2px 6px rgba(124, 169, 212, 0.08)`. Outlines are gentle and semi-transparent: `1.5px solid rgba(255, 255, 255, 0.9)`.
- **Level 2 (Floating Pills, Floating Action Buttons & Stickers)**: Tactile floating lift. `box-shadow: 0 12px 28px -6px rgba(124, 169, 212, 0.28), 0 4px 10px rgba(247, 181, 198, 0.2)`. Top edge highlights use a fine inner reflection (`box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8)`).
- **Iridescent Hologram Accents**: Decorative elements employ soft backdrop blurs (`backdrop-filter: blur(8px)`) with pearlescent rainbow gradient borders and ambient peach-pink glimmers.

## Shapes

The shape vocabulary revolves around pillow curves, organic clouds, and complete pill capsules (`roundedness: 3`).

- **Pill Shapes (`border-radius: 9999px`)**: Interactive buttons, input badges, status chips, and date headers.
- **Cloud Sheets & Cards (`border-radius: 24px` to `32px`)**: Diary pages, modal sheets, and card tiles use generous corners that soften interface boundaries.
- **Notched Stationery Details**: Specific stationery cards feature scallop edges or soft corner cut-outs reminiscent of vintage die-cut memo paper.

## Components

### Buttons
- **Primary Button**: Full pill capsule shape (`border-radius: 9999px`), pastel sky blue fill (`#7CA9D4`), white bold text, and a soft ambient shadow. Hover state triggers a subtle scale-up (`scale(1.02)`) with intensified pink-blue glow.
- **Secondary / Sticker Button**: Soft white/cream surface (`#FBFDFE`) framed by a 2px pastel border (`#C6E2F7`), text in neutral denim (`#4C6B82`).
- **Ghost / Mood Button**: Transparent pill with light pastel peach or pink tint upon hover, adorned with cute character icons.

### Chips & Mood Badges
- Compact pill elements (`height: 32px`, `padding: 0 14px`) with soft gradient backgrounds (e.g., iridescent pink-to-yellow or cloud blue). Text is set in `label-md` with accompanying cloud/star emoji or micro-illustrations.

### Input Fields & Textareas
- Diary text fields sit on cream backgrounds (`#FBFDFE`) encased in soft 24px rounded containers, or directly overlay ruled notebook lines with no lateral borders. Focus states introduce a dreamy sky-blue ring (`0 0 0 3px rgba(198, 226, 247, 0.65)`).
- Placeholder text uses low-saturation sky gray (`#8FAABA`) styled like gentle pencil draft marks.

### Cards & Diary Sheets
- Main diary writing surfaces are white sheets (`#FBFDFE`) with 28px rounded corners, sitting over a sky blue backdrop. Subtle ruled lines run horizontally at 28px intervals. Outer corners can feature decorative holographic star or cloud badge overlays.

### Checkboxes & Radio Buttons
- **Checkboxes**: Rounded squares (`border-radius: 8px`) or cloud outlines. Checked state fills with soft sky-blue and reveals a hand-drawn-style cream checkmark.
- **Radio Buttons**: Concentric rounded pills or floating circles that reveal a soft pastel-pink heart or dot when activated.

### Decorative Cloud Stickers & Mood Trackers
- Floating sticker components feature a delicate white die-cut rim (`filter: drop-shadow(0 2px 4px rgba(124, 169, 212, 0.2))`) that users can drag, tap, or collect to express their daily feelings.