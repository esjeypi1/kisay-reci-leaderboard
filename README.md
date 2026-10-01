# Kisay Recitation Points Leaderboard

A public leaderboard of recitation points for six sections at Quezon City Science High School, 2nd Term, SY 2026-2027.

- **Public page (`/`)**: the overall top 20 across all sections and the top 5 of each section.
- **Admin (`/admin`)**: a password-protected, phone-first page where the teacher adds or corrects points during class.

Students are identified only by section and class number (B = boy, G = girl), for example `9-Kepler · B4`. There are no names, no student logins, no individual lookup, no point history, and no export.

## Privacy

- Ranking and the cutoffs run in one SQL query on the server ([`src/lib/leaderboard.ts`](src/lib/leaderboard.ts)). Only students inside the top 20 overall or the top 5 of their section are sent to the browser. Everyone else, including their points, never leaves the server.
- There are no public API routes. The full roster is only loaded on `/admin`, after the session check.
- Ties share a rank using competition ranking (1, 1, 3). If students are tied at a cutoff, all of them are shown. Students with 0 points are not shown.
- The site asks search engines not to index it (`robots: noindex`).

## Admin security

- One password, stored in the `ADMIN_PASSWORD` environment variable, compared in constant time.
- Logging in sets a signed (HS256), httpOnly, `SameSite=Strict` session cookie scoped to `/admin`. It lasts 12 hours. The signing key is `SESSION_SECRET`.
- Login is rate limited to 5 failed attempts per 15 minutes per client. Attempts are stored in Postgres keyed by a salted hash of the IP address, so raw IPs are never stored.
- Every server action that writes data checks the session on the server before doing anything. Hiding buttons is not what protects the data.
- Points are validated as non-negative whole integers on the server, and the database also rejects negative points with a check constraint.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Neon Postgres (via the Vercel Marketplace) · Drizzle ORM · [Lightswind](https://lightswind.com) components (count-up, grid background, sheet, toast; copied into `src/components/lightswind` and adapted) · Phosphor icons.

## Local setup

Requirements: Node.js 20+ and a Postgres database. The easiest option is a free Neon branch.

```bash
npm install
cp .env.example .env.local   # then fill in the three values
npm run db:migrate           # create the tables
npm run db:seed              # add the 6 sections and 216 students
npm run dev                  # http://localhost:3000
```

Generate a session secret with:

```bash
openssl rand -base64 48
```

### Environment variables

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Postgres connection string. On Vercel, use Neon's **pooled** connection string (the host contains `-pooler`). |
| `ADMIN_PASSWORD` | The admin password for `/admin`. Use a long, random passphrase (16+ characters). |
| `SESSION_SECRET` | Signs the admin session cookie. At least 32 characters. Changing it logs out every session. |

`.env*` files are gitignored, except `.env.example`, which only has placeholders. Never commit real values.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server. |
| `npm run build` / `npm start` | Production build and server. |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks. |
| `npm run db:generate` | Create a new migration after changing `src/db/schema.ts`. |
| `npm run db:migrate` | Apply migrations in `drizzle/` to the database in `DATABASE_URL`. |
| `npm run db:seed` | Add any missing sections and students. Safe to run again: it never duplicates students and never changes points. |
| `npm run db:seed:reset` | Same as the seed, then **sets every student's points to 0**. Use this to start a new term. |
| `npm run db:studio` | Open Drizzle Studio to browse the database. |

The roster lives in [`src/db/roster.ts`](src/db/roster.ts). To add students, raise a section's count there and run `npm run db:seed` again.

## Deploying on Vercel with Neon

1. **Import the repo.** In Vercel, choose **Add New → Project** and import this GitHub repository. The framework preset is detected as Next.js. Don't deploy yet if it asks; the database comes next.
2. **Add Neon.** In the project, open **Storage → Create Database → Neon (Serverless Postgres)** from the Marketplace, create the database, and connect it to the project for all environments. This adds `DATABASE_URL` (and a few other `PG*` variables) to the project automatically.
3. **Set the other variables.** In **Settings → Environment Variables**, add for Production (and Preview if you use it):
   - `ADMIN_PASSWORD`: your admin passphrase
   - `SESSION_SECRET`: the output of `openssl rand -base64 48`

   Mark both as **Sensitive**.
4. **Create the tables and roster in production.** From your computer, pull the production variables and run the migration and seed against them:

   ```bash
   npm i -g vercel           # once
   vercel link               # link this folder to the Vercel project
   vercel env pull .env.production.local --environment=production
   npx dotenv-cli -e .env.production.local -- npm run db:migrate
   npx dotenv-cli -e .env.production.local -- npm run db:seed
   rm .env.production.local  # don't keep production secrets on disk
   ```

   Or skip `vercel env pull` and pass the connection string for one command:
   `DATABASE_URL="<pooled connection string from Neon>" npm run db:migrate` (and the same for `db:seed`).

5. **Deploy.** Push to the main branch or click **Redeploy**. The build does not need the database, so it succeeds even before step 4. The pages only query the database when they're requested.
6. **Check it.** Open the site (it shows empty boards until points are added), then go to `/admin` and log in.

Changing an environment variable on Vercel only takes effect after the next deployment.

## Project structure

```
src/
  app/
    page.tsx              public leaderboard
    admin/
      page.tsx            admin roster (server: session check + data)
      admin-board.tsx     admin UI (client)
      actions.ts          server actions: login, logout, adjustPoints, setPoints
      login/              login page and form
  components/
    leaderboard/          board rows, overall board, section boards
    lightswind/           Lightswind components, adapted
  db/
    schema.ts             Drizzle schema
    roster.ts             sections and class sizes
    seed.ts               idempotent seed (--reset to zero points)
  lib/
    leaderboard.ts        server-only ranking and cutoffs
    admin-data.ts         full roster, admin only
    session.ts            password check and signed session cookie
    rate-limit.ts         login rate limiting
drizzle/                  SQL migrations
PRODUCT.md, DESIGN.md     product and design context
```
