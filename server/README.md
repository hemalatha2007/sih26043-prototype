# SIH26043 — Backend (Postgres + Prisma)

Express API for the Intelligent Problem Routing platform. Mirrors the same
pipeline as the frontend prototype: **Submit → Analyze → Match → Route → Collaborate**,
now backed by real data instead of in-memory mocks.

## Setup

```bash
npm install
cp .env.example .env        # point DATABASE_URL at your Postgres instance
npx prisma migrate dev --name init
npm run seed                # loads the 4 mock universities + faculty + students
npm run dev                 # http://localhost:4000
```

## Data model (`prisma/schema.prisma`)

- **University** → has many **Faculty**, **Student**, receives **Match** rows and routed **Problem**s
- **Faculty** / **Student** → `skills String[]` (Postgres native array — no join table needed)
- **Problem** → the submission; `extractedTags String[]`, a `status` enum tracking pipeline stage, optional `routedTo` university
- **Match** → one row per (problem, university) with a `score` and a `breakdown` JSON blob (per-faculty/student scores) — unique on `(problemId, universityId)` so re-matching upserts instead of duplicating
- **Task** → kanban card scoped to a problem, `column` enum (`TODO` / `DOING` / `DONE`)

## API

| Step | Method & path | Body | What it does |
|---|---|---|---|
| Submit | `POST /api/problems` | `{ org, domain, description }` | Creates a problem, `status: SUBMITTED` |
| Analyze | `POST /api/problems/:id/analyze` | — | Runs keyword-based skill extraction, `status: ANALYZED` |
| Match | `POST /api/problems/:id/match` | — | Scores every university's faculty/students against the extracted tags, upserts `Match` rows, `status: MATCHED` |
| Route | `POST /api/problems/:id/route` | `{ universityId }` | Sets `routedTo`, `status: ROUTED`, seeds two starter tasks |
| Collaborate | `POST /api/problems/:problemId/tasks` | `{ title }` | Adds a board card |
| Collaborate | `PATCH /api/tasks/:id` | `{ column }` | Moves a card between `TODO`/`DOING`/`DONE` |
| — | `GET /api/problems` | — | List all problems |
| — | `GET /api/problems/:id` | — | Full detail: routedTo, matches (with breakdown), tasks |
| — | `GET /api/universities` | — | The ecosystem the matcher routes into |

## Swapping in a real classifier later

`src/lib/matching.ts` exports `extractTags(text)` as the single seam between the
API and the classifier. It's currently a regex/keyword table — replace its body
with an LLM or embedding-similarity call and every route keeps working unchanged,
since they only depend on the `string[]` it returns.

## Wiring up the frontend prototype

Replace the local `computeMatches`/`extractTags` calls in the React prototype with:

```ts
await fetch(`${API_URL}/api/problems`, { method: "POST", body: JSON.stringify(form), headers: {...} })
await fetch(`${API_URL}/api/problems/${id}/analyze`, { method: "POST" })
await fetch(`${API_URL}/api/problems/${id}/match`, { method: "POST" })
await fetch(`${API_URL}/api/problems/${id}/route`, { method: "POST", body: JSON.stringify({ universityId }) })
```
