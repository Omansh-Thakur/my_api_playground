"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * GET /profile
 */
router.get("/", async (req, res) => {
    const profile = await prisma_1.prisma.profile.findFirst({
        include: {
            education: true,
            skills: true,
            projects: true,
            links: true,
        },
    });
    res.json(profile);
});
/**
 * POST /profile (protected)
 */
router.post("/", middleware_1.middleware, async (req, res) => {
    const { name, email } = req.body;
    const profile = await prisma_1.prisma.profile.create({
        data: { name, email },
    });
    res.json(profile);
});
exports.default = router;
