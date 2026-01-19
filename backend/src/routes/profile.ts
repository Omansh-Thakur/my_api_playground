import { Router } from "express";
import { prisma } from "../prisma";
import { middleware } from "../middleware";

const router = Router();

/**
 * GET /profile
 * Fetch the first profile with all related data (education, skills, projects, links)
 */
router.get("/", async (req, res) => {
  try {
    console.log("[Profile] GET /profile");
    const profile = await prisma.profile.findFirst({
      include: {
        education: true,
        skills: true,
        projects: {
          include: {
            skills: { include: { skill: true } },
            links: true,
          },
        },
        links: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("[Profile] Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * POST /profile (protected)
 * Create or update profile with name and email
 */
router.post("/", middleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    console.log(`[Profile] POST /profile - updating ${email}`);

    const profile = await prisma.profile.upsert({
      where: { email },
      update: { name, email },
      create: { name, email },
      include: {
        education: true,
        skills: true,
        projects: {
          include: {
            skills: { include: { skill: true } },
            links: true,
          },
        },
        links: true,
      },
    });

    res.status(200).json(profile);
  } catch (error) {
    console.error("[Profile] Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;
