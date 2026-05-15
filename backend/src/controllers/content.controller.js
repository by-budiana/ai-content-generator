const prisma = require("../lib/prisma");

const fetch = require("node-fetch");

require("dotenv").config();

console.log(
  "OPENROUTER_API_KEY:",
  process.env.OPENROUTER_API_KEY
);

const { z } = require("zod");

const generateSchema = z.object({
  prompt: z.string().min(1),

  type: z.enum([
    "CAPTION",
    "DESCRIPTION",
    "TAGLINE",
  ]),

  language: z.enum(["ID", "EN"]),
});

const continueSchema = z.object({
  newPrompt: z.string().min(1),
  type: z.enum(["CAPTION", "DESCRIPTION", "TAGLINE"]).optional(),
  language: z.enum(["ID", "EN"]).optional(),
});

/**
 * Build a professional system prompt based on type and language
 */
const buildCaptionPrompt = (langInstruction, langName) => {
  return `Kamu adalah penulis caption Instagram dan media sosial profesional.
Tugasmu HANYA membuat CAPTION media sosial.

ATURAN KETAT:
- WAJIB gunakan ${langName.toUpperCase()}.
- ${langInstruction}
- Gunakan gaya bahasa social media yang engaging dan natural.
- BOLEH menggunakan emoji yang relevan.
- BOLEH menggunakan hashtag di akhir.
- MAKSIMAL buat 3 variasi caption.
- JANGAN membuat deskripsi panjang/paragraf.
- JANGAN membuat tagline saja.
- JANGAN mencampur format lain.

WAJIB IKUTI FORMAT INI:
Variation 1:
[Konten Caption]

Variation 2:
[Konten Caption]`;
};

const buildDescriptionPrompt = (langInstruction, langName) => {
  return `Kamu adalah copywriter profesional dan konsultan bisnis.
Tugasmu HANYA membuat DESCRIPTION produk/jasa yang profesional.

ATURAN KETAT:
- WAJIB gunakan ${langName.toUpperCase()}.
- ${langInstruction}
- Buat dalam 1-2 paragraf yang rapi dan informatif.
- Fokus pada penjelasan produk/jasa dan value proposition.
- JANGAN gunakan hashtag.
- JANGAN gunakan format "Variation 1/2/3".
- JANGAN gunakan bullet list jika tidak diminta.
- JANGAN menggunakan gaya bahasa "alay" atau caption Instagram.
- EMOJI MAKSIMAL 1.
- JANGAN membuat tagline atau caption.

WAJIB fokus pada kejelasan dan profesionalisme.`;
};

const buildTaglinePrompt = (langInstruction, langName) => {
  return `Kamu adalah pembuat slogan brand (Tagline) profesional.
Tugasmu HANYA membuat TAGLINE singkat dan catchy.

ATURAN KETAT:
- WAJIB gunakan ${langName.toUpperCase()}.
- ${langInstruction}
- Buat tepat 10 pilihan tagline.
- Setiap tagline MAKSIMAL 3-8 kata.
- JANGAN gunakan hashtag.
- JANGAN gunakan paragraf atau deskripsi panjang.
- JANGAN gunakan Call to Action (CTA) yang panjang.
- JANGAN membuat caption.

WAJIB gunakan format Numbered List (1-10).`;
};

const buildSystemPrompt = (type, language) => {
  const langName = language === "ID" ? "Bahasa Indonesia" : "English";
  const langInstruction = language === "ID" 
    ? "MANDATORY: Seluruh respon harus dalam Bahasa Indonesia yang natural. Hindari istilah bahasa Inggris yang tidak perlu."
    : "MANDATORY: Your entire response must be in natural, native-level English.";

  switch (type) {
    case "CAPTION":
      return buildCaptionPrompt(langInstruction, langName);
    case "DESCRIPTION":
      return buildDescriptionPrompt(langInstruction, langName);
    case "TAGLINE":
      return buildTaglinePrompt(langInstruction, langName);
    default:
      return `Kamu adalah AI Assistant profesional dalam ${langName}.`;
  }
};

/**
 * Build user prompt for better context
 */
