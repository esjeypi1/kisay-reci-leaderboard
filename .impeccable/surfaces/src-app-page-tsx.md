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

FIRST VIEWPORT: Mobile: slim top bar (site mark left, nothing else), H1 "Recitation Points", term line beneath, then the overall top 20 panel starting above the fold with its first rows visible. Desktop and projector: two columns, overall top 20 on the left (sticky), six section boards in a 2x3 grid on the right. No CTA: the boards are the action.

FORM: canon (category standard), user-chosen over the rolled Route Sign. Seed key 0f04dc0f.

Signature interaction: on first view the rows enter in rank order and points count up from zero once (Lightswind count-up), settling in under 900ms; reduced motion renders final values with no movement.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- None.
