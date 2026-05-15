const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(200).optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: { contents: true },
        },
        contents: {
          select: { type: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Hitung statistik berdasarkan tipe
    const stats = {
      total: user._count.contents,
      caption: user.contents.filter((c) => c.type === "CAPTION").length,
      description: user.contents.filter((c) => c.type === "DESCRIPTION").length,
      tagline: user.contents.filter((c) => c.type === "TAGLINE").length,
    };

    const { password, ...userData } = user;
    res.json({ ...userData, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const validated = updateProfileSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: validated,
    });

    const { password, ...userData } = updatedUser;
    res.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password lama salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
    });

    const { password, ...userData } = updatedUser;
    res.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
