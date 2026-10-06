---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/admin/page.tsx"]
---

# Surface: public leaderboard (/)

Scope: the single public page. Visitor mode: Read (understand the standings at a glance). Audience: students on phones from a group-chat link; the class when projected. Task: see the overall top 20 and each section's top 5. Constraints: privacy cutoff enforced server-side, neutral/formal voice, no school branding, respect reduced motion, link preview card matters.

Chosen direction: the category standard (user-chosen canon), executed at full craft. Quality bar: Linear/Vercel (type, restraint, both themes), Kaggle/LeetCode contest boards (dense ranked rows, explicit ties), Strava leaderboards (mobile scannability).

## Direction contract

THESIS: A competition leaderboard that reads in one glance on a phone and from the back of a classroom. Ranked rows, explicit ties, nothing decorative. It refuses podium graphics, confetti, and hero-metric templates.

OWN-WORLD: Off-white zinc ground in light (default for projected, lit rooms), near-black zinc in dark (system preference). Geist for all text, Geist Mono tabular numerals for ranks and points. One cobalt accent for the current focus and links. Medal tints (gold, silver, bronze) only on rank chips 1-3, as data. 1px hairline borders, 12px panels, 8px chips and controls.

STORY: The visitor reads the term line, scans the overall top 20, then checks their section's top 5. They understand that only the top lists are public and that ties share a rank.

FIRST VIEWPORT: Mobile: H1 "Recitation Points" with the term line beneath, a one-line description, then "Points last updated" with the date and time points last changed; below it a sticky jump nav (Overall plus the six sections), then the overall top 20 panel with its first rows above the fold. The site-mark bar was dropped after critique: it duplicated the product name and the podium mark contradicted THESIS. Desktop and projector: one compact header row (H1 and term left; meta line and "Points last updated" right), then two columns: overall top 20 on the left, section boards on the right grouped as Grade 9 and Grade 10 columns. No CTA: the boards are the action. No auto-refresh and no Refresh button (user decisions); the header shows when points last changed (latest seed or admin edit).

FORM: canon (category standard), user-chosen over the rolled Route Sign. Seed key 0f04dc0f.

Signature interaction: on first view the rows enter in rank order and points count up from zero once (Lightswind count-up), settling in under 900ms; if points change while the page is open, they animate from their old value and flash once; reduced motion renders final values with no movement.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- None.
