import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

/**
 * GET /api/notifications — Fetch user notifications from PostgreSQL
 */
router.get("/", authenticateToken, async (req: any, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        relatedProblem: {
          select: { id: true, title: true, primaryDomain: true, status: true },
        },
      },
    });

    res.json(notifications);
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

/**
 * GET /api/notifications/unread-count — Get unread count for header bell badge
 */
router.get("/unread-count", authenticateToken, async (req: any, res) => {
  try {
    const unreadCount = await prisma.notification.count({
      where: {
        userId: req.user.userId,
        isRead: false,
      },
    });

    res.json({ unreadCount });
  } catch (error: any) {
    console.error("Unread count error:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

/**
 * PATCH /api/notifications/:id/read — Mark single notification as read
 */
router.patch("/:id/read", authenticateToken, async (req: any, res) => {
  try {
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Mark read error:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

/**
 * PATCH /api/notifications/read-all — Mark all notifications as read
 */
router.patch("/read-all", authenticateToken, async (req: any, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Mark all read error:", error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

export default router;
