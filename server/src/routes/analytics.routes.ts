import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET /api/analytics/problems-by-domain
 * Groups problem challenges by domain category
 */
router.get("/problems-by-domain", async (_req, res) => {
  try {
    const grouped = await prisma.problem.groupBy({
      by: ["domain"],
      _count: { id: true },
    });

    const result = grouped.map((g) => ({
      domain: g.domain,
      count: g._count.id,
    }));

    res.json(result);
  } catch (error: any) {
    console.error("Analytics domain error:", error);
    res.status(500).json({ error: "Failed to load domain analytics" });
  }
});

/**
 * GET /api/analytics/problems-by-status
 * Groups problem challenges by current pipeline status
 */
router.get("/problems-by-status", async (_req, res) => {
  try {
    const grouped = await prisma.problem.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const result = grouped.map((g) => ({
      status: g.status,
      count: g._count.id,
    }));

    res.json(result);
  } catch (error: any) {
    console.error("Analytics status error:", error);
    res.status(500).json({ error: "Failed to load status analytics" });
  }
});

/**
 * GET /api/analytics/university-participation
 * Returns university engagement metrics based on routed problems
 */
router.get("/university-participation", async (_req, res) => {
  try {
    const universities = await prisma.university.findMany({
      include: {
        _count: {
          select: {
            problems: true,
            faculty: true,
            students: true,
          },
        },
      },
      orderBy: {
        problems: { _count: "desc" },
      },
    });

    const result = universities.map((u) => ({
      id: u.id,
      name: u.name,
      location: u.location,
      routedProblemsCount: u._count.problems,
      facultyCount: u._count.faculty,
      studentsCount: u._count.students,
    }));

    res.json(result);
  } catch (error: any) {
    console.error("Analytics university participation error:", error);
    res.status(500).json({ error: "Failed to load university participation analytics" });
  }
});

export default router;
