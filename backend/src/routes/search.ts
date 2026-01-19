import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * GET /search?q=<query>
 * Search across projects and skills
 * Returns projects and skills matching the query
 * Note: Search is case-insensitive for SQLite
 */
router.get("/", async (req, res) => {
  try {
    const query = (req.query.q as string)?.trim();

    if (!query || query.length < 1) {
      return res.status(400).json({ error: "Query parameter 'q' is required and must be non-empty" });
    }

    console.log(`[Search] GET /search?q=${query}`);

    // Search projects by title or description
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        skills: { include: { skill: true } },
        links: true,
      },
      take: 20,
    });

    // Search skills by name
    const skills = await prisma.skill.findMany({
      where: {
        name: { contains: query },
      },
      take: 20,
    });

    res.json({
      query,
      results: {
        projects: projects.length > 0 ? projects : [],
        skills: skills.length > 0 ? skills : [],
      },
      count: {
        projects: projects.length,
        skills: skills.length,
      },
    });
  } catch (error) {
    console.error("[Search] Error:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

export default router;
