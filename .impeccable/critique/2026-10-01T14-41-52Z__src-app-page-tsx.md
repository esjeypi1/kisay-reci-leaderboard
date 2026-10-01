---
target: public leaderboard and admin
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/mac/Documents/KISAY/reci-dev/src/app/page.tsx"
target_fingerprint: "sha256:2908afd86f7117fbd2020356f1ae3c912a49deb5045d35f613e273c933174e6b"
target_path: /Users/mac/Documents/KISAY/reci-dev/src/app/page.tsx
timestamp: 2026-10-01T14-41-52Z
slug: src-app-page-tsx
closed: true
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score: 28/40 (Good, borderline)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | No freshness or live refresh on the public board; admin loses section context when scrolled |
| 2 | Match system / real world | 3 | "T6" legend only in footer; "Top 5" label over 6-7 tied rows |
| 3 | User control and freedom | 3 | Public section chips jump down with no way back |
| 4 | Consistency and standards | 3 | Three product names; "-" vs "+1"; public chips lack active state |
| 5 | Error prevention | 3 | Wrong-section risk while scrolled |
| 6 | Recognition rather than recall | 3 | Section must be remembered while scrolling admin |
| 7 | Flexibility and efficiency | 2 | No jump to class number; deep-linked chip off-screen |
| 8 | Aesthetic and minimalist design | 3 | 320px hero on projector, decorative grid, stretched cards |
| 9 | Error recovery | 3 | Session-expired toast has no login link |
| 10 | Help and documentation | 3 | Legend far from chips |

## Design specificity
Category standard executed cleanly; data rules (ties, cutoffs, privacy copy) are product-specific, character is not. Hero is the stock Vercel/shadcn hero; "live scoreboard" half of the brief absent; podium mark contradicts contract; radius drift (16px panels vs contract 12px, 6px chips vs 8px).
Detector: CLI 0 findings. In-browser overlay: codex-grid-background (grid-dot-backgrounds.tsx:29, real) and overused-font geist mono 69-75% (false positive: numerals are intentional data type). faint-foreground "pts" 4.48:1 on surface (just under AA). Public section chips 40px tall. No overflow, no console errors.

## Priority issues
1. [P1] Board isn't live: no auto-refresh, no updated time, no change cue.
2. [P1] Projector first screen: hero ~320px at 1366x768, section rows 15px.
3. [P1] Admin loses current section while scrolling; deep-linked chip off-screen.
4. [P2] Silver medal indistinguishable from unranked chip; full-weight "T" noise.
5. [P2] No OG image / default favicon / starter SVGs in public/.

## Persona red flags
Casey (student from Messenger): bare preview, chips flush-left, no way back after jump, legend at bottom.
Alex (teacher): no jump to G numbers, section context lost, "-" lacks "1", session-expired toast has no link.
Sam (screen reader / projector): 36 bare aria-live spans announcing "6"; public chips no aria-current; faint "pts" washes out.

## Minor
"Top 5" over tied rows; stretched cards; 7 empty-state messages at launch; duplicate product names; "pts" repeated; admin chip snap bug; login fine.
