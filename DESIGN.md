---
name: Recitation Points
description: A ranked, tie-explicit class leaderboard that reads at a glance on a phone and from the back of a classroom.
colors:
  accent: "#1f4fd8"
  accent-foreground: "#fdfdfd"
  accent-soft: "#e7edfc"
  gold: "#7a5600"
  gold-soft: "#fbefc8"
  silver: "#27364d"
  silver-soft: "#d9e1ec"
  bronze: "#7c3f16"
  bronze-soft: "#f7e2d3"
  background: "#f6f6f7"
  surface: "#fdfdfd"
  surface-sunken: "#efeff1"
  foreground: "#18181b"
  muted-foreground: "#5c5c66"
  faint-foreground: "#6b6b75"
  border: "#e3e3e7"
  border-strong: "#cfcfd6"
  danger: "#b42318"
  success: "#12733f"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
    fontFeature: "\"ss01\""
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  numeral:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "\"tnum\""
  numeral-lead:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "\"tnum\""
  unit:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  skeleton: "6px"
  control: "8px"
  panel: "12px"
spacing:
  gutter: "16px"
  gutter-wide: "24px"
  column-gap: "32px"
  stack: "20px"
  control-x: "14px"
  touch: "44px"
  touch-admin: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.foreground}"
  chip-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  chip-nav-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  rank-chip:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.numeral}"
    rounded: "{rounded.control}"
    padding: "0 6px"
    height: "28px"
  rank-chip-gold:
    backgroundColor: "{colors.gold-soft}"
    textColor: "{colors.gold}"
  rank-chip-silver:
    backgroundColor: "{colors.silver-soft}"
    textColor: "{colors.silver}"
  rank-chip-bronze:
    backgroundColor: "{colors.bronze-soft}"
    textColor: "{colors.bronze}"
  board-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
  board-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    padding: "0 16px"
    height: "48px"
  input-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.numeral}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "48px"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
---

# Design System: Recitation Points

## Overview

**Creative North Star: "The Contest Board"**

This is the category-standard leaderboard executed at full craft: ranked rows on hairline-divided panels, numerals set in a monospace with tabular figures, and almost no color. It borrows its discipline from contest boards (dense ranked rows, explicit ties) and its finish from restrained product UI (one sans family, careful tracking, both themes treated as equals). The data is the only ornament; nothing on the page exists to celebrate, only to report.

The world is quiet zinc. Light is the default because the board is projected in lit classrooms; dark follows the system preference with a full parallel token set. One cobalt accent marks focus, primary actions, and links. Gold, silver, and bronze appear only as data, tinting the rank chips for places 1 to 3. Depth is flat: panels are separated by 1px borders and a one-step tonal shift from page to surface, and shadows exist only on overlays.

Density is high but legible. Rows are at least 48px tall, every control clears a 44px touch floor (48px on the admin), and the type ramp is short. Motion is a single entrance (rows rise in rank order and points count up once) plus feedback on change; under reduced motion everything renders final.

**Key Characteristics:**
- Zinc neutrals, light default, full dark parity via `prefers-color-scheme`.
- One cobalt accent; medal tints restricted to rank chips 1 to 3.
- Geist for words, Geist Mono tabular numerals for every rank, class number, point total, and time.
- 1px hairline borders and row dividers; flat at rest.
- Two radii: 8px controls and chips, 12px panels.
- Ties are always visible: a small "T" prefix inside the rank chip.

## Colors

A near-monochrome zinc palette carrying one cobalt voice and three medal tints that function as data, not decoration.

