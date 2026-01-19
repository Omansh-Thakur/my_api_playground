"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
/**
 * POST /auth/signup
 * Creates a new user with email and password
 */
router.post("/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // Check if user already exists
        const existingProfile = await prisma_1.prisma.profile.findUnique({
            where: { email },
        });
        if (existingProfile) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user profile
        const profile = await prisma_1.prisma.profile.create({
            data: {
                email,
                name: name || email.split("@")[0],
                password: hashedPassword,
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: profile.id,
                email: profile.email,
                name: profile.name,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
/**
 * POST /auth/signin
 * Authenticates user and returns JWT token
 */
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        // Find user
        const profile = await prisma_1.prisma.profile.findUnique({
            where: { email },
        });
        if (!profile || !profile.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, profile.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({
            message: "Signed in successfully",
            token,
            user: {
                id: profile.id,
                email: profile.email,
                name: profile.name,
            },
        });
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
