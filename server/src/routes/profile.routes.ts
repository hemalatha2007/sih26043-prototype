import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();

/**
 * Helper to calculate dynamic profile completeness percentage
 */
function calculateCompleteness(role: string, profile: any): { completeness: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let score = 30; // base score for registration

  if (role === "STUDENT") {
    if (profile?.universityName) score += 15; else suggestions.push("Add your college / university name.");
    if (profile?.department) score += 10; else suggestions.push("Add your department.");
    if (profile?.primaryDomain && profile.primaryDomain !== "OTHER") score += 15; else suggestions.push("Select a primary domain to receive relevant challenges.");
    if (profile?.skills && profile.skills.length > 0) score += 15; else suggestions.push("Add your skills to improve expertise matching.");
    if (profile?.projects && profile.projects.length > 0) score += 15; else suggestions.push("Add completed projects to demonstrate experience.");
  } else if (role === "FACULTY") {
    if (profile?.universityName) score += 15; else suggestions.push("Add your institution name.");
    if (profile?.department) score += 10; else suggestions.push("Add your department.");
    if (profile?.primaryResearchDomain) score += 15; else suggestions.push("Select your primary research domain.");
    if (profile?.expertise && profile.expertise.length > 0) score += 15; else suggestions.push("Add research areas & expertise.");
    if (profile?.projects && profile.projects.length > 0) score += 15; else suggestions.push("Add research projects & publications.");
  } else if (role === "PUBLISHER") {
    if (profile?.organizationName) score += 20; else suggestions.push("Add your organization name.");
    if (profile?.organizationType) score += 15; else suggestions.push("Select your organization type.");
    if (profile?.city || profile?.district) score += 15; else suggestions.push("Add your location / district.");
    if (profile?.workingDomains && profile.workingDomains.length > 0) score += 20; else suggestions.push("Add primary working domains.");
  }

  return { completeness: Math.min(score, 100), suggestions };
}

