# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, Neon Postgres via the Vercel Marketplace, Drizzle ORM, Lightswind for animated components. Deployed on Vercel from a public GitHub repo. Chosen by the teacher in the project brief.

## Users

- **Students** of six sections (Grade 9: Kepler, Linnaeus, Mendeleev; Grade 10: Curie, Darwin, Einstein) at Quezon City Science High School. They open the public leaderboard on their phones, mostly from a link shared in class group chats, to see whether they made the top lists.
- **The class**, together, when the teacher projects the leaderboard on a TV or projector during class. It must be readable from the back of a room.
- **The teacher** (single admin). Records recitation points on a phone during class, fast, between student answers.

## Product Purpose

A public recitation points leaderboard for the 2nd Term, SY 2026-2027. It shows the overall top 20 across all six sections and the top 5 of each section. It rewards participation by making the top visible, without exposing anyone who is not in a top list. Success: students check it, the teacher can award a point in one tap during class, and nobody outside the top lists can be identified or ranked from the site.

## Positioning

It is only a leaderboard. Students are identified by section and class number only (B = boy, G = girl, e.g. "9-Kepler · B4"), never by name. The ranks below the cutoffs are private by design: they never leave the server.

## Operating Context

- Students: mobile browsers, often opened from Messenger / group chat links (link preview card matters).
- Classroom: projected on a TV/projector, viewed from a distance.
- Teacher: phone in one hand during recitation, needs big tap targets, a section switcher, and a roster sorted by class number (B's then G's).

## Capabilities and Constraints

- Public: overall top 20, per-section top 5. Competition ranking for ties (1, 1, 3). Ties at the cutoff are all shown. Students with 0 points are not shown.
- Privacy: students outside the top 20 overall and the top 5 of their section are never sent to the browser. Ranking and cutoff happen on the server.
- Admin: password login (single admin), +1 / -1 / custom add / set total. Points are non-negative integers. No history, no audit log.
- Out of scope: student names, student login, individual lookup, point history, export.
- Roster: 216 students across six sections (see seed). A student's key is (section, class number).

## Brand Commitments

- No official school branding: no QCSHS logo or school colors. The school and term are named in text only ("Recitation Points · 2nd Term, SY 2026-2027").
- Voice: neutral and formal. Plain, informational English. No slang, no emoji, no hype copy.

## Evidence on Hand

- The roster sizes per section (in the README / seed). No real point data yet: every student starts at 0, so the empty state is the launch state.
- No images, logos, or photography are provided. Do not fabricate student data, names, or claims.

## Product Principles

1. Privacy over spectacle: never reveal anything below the top lists, even indirectly.
2. Readable at a glance, from a phone or from the back of a classroom.
3. One tap to award a point. Admin speed beats admin features.
4. Fair and explicit ranking: ties share ranks, cutoff ties are all shown.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion`.
- WCAG AA contrast, including when projected (projectors wash out low-contrast colors).
- Large tap targets on the admin view (one-handed phone use).