const buildUserPrompt = (prompt, type) => {
  return `Generate ${type.toLowerCase()} based on the following topic/input:
"${prompt}"`;
};

exports.generateContent = async (req, res) => {
  try {
    const validated =
      generateSchema.parse(req.body);

    const {
      prompt,
      type,
      language,
    } = validated;

    // Prompt builder logic handles everything now
    // No need for manual finalPrompt construction here

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "HTTP-Referer":
            "http://localhost:5173",

          "X-Title":
            "AI Content Generator",

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(type, language),
            },
            {
              role: "user",
              content: buildUserPrompt(prompt, type),
            },
          ],
          temperature: 0.8,
        }),
      }
    );

    const data =
      await response.json();

    console.log(
      "OPENROUTER:",
      JSON.stringify(data, null, 2)
    );

    if (
      !data.choices ||
      !data.choices.length
    ) {
      return res.status(500).json({
        message:
          "AI response kosong",
        data,
      });
    }

    const result =
      data.choices[0].message.content;

    const initialMessages = [
      { role: "user", content: prompt },
      { role: "assistant", content: result }
    ];

    const savedContent =
      await prisma.content.create({
        data: {
          userId: req.user.id,
          inputPrompt: prompt,
          result,
          messages: JSON.stringify(initialMessages),
          type,
          language,
        },
      });

    res.json({
      ...savedContent,
      messages: initialMessages
    });
  } catch (error) {
    console.log(
      "GENERATE ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Generate failed",
    });
  }
};

exports.getHistory =
  async (req, res) => {
    try {
      const history =
        await prisma.content.findMany({
          where: {
            userId: req.user.id,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      const formattedHistory = history.map(item => ({
        ...item,
        messages: JSON.parse(item.messages || "[]")
      }));

      res.json(formattedHistory);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.deleteContent =
  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.content.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.json({
        message:
          "Deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.continueConversation =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { newPrompt, type, language } =
        continueSchema.parse(
          req.body
        );

      const oldContent =
        await prisma.content.findUnique(
          {
            where: {
              id: parseInt(id),
            },
          }
        );

      if (!oldContent) {
        return res
          .status(404)
          .json({
            message:
              "Conversation not found",
          });
      }

      // Use updated type/language if provided, otherwise use old ones
      const currentType = type || oldContent.type;
      const currentLanguage = language || oldContent.language;

      const history = JSON.parse(oldContent.messages || "[]");
      
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AI Content Generator",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: buildSystemPrompt(currentType, currentLanguage),
              },
              ...history.map(m => ({
                role: m.role,
                content: m.content
              })),
              {
                role: "user",
                content: `[IMPORTANT INSTRUCTION: Switch to ${currentLanguage === "ID" ? "Bahasa Indonesia" : "English"} for the following request. Do not use any other language.]
                
${newPrompt}`,
              },
            ],
            temperature: 0.8,
          }),
        }
      );

      const data =
        await response.json();

      const text =
        data.choices[0].message
          .content;

      const currentMessages = JSON.parse(oldContent.messages || "[]");
      const newMessages = [
        ...currentMessages,
        { role: "user", content: newPrompt },
        { role: "assistant", content: text }
      ];

      const updated =
        await prisma.content.update({
          where: {
            id: parseInt(id),
          },

          data: {
            // Update inputPrompt and result for preview
            inputPrompt: newPrompt, 
            result: text,
            messages: JSON.stringify(newMessages),
            // Sync updated type/language to DB
            type: currentType,
            language: currentLanguage,
          },
        });

      res.json({
        ...updated,
        messages: newMessages
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.toggleFavorite =
  async (req, res) => {
    try {
      const { id } = req.params;

      const content =
        await prisma.content.findUnique(
          {
            where: {
              id: parseInt(id),
            },
          }
        );

      const updated =
        await prisma.content.update({
          where: {
            id: parseInt(id),
          },

          data: {
            isFavorite:
              !content.isFavorite,
          },
        });

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.rateContent =
  async (req, res) => {
    try {
      res.json({
        message:
          "Rating feature ready",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };