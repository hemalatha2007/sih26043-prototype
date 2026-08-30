import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/** GET /api/universities — the ecosystem the matcher routes into */
router.get("/", async (_req, res) => {
  const universities = await prisma.university.findMany({
    include: { faculty: true, students: true },
    orderBy: { name: "asc" },
  });
  res.json(universities);
});

export default router;