### Primary
- **Classroom Cobalt** (accent): the only interactive color. Primary buttons ("Add", "Log in", "Try again"), the admin "+1" button, the active section chip, inline links, the focus outline, text selection, the input caret, and the brief points-flash after a change. In dark it lifts to a lighter periwinkle (#7ea2ff) with near-black text on it.
- **Cobalt Wash** (accent-soft): hover fill behind accent-colored text links in the admin ("Go to girls").

### Secondary
- **Medal Gold / Gold Leaf Wash** (gold, gold-soft): text and fill of the rank-1 chip, and the favicon, which is a rank-1 chip.
- **Medal Silver / Silver Wash** (silver, silver-soft): text and fill of the rank-2 chip. A cool slate rather than grey, so it never reads as the neutral chip.
- **Medal Bronze / Bronze Wash** (bronze, bronze-soft): text and fill of the rank-3 chip.
Medal chips also carry an inset 1px ring in their own text color at 20% opacity.

### Neutral
- **Chalk Zinc** (background): the page ground and the sticky nav/header bars; also the fill of admin number inputs so they read as wells inside a surface sheet.
- **Paper Surface** (surface): panels, rows, secondary buttons, nav chips, the sheet, toasts.
- **Sunken Zinc** (surface-sunken): neutral rank chips (rank 4 and below), ghost-button hover fill, loading skeleton bars.
- **Ink** (foreground): all primary text and numerals.
- **Graphite** (muted-foreground): term line, meta text, column group labels, the "pts" unit, section names on non-medal rows, ghost-button text.
- **Faint Graphite** (faint-foreground): input placeholders only.
- **Hairline** (border): panel outlines, row dividers, header/footer rules.
- **Hairline Strong** (border-strong): hover border on secondary controls, input outlines, the admin "-1" and "Save total" outlines, scrollbar thumb.

### Status
- **Signal Red** (danger): validation messages, invalid input borders, the error toast icon; the error toast border uses it at 40% opacity.
- **Signal Green** (success): the success toast icon only.

### Named Rules
**The Medal-As-Data Rule.** Gold, silver, and bronze tint only the rank chip for places 1, 2, and 3 (and the rank-1 favicon). They never color panels, headings, rows, or celebration graphics.

**The One Cobalt Rule.** Cobalt means "this is the action or the current focus." It is never a panel fill, a heading color, or a decorative stripe.

**The Two-Theme Parity Rule.** Every color token has a light and a dark value in `:root`; components consume tokens only, so both themes ship from the same markup. Raster outputs (link preview, icons) use the light values as literals because they cannot follow a media query.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace) for all numerals

**Character:** One neutral grotesk does all the talking, tightened at display size; the mono with tabular figures turns every number into a column that aligns down the board. Stylistic set `ss01` is on globally.

### Hierarchy
- **Display** (600, 2rem mobile / 2.25rem tablet / 3rem desktop, leading-tight, -0.03em): the H1 "Recitation Points" only. Its term line sits beneath at 1.125 to 1.25rem, weight 500, normal tracking, Graphite.
- **Headline** (600, 1.125rem rising to 1.25rem at lg, -0.025em): the overall board title.
- **Title** (600, 1rem rising to 1.125rem at lg, -0.025em): section board titles, the admin header section name, the sheet title.
- **Body** (400, 15px, relaxed leading, max 60ch): descriptive copy and row labels (15px rising to 17px at lg; 16 to 18px on the overall board).
- **Label** (500 to 600, 0.875rem): buttons, chips, form labels, meta lines, column group labels ("Grade 9", "Boys") in Graphite.
- **Numeral** (Geist Mono 600, tabular): rank chips (14 to 16px), class numbers, point totals (16 to 24px), the "Points last updated" timestamp.
- **Numeral Lead** (Geist Mono 600, 1.5rem rising to 1.75rem): point totals for ranks 1 to 3 on the overall board, and admin roster totals (1.5rem).
- **Unit** (400, 0.75rem, Graphite): the "pts" suffix that follows every total, baseline-aligned.

### Named Rules
**The Mono Numerals Rule.** Every rank, class number, point total, input value, and time is Geist Mono, weight 600, tabular. Words are never set in the mono.

