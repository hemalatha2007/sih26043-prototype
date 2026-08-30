# SIH26043 — Intelligent Problem Routing Platform

Full-stack prototype: **React (Vite)** client + **Node/Express** API + **PostgreSQL via Prisma**.
Walks through the whole pipeline live against a real database: **Submit → AI Analysis → Matching → Routing → Collaborate**.

```
sih26043/
├─ client/     React (Vite) frontend
├─ server/     Express API + Prisma schema
└─ docker-compose.yml   one-command local Postgres
```

## Fastest path to running (5 commands)

Requires Node 18+ and Docker (for step 1 — skip it and edit `server/.env` yourself if you already have Postgres running).

```bash
docker compose up -d                          # 1. start Postgres
npm run install:all                           # 2. install both apps (root needs `npm install` once too, for concurrently)
cp server/.env.example server/.env            # 3. server env (matches the docker-compose credentials already)
cp client/.env.example client/.env            # 4. client env (points at http://localhost:4000)
cd server && npx prisma migrate dev --name init && npm run seed && cd ..
npm run dev                                   # 5. runs API on :4000 and client on :5173
```

Then open **http://localhost:5173**.

> If `npm run install:all` fails because `concurrently` isn't installed yet, run `npm install` in the project root first — it's the only root dependency.

## No Docker?

Point `DATABASE_URL` in `server/.env` at any Postgres instance you already have (local install, Supabase, Railway, Neon, etc.), then skip the `docker compose up -d` step and run the `prisma migrate dev` / `seed` steps as above.

## What's already wired up

- The client talks to the API over plain `fetch` — see `client/src/App.jsx`. No mock data left; every step (analyze / match / route / kanban board) is a real request against Postgres.
- `server/prisma/seed.ts` loads 4 universities with faculty + student skill profiles so matching has something real to score against out of the box.
- `server/src/lib/matching.ts` does the skill extraction and scoring — currently keyword/regex based. If you have time later, swap `extractTags()` for an LLM/embedding call; every route downstream is unaffected since they only depend on the `string[]` it returns.

## Troubleshooting under time pressure

- **"Can't reach the API"** banner in the UI → server isn't running or `client/.env`'s `VITE_API_URL` doesn't match the port `server` is on (default `4000`).
- **Prisma migrate hangs/fails** → check `server/.env`'s `DATABASE_URL` matches your actual Postgres credentials/port.
- **CORS errors** → shouldn't happen (`cors()` is wide open in `server/src/server.ts`), but if you change ports, restart the server after editing `.env`.
- **Port 5432 already in use** → you likely have another Postgres running; either stop it or change the port mapping in `docker-compose.yml` and `DATABASE_URL` together.

See `server/README.md` for the full API reference (all routes, request/response shapes).
