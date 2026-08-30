import { Router } from "express";
import { prisma } from "../lib/prisma";
import { extractTags, computeMatches } from "../lib/matching";

const router = Router();

/** POST /api/problems — submit a new problem (step 1: Submit) */
router.post("/", async (req, res) => {
  const { org, domain, description } = req.body ?? {};
  if (!org || !domain || !description) {
    return res.status(400).json({ error: "org, domain and description are required" });
  }
  const problem = await prisma.problem.create({
    data: { org, domain, description, status: "SUBMITTED" },
  });
  res.status(201).json(problem);
});

/** GET /api/problems — list, most recent first */
router.get("/", async (_req, res) => {
  const problems = await prisma.problem.findMany({
    orderBy: { createdAt: "desc" },
    include: { routedTo: true },
  });
  res.json(problems);
});

/** GET /api/problems/:id — full detail incl. matches and tasks */
router.get("/:id", async (req, res) => {
  const problem = await prisma.problem.findUnique({
    where: { id: req.params.id },
    include: {
      routedTo: true,
      tasks: { orderBy: { createdAt: "asc" } },
      matches: { include: { university: true }, orderBy: { score: "desc" } },
    },
  });
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  res.json(problem);
});

/** POST /api/problems/:id/analyze — step 2: AI Analysis (skill/domain extraction) */
router.post("/:id/analyze", async (req, res) => {
  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const tags = extractTags(problem.description);
  const updated = await prisma.problem.update({
    where: { id: problem.id },
    data: { extractedTags: tags, status: "ANALYZED" },
  });
  res.json(updated);
});

/** POST /api/problems/:id/match — step 3: rank universities/faculty/students */
router.post("/:id/match", async (req, res) => {
  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  if (problem.extractedTags.length === 0) {
    return res.status(400).json({ error: "Run /analyze before /match — no skills extracted yet" });
  }

  const ranked = await computeMatches(prisma, problem.extractedTags);

  await prisma.$transaction(
    ranked.map((r) =>
      prisma.match.upsert({
        where: { problemId_universityId: { problemId: problem.id, universityId: r.universityId } },
        create: {
          problemId: problem.id,
          universityId: r.universityId,
          score: r.score,
          breakdown: { faculty: r.faculty, students: r.students },
        },
        update: {
          score: r.score,
          breakdown: { faculty: r.faculty, students: r.students },
        },
      })
    )
  );

  await prisma.problem.update({ where: { id: problem.id }, data: { status: "MATCHED" } });
  res.json(ranked);
});

/** POST /api/problems/:id/route — step 4: route to one university, seed a starter board */
router.post("/:id/route", async (req, res) => {
  const { universityId } = req.body ?? {};
  if (!universityId) return res.status(400).json({ error: "universityId is required" });

  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const updated = await prisma.problem.update({
    where: { id: problem.id },
    data: {
      routedToId: universityId,
      status: "ROUTED",
      tasks: {
        create: [
          { title: "Kickoff call with faculty mentor", column: "TODO" },
          { title: "Define data schema / requirements", column: "TODO" },
        ],
      },
    },
    include: { routedTo: true, tasks: true },
  });
  res.json(updated);
});

export default router;
