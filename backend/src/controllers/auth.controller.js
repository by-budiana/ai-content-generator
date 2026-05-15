const bcrypt = require("bcryptjs"); // Konsisten pakai bcryptjs
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { z } = require("zod");

// Schema Validasi
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password dengan bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      // Hanya ambil field yang diperlukan untuk response
      select: { id: true, name: true, email: true, avatar: true },
    });

    console.log(`[AUTH] New user registered: ${email}`);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("[REGISTER ERROR]", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    // Log untuk melihat apa yang sebenarnya dikirim oleh frontend
    console.log("[DEBUG] Login Attempt Payload:", req.body);

    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(`[AUTH] Login failed: User ${email} not found.`);
      return res.status(400).json({ message: "User not found. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`[AUTH] Login failed: Password mismatch for ${email}.`);
      return res.status(400).json({ message: "Incorrect password." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[CRITICAL] JWT_SECRET is missing in .env file!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log(`[AUTH] Login success: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // PENTING: Log ini akan memberitahu field mana yang bikin Error 400
      console.log("[ZOD ERROR] Detail:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    }
    console.error("[AUTH ERROR]", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- GET PROFILE (ME) ---
exports.getMe = async (req, res) => {
  try {
    // Pastikan req.user didapat dari middleware verifyToken
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("[GET ME ERROR]", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
