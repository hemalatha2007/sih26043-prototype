import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/** POST /api/problems/:problemId/tasks — add a card to the board */
router.post("/problems/:problemId/tasks", async (req, res) => {
  const { title } = req.body ?? {};
  if (!title) return res.status(400).json({ error: "title is required" });

  const task = await prisma.task.create({
    data: { problemId: req.params.problemId, title, column: "TODO" },
  });
  res.status(201).json(task);
});

/** PATCH /api/tasks/:id — move a card between TODO / DOING / DONE */
router.patch("/tasks/:id", async (req, res) => {
  const { column } = req.body ?? {};
  if (!["TODO", "DOING", "DONE"].includes(column)) {
    return res.status(400).json({ error: "column must be TODO, DOING or DONE" });
  }
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { column },
  });
  res.json(task);
});

export default router;
