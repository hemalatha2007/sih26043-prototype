import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET /api/dashboard/stats
 * Dynamic dashboard statistics calculated directly from PostgreSQL
 */
router.get("/stats", async (_req, res) => {
  try {
    const [
      totalProblems,
      submittedProblems,
      analyzedProblems,
      matchedProblems,
      routedProblems,
      completedProblems,
      totalUniversities,
      totalStudents,
      totalFaculty,
      totalUsers,
    ] = await Promise.all([
      prisma.problem.count(),
      prisma.problem.count({ where: { status: "SUBMITTED" } }),
      prisma.problem.count({ where: { status: "ANALYZED" } }),
      prisma.problem.count({ where: { status: "MATCHED" } }),
      prisma.problem.count({ where: { status: { in: ["ROUTED", "IN_PROGRESS"] } } }),
      prisma.problem.count({ where: { status: "DONE" } }),
      prisma.university.count(),
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.user.count(),
    ]);

    res.json({
      totalProblems,
      submittedProblems,
      analyzedProblems,
      matchedProblems,
      routedProblems,
      completedProblems,
      totalUniversities,
      totalStudents,
      totalFaculty,
      totalUsers,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to load dashboard statistics" });
  }
});

export default router;
