# BrainScroll Study

A full-stack research web application for studying how three different
10-minute activities (short-form video scrolling, reading, quiet rest)
affect immediate problem-solving performance in high school students.

Two interfaces:

- **Participant site** (`frontend/`, React + Vite) — consent → participant
  info → randomly assigned 10-minute activity → 40s recovery → 10-question
  timed assessment → results with anonymous group/overall comparison.
- **Researcher dashboard** (same frontend, behind login) — participant data
  table, group analytics, bar/scatter charts, CSV/Excel export.

Backend: Node.js + Express + SQLite (`backend/`), with a schema written in
plain SQL so it ports directly to PostgreSQL/Supabase for production (see
below).

---

## Project structure

```
brainscroll-study/
├── backend/
│   ├── server.js            # Express app entry point
│   ├── db.js                # SQLite schema + connection
│   ├── quizBank.js          # 10 quiz questions + answer key (server-only)
│   ├── utils/crypto.js      # AES-256-GCM field encryption helpers
│   ├── middleware/auth.js   # JWT auth guard for researcher routes
│   ├── routes/
│   │   ├── participants.js  # participant creation, group assignment, session lifecycle
│   │   ├── quiz.js          # question delivery + server-side scoring
│   │   ├── auth.js          # researcher login
│   │   └── admin.js         # data table, analytics, CSV/Excel export
│   ├── scripts/createResearcher.js  # CLI to create/reset a researcher login
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/            # Landing, ParticipantInfo, Activity/*, Recovery, Quiz, Results, Admin*
    │   ├── components/       # CountdownTimer
    │   ├── styles/global.css # design system
    │   ├── api.js            # fetch wrapper for the backend API
    │   └── StudyContext.jsx  # in-memory participant/session state
    └── .env.example
```

---

## Running locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set real secrets:

```bash
# generate these two values
openssl rand -hex 32   # → DATA_ENCRYPTION_KEY
openssl rand -hex 24   # → JWT_SECRET
```

Create your researcher login (do this once):

```bash
node scripts/createResearcher.js <username> <a-strong-password>
```

Start the API:

```bash
npm run dev      # or: npm start
```

The API runs on `http://localhost:4000` and creates `backend/data/brainscroll.db`
automatically on first run.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL should point at your backend
npm run dev
```

Open `http://localhost:5173`. Researcher dashboard is at
`http://localhost:5173/#/admin/login`.

---

## Data collected & privacy design

- No names, emails, or free-text identifiers are ever collected or stored.
- Each participant gets a random ID like `BSS-A2E04B0F`, generated
  server-side and unrelated to any personal information.
- Age, grade, and (optional) social media usage are encrypted at rest with
  AES-256-GCM before being written to the database, and decrypted only when
  a logged-in researcher requests the data table or an export.
- Quiz answers are graded entirely server-side against a private answer key
  (`quizBank.js`) that is never sent to the browser — the client only ever
  receives question text and multiple-choice options.
- Group assignment uses stratified randomization (new participants are
  assigned to whichever group currently has the fewest participants, with
  ties broken randomly) to keep the three groups balanced without
  sacrificing randomization.
- Researcher routes require a valid JWT obtained via `/api/auth/login`;
  passwords are hashed with bcrypt and login attempts are rate-limited.

This is designed to be presented to a school IRB/ethics reviewer alongside
the consent language shown on the landing page.

---

## Moving to PostgreSQL / Supabase for production

`backend/db.js` uses SQLite for zero-setup local development. The schema is
plain ANSI SQL and maps almost directly to Postgres:

1. Replace `better-sqlite3` with `pg` (or use Supabase's client library).
2. The `CREATE TABLE` statements in `db.js` work in Postgres with two small
   changes: `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY` /
   `GENERATED ALWAYS AS IDENTITY`, and `TEXT` timestamp columns can become
   `TIMESTAMPTZ` if preferred.
3. Swap `db.prepare(...).run(...)/.get(...)/.all(...)` calls for parameterized
   `pool.query(...)` calls (the SQL text itself barely changes).
4. If using Supabase specifically, you can also move the AES field
   encryption into Postgres itself via the `pgcrypto` extension, or keep it
   in the Node layer as-is.
5. Store `DATA_ENCRYPTION_KEY` and `JWT_SECRET` in your hosting platform's
   secret manager rather than a committed `.env` file.

---

## Deployment outline

- **Backend**: deploy to any Node host (Render, Railway, Fly.io, an EC2/VM,
  etc). Set the environment variables from `.env.example` in the platform's
  dashboard. If you migrate to Postgres/Supabase, add the database
  connection string as an env var too.
- **Frontend**: `npm run build` produces a static `dist/` folder — deploy it
  to any static host (Vercel, Netlify, Cloudflare Pages, or the same VM
  behind nginx). Set `VITE_API_URL` at build time to your deployed backend's
  URL.
- Put the backend behind HTTPS (most hosts do this automatically) since
  researcher logins and encrypted fields are transmitted over the wire.

---

## Customizing the study

- **Quiz questions**: edit `backend/quizBank.js`. Keep the four `part`
  categories (`simple_math`, `simple_word`, `complex_math`, `complex_word`)
  if you want the dashboard's part-based analytics to stay meaningful.
- **Activity durations**: `ACTIVITY_SECONDS` in
  `frontend/src/pages/Activity/Activity.jsx` (currently 600s / 10 minutes)
  and the `durationSeconds={40}` prop in `frontend/src/pages/Recovery.jsx`.
- **Reading article**: `frontend/src/pages/Activity/ReadingActivity.jsx` —
  the included article is original text written for this study, safe to use
  as-is or replace.
- **Scrolling feed content**: `frontend/src/pages/Activity/SocialMediaActivity.jsx`
  — all captions/usernames are invented placeholders, not real posts.

---

## Notes / limitations of this build

- SQLite is fine for a single-class or single-school study; for a
  multi-site study with concurrent write load, migrate to Postgres first
  (see above).
- The frontend keeps session state (participant ID, assigned group, quiz
  result) in memory via React context, so refreshing the browser mid-study
  will lose progress. For a deployed study you may want to persist this to
  `sessionStorage` as well.
- This is a functioning reference implementation, not a substitute for your
  school/district's IRB or data-privacy review — please have the consent
  language and data-handling approach reviewed before running the study
  with real students.
