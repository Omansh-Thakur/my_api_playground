import { Router } from "express";
import { prisma } from "../prisma";
import { middleware } from "../middleware";

const router = Router();

/**
 * GET /projects?skill=<skillName>
 * Fetch projects, optionally filtered by skill name
 */
router.get("/", async (req, res) => {
  try {
    const skill = req.query.skill as string | undefined;
    console.log(`[Projects] GET /projects${skill ? ` (skill: ${skill})` : ""}`);

    const projects = await prisma.project.findMany({
      where: skill
        ? {
            skills: {
              some: {
                skill: {
                  name: {
                    equals: skill,
                  },
                },
              },
            },
          }
        : {},
      include: {
        skills: { include: { skill: true } },
        links: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    console.error("[Projects] Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

/**
 * POST /projects (protected)
 * Create a new project
 * Body: { title, description, work, profileId }
 */
router.post("/", middleware, async (req, res) => {
  try {
    const { title, description, work, profileId } = req.body;

    if (!title || !profileId) {
      return res.status(400).json({ error: "Title and profileId are required" });
    }

    console.log(`[Projects] POST /projects - title: ${title}`);

    const project = await prisma.project.create({
      data: {
        title,
        description: description || "",
        work: work || "Personal Project",
        profileId,
        createdAt: new Date(),
      },
      include: {
        skills: { include: { skill: true } },
        links: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("[Projects] Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

/**
 * POST /projects/from-github (protected)
 * Create a project from GitHub URL
 * Body: { githubUrl: "https://github.com/username/repo", profileId: "..." }
 */
router.post("/from-github", middleware, async (req, res) => {
  try {
    const { githubUrl, profileId } = req.body;

    if (!githubUrl || !profileId) {
      return res.status(400).json({ error: "GitHub URL and profileId are required" });
    }

    console.log(`[Projects] POST /projects/from-github - ${githubUrl}`);

    const urlParts = githubUrl.split("/");
    const repoName = urlParts[urlParts.length - 1].replace(".git", "");
    const ownerName = urlParts[urlParts.length - 2];

    const project = await prisma.project.create({
      data: {
        title: repoName,
        description: `GitHub project: ${ownerName}/${repoName}`,
        work: "Open Source",
        profileId,
        createdAt: new Date(),
        links: {
          create: [
            {
              type: "github",
              url: githubUrl,
            },
          ],
        },
      },
      include: {
        skills: { include: { skill: true } },
        links: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("[Projects] Error creating project from GitHub:", error);
    res.status(500).json({ error: "Failed to create project from GitHub" });
  }
});

export default router;