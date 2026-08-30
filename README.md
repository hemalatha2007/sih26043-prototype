# SIH26043 — Intelligent Problem Routing & Collaborative Innovation Platform

> **"We don't wait for the right people to find the problem. We make the problem reach them."**

An AI-powered platform that connects real-world problems — submitted by citizens, government
bodies, or industry — directly to the university, faculty, and students best equipped to solve
them. Instead of broadcasting a challenge to everyone and hoping the right people notice, the
platform analyzes each problem and **routes** it to a targeted match.

Built for **Smart India Hackathon — Problem Statement SIH26043**.

---

## The problem

Students have skills. Faculty have expertise. Universities have resources. Industry and
government have real problems. But these groups are disconnected — a company with a problem
doesn't know which university can solve it, and a university with the right skills may never
hear about the problem in the first place.

Existing platforms (HeroX, OpenIDEO, InnoCentive) solve this with **broadcasting**: post a
challenge, let a crowd of solvers discover it. This platform instead does **intelligent
routing**: analyze the problem, then proactively deliver it to the specific people equipped to
solve it.

## How it works

```
Citizen / Government / Industry
            ↓
     Submit a Problem
            ↓
      🤖 AI Analysis  (extract domain + required skills)
            ↓
   🎯 Intelligent Matching  (score universities, faculty, students)
            ↓
      🔔 Targeted Routing  (notify the best match — not everyone)
            ↓
     Team Collaboration  (kanban workspace)
            ↓
        Solution
```

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |

## Project structure

```
sih26043-fullstack/
├─ client/            React (Vite) frontend
│  └─ src/App.jsx     Submit → Analyze → Match → Route → Collaborate UI
├─ server/            Express API
│  ├─ prisma/         schema.prisma + seed script
│  └─ src/
│     ├─ routes/      problems, universities, tasks
│     └─ lib/         matching.ts — skill extraction & scoring engine
└─ docker-compose.yml Optional local Postgres
```

## Getting started

Requires Node.js 18+ and a PostgreSQL database (local, Docker, or a hosted service like Neon/Supabase).

```bash
# 1. Install dependencies
npm install
npm install --prefix server
npm install --prefix client

# 2. Configure environment
cp server/.env.example server/.env   # set DATABASE_URL to your Postgres instance
cp client/.env.example client/.env   # points at http://localhost:4000 by default

# 3. Set up the database
cd server
npx prisma migrate dev --name init
npm run seed                          # loads sample universities, faculty & students
cd ..

# 4. Run both apps together
npm run dev
```

Open **http://localhost:5173**.

## API overview

| Step | Method & path | Purpose |
|---|---|---|
| Submit | `POST /api/problems` | Create a new problem |
| Analyze | `POST /api/problems/:id/analyze` | Extract domain + required skills |
| Match | `POST /api/problems/:id/match` | Rank universities/faculty/students |
| Route | `POST /api/problems/:id/route` | Route the problem to a chosen university |
| Collaborate | `POST /api/problems/:id/tasks`, `PATCH /api/tasks/:id` | Kanban board for the matched team |

Full request/response shapes are documented in [`server/README.md`](server/README.md).

## Roadmap / what's next

- Replace the keyword-based skill extractor (`server/src/lib/matching.ts`) with an
  LLM- or embedding-based classifier for more accurate domain/skill detection
- Real-time notifications (email/SMS) when a problem is routed
- Duplicate-problem detection across submissions
- Authentication for universities, faculty, and industry partners

## License

Built for Smart India Hackathon 2026. No license specified yet.
