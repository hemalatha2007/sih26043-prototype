import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();

/**
 * POST /api/auth/register
 * Public registration for PUBLISHER, STUDENT, or FACULTY roles.
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required" });
    }

    const targetRole = (role ? String(role).toUpperCase() : "STUDENT") as "PUBLISHER" | "STUDENT" | "FACULTY" | "ADMIN";

    // Prevent public ADMIN registration
    if (targetRole === "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Admin accounts cannot be created via public registration.",
      });
    }

    if (!["PUBLISHER", "STUDENT", "FACULTY"].includes(targetRole)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role specified. Must be PUBLISHER, STUDENT, or FACULTY.",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        passwordHash,
        role: targetRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Optionally link to seed Student/Faculty or create profile if needed
    if (targetRole === "STUDENT") {
      const unlinkedStudent = await prisma.student.findFirst({ where: { userId: null } });
      if (unlinkedStudent) {
        await prisma.student.update({
          where: { id: unlinkedStudent.id },
          data: { userId: user.id },
        });
      }
    } else if (targetRole === "FACULTY") {
      const unlinkedFaculty = await prisma.faculty.findFirst({ where: { userId: null } });
      if (unlinkedFaculty) {
        await prisma.faculty.update({
          where: { id: unlinkedFaculty.id },
          data: { userId: user.id },
        });
      }
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user,
    });
  } catch (err: any) {
    console.error("[AUTH REGISTER ERROR]", err);
    return res.status(500).json({ success: false, error: "Server error during registration" });
  }
});

/**
 * POST /api/auth/login
 * User login with email and password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("[AUTH LOGIN ERROR]", err);
    return res.status(500).json({ success: false, error: "Server error during login" });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user details
 */
router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error("[AUTH ME ERROR]", err);
    return res.status(500).json({ success: false, error: "Server error fetching user" });
  }
});

export default router;
