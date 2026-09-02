# SoLink AI (SIH26043) — Project Context & Master Task List

---

## 1. Executive Context & Core Value Proposition

**SoLink AI (SIH26043)** is an **AI-powered Open Innovation Marketplace** connecting **Government Bodies & Industry Partners** (problem publishers with R&D budgets) with **University Students & Researchers** (problem solvers).

### System Value Exchange
- **Government / Industry**: crowdsources challenges, saves up to 70% vs traditional consultancy, accesses vetted prototype solutions.
- **Students / Researchers**: earns milestone monetary grants, retains commercialization IP rights, accesses startup cell incubation pathways.
- **Platform (SoLink AI)**: operates a transparent B2G/B2B SaaS subscription model charging publishers rather than extracting cuts from student grants.

---

## 2. Technical Stack & Current Process Architecture

```
sih26043-prototype/
├── client/                 # Frontend: React (Vite), Tailwind CSS / Vanilla CSS, Lucide icons
│   ├── src/
│   │   ├── App.jsx         # Live interactive single-page app (Submit → Analyze → Match → Route → Kanban)
│   │   ├── context/        # AuthContext (JWT session state, login, register, logout)
│   │   ├── components/     # ProtectedRoute (RBAC route guard)
│   │   └── services/       # authService (JWT token management & auth API calls)
│   └── vite.config.js      # Vite build configuration
├── server/                 # Backend: Node.js, Express, TypeScript, Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma   # PostgreSQL models (User, University, Faculty, Student, Problem, Match, Task)
│   │   └── seed.ts         # Ecosystem seed data (4 universities + demo accounts for all roles)
│   └── src/
│       ├── server.ts       # Express app initialization & route registration
│       ├── utils/          # JWT helper utilities (signToken, verifyToken)
│       ├── middleware/     # Auth & Role-Based Access Control middleware
│       ├── lib/matching.ts # AI Tag extraction & university matching engine
│       └── routes/         # API routes: /api/auth, /api/problems, /api/tasks, /api/universities
├── docker-compose.yml      # Local PostgreSQL database container (Port 5432)
└── CONTEXT.md              # Project Context & Active Task List (This File)
```

### Active Pipeline Execution Flow
1. **Submit (`POST /api/problems`)**: Publish problem statement with org, domain, description. Status $\rightarrow$ `SUBMITTED`.
2. **Analyze (`POST /api/problems/:id/analyze`)**: AI tag extraction identifies key domain skills. Status $\rightarrow$ `ANALYZED`.
3. **Match (`POST /api/problems/:id/match`)**: Scoring engine matches university faculty & student skill profiles. Status $\rightarrow$ `MATCHED`.
4. **Route (`POST /api/problems/:id/route`)**: Selects target university & seeds starter collaboration Kanban tasks. Status $\rightarrow$ `ROUTED`.
5. **Collaborate (`POST /api/problems/:problemId/tasks`, `PATCH /api/tasks/:id`)**: Real-time Kanban board updates (`TODO` $\rightarrow$ `DOING` $\rightarrow$ `DONE`).

---

## 3. Active Data Schema Snapshot (`server/prisma/schema.prisma`)

- `UserRole`: `PUBLISHER` | `STUDENT` | `FACULTY` | `ADMIN`.
- `User`: ID, name, email (unique), passwordHash, role, createdAt, updatedAt.
- `University`: ID, name, location, faculty list, student list, matches, routed problems.
- `Faculty`: ID, name, role, skills (`String[]`), universityId, userId (optional link to User).
- `Student`: ID, name, skills (`String[]`), universityId, userId (optional link to User).
- `Problem`: ID, org, domain, description, status (`SUBMITTED` | `ANALYZED` | `MATCHED` | `ROUTED` | `IN_PROGRESS` | `DONE`), extractedTags (`String[]`), routedToId.
- `Match`: ID, problemId, universityId, score, breakdown (JSON faculty/student detail).
- `Task`: ID, problemId, title, column (`TODO` | `DOING` | `DONE`).

