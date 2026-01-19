import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "123123";

/**
 * POST /auth/signup
 * Create a new user account with email and password
 * Body: { email, password, name? }
 * Returns: { token, user }
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    console.log(`[Auth] POST /auth/signup - email: ${email}`);

    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingProfile) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = await prisma.profile.create({
      data: {
        email,
        name: name || email.split("@")[0],
        password: hashedPassword,
      } as any,
    });

    const token = jwt.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(`[Auth] Signup successful for ${email}`);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    });
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /auth/signin
 * Sign in with email and password
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log(`[Auth] POST /auth/signin - email: ${email}`);

    const profile = await prisma.profile.findUnique({
      where: { email },
    });

    if (!profile || !(profile as any).password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, (profile as any).password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(`[Auth] Signin successful for ${email}`);

    res.json({
      message: "Signed in successfully",
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    });
  } catch (error) {
    console.error("[Auth] Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
