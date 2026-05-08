const prisma = require("../lib/prisma");
const { z } = require("zod");

const generateSchema = z.object({
  prompt: z.string().min(5),
  type: z.enum(["CAPTION", "DESCRIPTION", "TAGLINE"]),
  language: z.enum(["ID", "EN"]),
});

// --- GENERATE CONTENT ---
exports.generateContent = async (req, res) => {
  try {
    const validatedData = generateSchema.parse(req.body);
    const { prompt, type, language } = validatedData;

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey)
      return res.status(500).json({ message: "API Key Groq tidak ditemukan" });

    const targetLang = language === "ID" ? "Bahasa Indonesia" : "English";

    // Instruksi yang lebih berfokus pada "Content Creation"
    const taskInstructions = {
      CAPTION:
        "Buatlah caption media sosial yang viral dan engaging. Gunakan struktur: Hook yang menarik, isi yang informatif/persuasif, dan akhiri dengan Call to Action (CTA) serta 3 hashtag.",
      DESCRIPTION:
        "Buatlah deskripsi mendalam dan profesional mengenai topik yang diberikan. Fokus pada detail teknis, manfaat, dan nilai tambah dengan gaya penulisan copy yang meyakinkan.",
      TAGLINE:
        "Buatlah 3 opsi tagline singkat yang catchy, berenergi, dan mudah diingat (memorable) untuk merepresentasikan input tersebut.",
    };

    const systemPrompt = `
  Anda adalah AI Content Strategist dan Copywriter handal yang menguasai teknik penulisan persuasif dan kreatif.
  
  Tugas: ${taskInstructions[type]}
  Bahasa: Wajib menggunakan ${targetLang}.
  
  Aturan Ketat:
  1. Output HANYA berisi konten yang diminta (Tanpa kata pengantar, tanpa "Ini hasilnya", tanpa tanda kutip di awal/akhir).
  2. Sesuaikan tone dengan jenis konten: CAPTION (Energetik), DESCRIPTION (Informatif & Berwibawa), TAGLINE (Singkat & Tajam).
  3. Pastikan terminologi yang digunakan modern dan sesuai tren industri saat ini.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              // Masukkan semua instruksi teknis di sini agar AI patuh
              content: systemPrompt,
            },
            {
              role: "user",
              // Masukkan input teks dari user di sini
              content: `Input data: ${prompt}`,
            },
          ],
          temperature: 0.8,
        }),
      },
    );

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || "";

    const currentUserId = req.user?.id || 1;

    const content = await prisma.content.create({
      data: {
        userId: currentUserId,
        inputPrompt: prompt,
        result: resultText.trim(),
        type: type,
        language: language,
      },
    });

    res.status(201).json(content);
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: error.message });
  }
};

// --- GET HISTORY ---
exports.getHistory = async (req, res) => {
  try {
    const currentUserId = req.user?.id || 1;
    const history = await prisma.content.findMany({
      where: { userId: currentUserId },
      orderBy: { createdAt: "desc" },
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- TOGGLE FAVORITE ---
exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || 1;
    const content = await prisma.content.findUnique({
      where: { id: parseInt(id) },
    });

    if (!content || content.userId !== currentUserId)
      return res.status(404).json({ message: "Konten tidak ditemukan" });

    const updated = await prisma.content.update({
      where: { id: parseInt(id) },
      data: { isFavorite: !content.isFavorite },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- RATE CONTENT ---
exports.rateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const currentUserId = req.user?.id || 1;

    const rating = await prisma.rating.upsert({
      where: {
        userId_contentId: { userId: currentUserId, contentId: parseInt(id) },
      },
      update: { value },
      create: { userId: currentUserId, contentId: parseInt(id), value },
    });
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- DELETE CONTENT ---
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || 1;

    const content = await prisma.content.findUnique({
      where: { id: parseInt(id) },
    });
    if (!content || content.userId !== currentUserId) {
      return res
        .status(404)
        .json({ message: "Unauthorized atau data tidak ada" });
    }

    await prisma.content.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