---

## 4. Master Task List & Roadmap

### Phase 1: Core Foundation, Authentication & Prototype Integration (Completed)
- [x] **Backend Infrastructure Setup**: Express API server with TypeScript and Prisma ORM configuration.
- [x] **User Schema & Authentication**: Implemented `User` model, `UserRole` enum (`PUBLISHER`, `STUDENT`, `FACULTY`, `ADMIN`), and password hashing with `bcryptjs`.
- [x] **JWT Authentication System**: Created `JWT_SECRET` verification utils, `authenticateToken` middleware, and `/api/auth/register`, `/api/auth/login`, `/api/auth/me` endpoints.
- [x] **Public Registration Governance**: Safe registration enforcing `PUBLISHER`, `STUDENT`, `FACULTY` roles and blocking public `ADMIN` account creation.
- [x] **Frontend Auth Integration**: Stateful `AuthContext`, `authService`, `ProtectedRoute`, tabbed Sign In / Register forms, and quick demo login buttons.
- [x] **Ecosystem Seed Data**: `server/prisma/seed.ts` populating demo accounts (`publisher@solink.ai`, `student@solink.ai`, `faculty@solink.ai`, `admin@solink.ai`) and 4 universities with faculty & student skill vectors.
- [x] **AI Matching Engine (`server/src/lib/matching.ts`)**: Keyword/regex tag extraction and university scoring algorithms.
- [x] **API Route Implementation**: Express endpoints for `/api/auth`, `/api/problems`, `/api/problems/:id/analyze`, `/api/problems/:id/match`, `/api/problems/:id/route`, and `/api/tasks`.
- [x] **Frontend Live Data Integration (`client/src/App.jsx`)**: Connected React client to real Postgres backend API.
- [x] **Kanban Board Module**: Interactive `TODO` / `DOING` / `DONE` card movement synced with backend database.
- [x] **Project Hygiene**: Updated `.gitignore` to prevent committing node_modules, build outputs, and `.env` secrets.

---

### Phase 2: Milestone Fund Escrow & Open Innovation Upgrades (In Progress)
- [ ] **Milestone Grant Schema Update**:
  - Add `budget` field to `Problem` model.
  - Create `MilestoneGrant` schema (`title`, `amount`, `status`: `LOCKED` | `ESCROWED` | `RELEASED`).
- [ ] **Budget-Backed Problem Onboarding UI**:
  - Update challenge submission form in `App.jsx` to capture allocated R&D budget and target themes (Disaster Mgmt, Healthcare, Agriculture, Smart Cities).
- [ ] **LLM/NLP Tag Extraction Upgrade**:
  - Replace regex tag extractor in `server/src/lib/matching.ts` with OpenAI/Gemini API embedding or LLM tag classification.
- [ ] **Milestone Grant Release Triggers**:
  - Connect Kanban task status progression (`DONE` state completion) to milestone grant escrow fund releases.

---

### Phase 3: Platform Governance & Ecosystem Analytics (Planned / Backlog)
- [ ] **Mentor Evaluation Hub**:
  - Rubric-based scoring interface (Feasibility, Innovation, Impact, Scalability) for industry experts.
- [ ] **Cross-University Team Formation Engine**:
  - Student profile builder and multi-disciplinary team routing.
- [ ] **B2G / B2B SaaS Subscription Billing**:
  - Automated service fee calculator and publisher invoice generator.
- [ ] **Open Innovation KPI Analytics Dashboard**:
  - Metrics tracking total consultancy savings, active grants distributed, IP filings, and startup cell conversion rates.

---

## 5. Quick Start Instructions

```bash
# 1. Start local Postgres container
docker compose up -d

# 2. Install all dependencies (root, server, client)
npm run install:all

# 3. Environment configuration
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Database migration & seeding
cd server && npx prisma migrate dev --name add_auth && npm run seed && cd ..

# 5. Start dev server (API :4000, Web UI :5173)
npm run dev
```
