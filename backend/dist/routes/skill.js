"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)();
/**
 * GET /skills
 */
router.get("/", async (_, res) => {
    const skills = await prisma_1.prisma.skill.findMany();
    res.json(skills);
});
/**
 * GET /skills/top
 */
router.get("/top", async (_, res) => {
    const skills = await prisma_1.prisma.skill.groupBy({
        by: ["name"],
        _count: true,
        orderBy: {
            _count: {
                name: "desc",
            },
        },
    });
    res.json(skills);
});
exports.default = router;