**The Short Ramp Rule.** Hierarchy comes from size steps within one family, weight 600 versus 400, and Ink versus Graphite. No uppercase labels, no letterspaced overlines.

## Layout

The public board is a centered container capped at 1400px with 16px gutters (24px from md). Below lg it is a single column: header, a sticky horizontal jump nav of chips (Overall plus the six sections, snap-scrolling, scrollbar hidden), the overall top 20 panel, then section panels (two columns from sm). From lg (1024px) the header collapses to one row (H1 and term left; meta line and "Points last updated" right, bottom-aligned) and the body becomes a 12-column grid: overall board in 5 columns, section boards in 7, split into a Grade 9 column and a Grade 10 column. Panel stacks use 24px gaps (20px inside the section columns at lg; 32px between the two halves).

The admin is a narrower phone-first column capped at 768px with a sticky header holding the section name, ghost links, and a horizontally scrolling chip row of sections. Roster groups ("Boys", "Girls") are bordered lists; bottom padding (112px) keeps the last row clear of toasts.

Rhythm: rows are 48px (52px at lg) on section boards and 56px (60px at lg) on the overall board; admin rows are at least 68px. Panel headers use 16px horizontal and 12 to 16px vertical padding. A footer rule closes the page with the tie and visibility notes.

### Named Rules
**The Touch Floor Rule.** Every interactive control is at least 44px tall; admin point controls are 48px. Anchored panels carry an 80px scroll margin so the sticky nav never covers their headings.

## Elevation & Depth

Flat by default. Depth comes from the tonal step between the Chalk Zinc page and the Paper Surface panels, plus 1px hairline borders. Shadows appear only on elements that float above the page (the bottom sheet and toasts), and they are tinted by a shared `--shadow-color` (an HSL triplet that is near-black zinc in light and near-black blue in dark), never pure black.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 -12px 40px -12px hsl(var(--shadow-color) / 0.35)`): the edit sheet rising from the bottom edge.
- **Toast lift** (`box-shadow: 0 10px 30px -10px hsl(var(--shadow-color) / 0.35)`): floating toasts.
- **Scrim** (`background: hsl(var(--shadow-color) / 0.45)`): the backdrop behind the sheet. No backdrop blur.

### Named Rules
**The Overlay-Only Shadow Rule.** Panels, rows, chips, and buttons have no shadow at rest or on hover. If it sits in the page flow, it is bordered, not lifted.

## Shapes

Two radii, applied by role: 8px on everything you tap or scan as a token (buttons, chips, rank chips, inputs, icon buttons) and 12px on everything that contains (board panels, roster lists, the empty state, toasts, the sheet's top corners). Borders are always 1px. Rows inside a panel are full-bleed and separated by 1px dividers, never individually rounded. Loading skeletons use a slightly tighter 6px radius for their text-line bars and 8px for chip placeholders, inside 12px panel outlines that match the real boards. The favicon is the rank-1 chip at icon scale.

## Components

### Buttons
Calm, outlined, and tactile; they press in rather than lift.
- **Shape:** gently rounded (8px).
- **Primary:** Classroom Cobalt fill, light text, weight 600, 48px tall in forms (44px on the error page), 20px horizontal padding.
- **Secondary:** Paper Surface with a 1px Hairline border, Ink text, weight 500, 44px tall; border shifts to Hairline Strong on hover. Form secondaries ("Save total", "-1") use a Hairline Strong outline on a transparent fill.
- **Ghost:** transparent, Graphite text; hover fills Sunken Zinc and darkens text to Ink. Used for header links and icon buttons (close, edit, dismiss).
- **Press:** every button scales to 0.98 on active (0.95 for the compact admin point buttons). Disabled drops to 35 to 60% opacity or Graphite text.
- **Focus:** the global 2px cobalt outline at 2px offset.

### Chips
- **Jump / section chips:** Paper Surface, 1px Hairline border, 44px tall, label weight 500 to 600, hover to Hairline Strong. In the admin, the current section chip fills Classroom Cobalt with light text and is scrolled into view.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Paper Surface on the Chalk Zinc page.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline, with a Hairline rule under the panel header.
- **Internal Padding:** 16px (20px at lg on the overall board); rows carry their own 16px side padding.

### Inputs / Fields
- **Style:** 48px tall, 8px radius, 1px Hairline Strong border, Chalk Zinc fill inside the sheet (Paper Surface on the login page), values in Geist Mono 1.125rem; placeholders revert to Geist at 1rem in Faint Graphite.
- **Focus:** the border turns Classroom Cobalt; the outline sits at zero offset.
- **Error:** border turns Signal Red and a Signal Red message follows below, announced as an alert. Helper text in Graphite otherwise.

### Navigation
- Public: a sticky bar below lg on the page ground with a bottom Hairline, holding the snap-scrolling jump chips. No site-mark bar.
- Admin: a sticky header (section name as title, ghost "Leaderboard" and "Log out" links) above the section chip row.

### Rank Chip (signature)
The board's one recurring mark. A Geist Mono 600 tabular rank inside an 8px-radius chip, 28 to 36px tall, at least 40 to 48px wide. Ranks 1 to 3 take their medal wash and text plus an inset 20% ring; every other rank sits in Sunken Zinc with Graphite text. A tie prefixes a small "T" at 0.75em inside the chip, and the screen reader hears "tied for rank N".

### Board Row (signature)
A three-column row: rank chip, label ("9-Kepler · " in Graphite, class number in Mono 600 Ink), and the right-aligned total with its "pts" unit. On the overall board, the section name of medal rows turns Ink and their totals step up to Numeral Lead. Rows enter once in rank order (520ms rise of 6px with fade, `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 28ms per row after 80ms, capped at the ninth row so the board settles in under 900ms) while totals count up from zero over 600ms on the same curve. If totals change while the page is open (a client refresh), they animate from their old value over 600ms. Reduced motion renders final values with no movement.

