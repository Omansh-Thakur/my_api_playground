"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)();
/**
 * GET /projects
 * GET /projects?skill=python
 */
router.get("/", async (req, res) => {
    const skill = req.query.skill;
    const projects = await prisma_1.prisma.project.findMany({
        where: skill
            ? {
                skills: {
                    some: {
                        skill: {
                            name: {
                                equals: skill,
                                mode: "insensitive",
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
    });
    res.json(projects);
});
exports.default = router;
