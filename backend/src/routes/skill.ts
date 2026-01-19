import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * GET /skills
 * Fetch all skills
 */
router.get("/", async (_, res) => {
  try {
    console.log("[Skills] GET /skills");
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    });
    res.json(skills);
  } catch (error) {
    console.error("[Skills] Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

/**
 * GET /skills/top
 * Fetch top skills by frequency across all projects
 */
router.get("/top", async (_, res) => {
  try {
    console.log("[Skills] GET /skills/top");
    const skills = await prisma.projectSkill.groupBy({
      by: ["skillId"],
      _count: true,
      orderBy: {
        _count: {
          skillId: "desc",
        },
      },
      take: 10,
    });

    // Fetch skill details for each top skill
    const skillIds = skills.map((s) => s.skillId);
    const skillDetails = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
    });

    const result = skills
      .map((s) => {
        const skill = skillDetails.find((sd) => sd.id === s.skillId);
        return skill ? { ...skill, _count: s._count } : null;
      })
      .filter((s) => s !== null);

    res.json(result);
  } catch (error) {
    console.error("[Skills] Error fetching top skills:", error);
    res.status(500).json({ error: "Failed to fetch top skills" });
  }
});

export default router;