### Sheet and Toast (adapted Lightswind)
- **Sheet:** bottom sheet on Paper Surface with 12px top corners and a Hairline top border, spring entrance (damping 32, stiffness 380), floating 16px above the bottom with full 12px radius from sm. Traps focus, closes on Escape or scrim, and fades only under reduced motion.
- **Toast:** up to three stacked at the bottom center, max 384px, 12px radius, Paper Surface, Hairline border (Signal Red at 40% for errors), a filled 20px status icon, and a 44px dismiss target on errors only. Taps pass through the toast body.

## Do's and Don'ts

### Do:
- **Do** set every rank, class number, point total, and time in Geist Mono 600 with tabular figures.
- **Do** show ties explicitly with the "T" prefix in the rank chip, and list every tie at a cutoff.
- **Do** keep medal tints on rank chips 1 to 3 only, each with its soft wash and inset 20% ring.
- **Do** use Classroom Cobalt for the action or current focus only: primary buttons, the active chip, links, focus outlines, and the points-flash.
- **Do** separate panels with 1px Hairline borders on Paper Surface over Chalk Zinc, and divide rows with 1px rules.
- **Do** keep every control at least 44px tall (48px for admin point controls).
- **Do** ship a dark value for every new color token and consume tokens, never literals, in components.
- **Do** gate every movement behind `prefers-reduced-motion: no-preference` and render final values otherwise.

### Don't:
- **Don't** add podium graphics, confetti, or hero-metric blocks; the ranked rows are the whole story.
- **Don't** use school logos or school colors; the school and term appear in text only.
- **Don't** put shadows on in-flow panels, rows, chips, or buttons; shadows belong to the sheet and toasts.
- **Don't** add backdrop blur to overlays or toasts.
- **Don't** introduce new radii; controls are 8px, containers 12px, and 6px is reserved for skeleton text bars.
- **Don't** set words in Geist Mono or numerals in proportional Geist.