/**
 * GET /api/profile — Fetch current authenticated user's complete profile & projects
 */
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        publisher: true,
        student: { include: { projects: { orderBy: { createdAt: "desc" } } } },
        faculty: { include: { projects: { orderBy: { createdAt: "desc" } } } },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    let profileData: any = null;
    if (user.role === "STUDENT") profileData = user.student;
    else if (user.role === "FACULTY") profileData = user.faculty;
    else if (user.role === "PUBLISHER") profileData = user.publisher;

    const meta = calculateCompleteness(user.role, profileData);

    res.json({
      user,
      profile: profileData,
      completeness: meta.completeness,
      suggestions: meta.suggestions,
    });
  } catch (error: any) {
    console.error("[PROFILE GET ERROR]", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * PATCH /api/profile — Update user basic & profile details in PostgreSQL
 */
router.patch("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name, ...profileFields } = req.body ?? {};

    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: String(name).trim() },
      });
    }

    if (user.role === "STUDENT") {
      await prisma.student.upsert({
        where: { userId },
        create: {
          userId,
          name: user.name,
          universityName: profileFields.universityName || "Anna Institute of Technology",
          department: profileFields.department || "Computer Science & Engineering",
          yearOfStudy: profileFields.yearOfStudy || "3rd Year",
          location: profileFields.location || "Coimbatore, TN",
          primaryDomain: profileFields.primaryDomain || "DISASTER_MANAGEMENT",
          secondaryDomains: Array.isArray(profileFields.secondaryDomains) ? profileFields.secondaryDomains : [],
          skills: Array.isArray(profileFields.skills) ? profileFields.skills : [],
          interests: Array.isArray(profileFields.interests) ? profileFields.interests : [],
          bio: profileFields.bio || "",
        },
        update: {
          universityName: profileFields.universityName,
          department: profileFields.department,
          yearOfStudy: profileFields.yearOfStudy,
          location: profileFields.location,
          primaryDomain: profileFields.primaryDomain,
          secondaryDomains: Array.isArray(profileFields.secondaryDomains) ? profileFields.secondaryDomains : undefined,
          skills: Array.isArray(profileFields.skills) ? profileFields.skills : undefined,
          interests: Array.isArray(profileFields.interests) ? profileFields.interests : undefined,
          bio: profileFields.bio,
        },
      });
    } else if (user.role === "FACULTY") {
      await prisma.faculty.upsert({
        where: { userId },
        create: {
          userId,
          name: user.name,
          role: "Faculty Mentor",
          universityName: profileFields.universityName || "Anna Institute of Technology",
          department: profileFields.department || "Computer Science & Engineering",
          designation: profileFields.designation || "Professor",
          location: profileFields.location || "Coimbatore, TN",
          primaryResearchDomain: profileFields.primaryResearchDomain || "DISASTER_MANAGEMENT",
          secondaryResearchDomains: Array.isArray(profileFields.secondaryResearchDomains) ? profileFields.secondaryResearchDomains : [],
          researchAreas: Array.isArray(profileFields.researchAreas) ? profileFields.researchAreas : [],
          expertise: Array.isArray(profileFields.expertise) ? profileFields.expertise : [],
          skills: Array.isArray(profileFields.skills) ? profileFields.skills : [],
          bio: profileFields.bio || "",
        },
        update: {
          universityName: profileFields.universityName,
          department: profileFields.department,
          designation: profileFields.designation,
          location: profileFields.location,
          primaryResearchDomain: profileFields.primaryResearchDomain,
          secondaryResearchDomains: Array.isArray(profileFields.secondaryResearchDomains) ? profileFields.secondaryResearchDomains : undefined,
          researchAreas: Array.isArray(profileFields.researchAreas) ? profileFields.researchAreas : undefined,
          expertise: Array.isArray(profileFields.expertise) ? profileFields.expertise : undefined,
          skills: Array.isArray(profileFields.skills) ? profileFields.skills : undefined,
          bio: profileFields.bio,
        },
      });
    } else if (user.role === "PUBLISHER") {
      await prisma.publisherProfile.upsert({
        where: { userId },
        create: {
          userId,
          organizationName: profileFields.organizationName || "Government / Industry Organization",
          organizationType: profileFields.organizationType || "Government Department",
          designation: profileFields.designation || "Innovation Officer",
          location: profileFields.location || "National",
          city: profileFields.city || "Coimbatore",
          district: profileFields.district || "Coimbatore District",
          state: profileFields.state || "Tamil Nadu",
          country: profileFields.country || "India",
          workingDomains: Array.isArray(profileFields.workingDomains) ? profileFields.workingDomains : ["DISASTER_MANAGEMENT"],
          organizationDescription: profileFields.organizationDescription || "",
          website: profileFields.website || "",
        },
        update: {
          organizationName: profileFields.organizationName,
          organizationType: profileFields.organizationType,
          designation: profileFields.designation,
          location: profileFields.location,
          city: profileFields.city,
          district: profileFields.district,
          state: profileFields.state,
          country: profileFields.country,
          workingDomains: Array.isArray(profileFields.workingDomains) ? profileFields.workingDomains : undefined,
          organizationDescription: profileFields.organizationDescription,
          website: profileFields.website,
        },
      });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("[PROFILE UPDATE ERROR]", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * POST /api/profile/projects — Add a new project
 */
router.post("/projects", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { title, description, domain, technologies, completionYear, projectUrl } = req.body ?? {};
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : String(technologies || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    if (user.role === "STUDENT") {
      let student = await prisma.student.findUnique({ where: { userId } });
      if (!student) {
        student = await prisma.student.create({ data: { userId, name: user.name } });
      }
      const project = await prisma.studentProject.create({
        data: {
          studentId: student.id,
          title: String(title).trim(),
          description: String(description).trim(),
          domain: domain || "DISASTER_MANAGEMENT",
          technologies: techArray,
          completionYear: completionYear || "2025",
          projectUrl: projectUrl || null,
        },
      });
      return res.status(201).json(project);
    } else if (user.role === "FACULTY") {
      let faculty = await prisma.faculty.findUnique({ where: { userId } });
      if (!faculty) {
        faculty = await prisma.faculty.create({ data: { userId, name: user.name } });
      }
      const project = await prisma.mentorProject.create({
        data: {
          facultyId: faculty.id,
          title: String(title).trim(),
          description: String(description).trim(),
          domain: domain || "DISASTER_MANAGEMENT",
          technologies: techArray,
          completionYear: completionYear || "2024",
          projectUrl: projectUrl || null,
        },
      });
      return res.status(201).json(project);
    } else {
      return res.status(403).json({ error: "Projects are only supported for Student and Faculty roles" });
    }
  } catch (error: any) {
    console.error("[ADD PROJECT ERROR]", error);
    res.status(500).json({ error: "Failed to add project" });
  }
});

/**
 * DELETE /api/profile/projects/:id — Delete a project
 */
router.delete("/projects/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "STUDENT") {
      await prisma.studentProject.delete({ where: { id: req.params.id } });
    } else if (user.role === "FACULTY") {
      await prisma.mentorProject.delete({ where: { id: req.params.id } });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("[DELETE PROJECT ERROR]", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
