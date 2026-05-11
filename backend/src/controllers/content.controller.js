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
});

exports.generateContent = async (req, res) => {
  try {
    const validated =
      generateSchema.parse(req.body);

    const {
      prompt,
      type,
      language,
    } = validated;

    let finalPrompt = "";

    if (type === "CAPTION") {
      finalPrompt = `
Buat caption media sosial menarik dalam ${
        language === "ID"
          ? "Bahasa Indonesia"
          : "English"
      }.

Topik:
${prompt}
`;
    }

    else if (
      type === "DESCRIPTION"
    ) {
      finalPrompt = `
Buat deskripsi menarik dalam ${
        language === "ID"
          ? "Bahasa Indonesia"
          : "English"
      }.

Topik:
${prompt}
`;
    }

    else if (type === "TAGLINE") {
      finalPrompt = `
Buat tagline singkat dan menarik dalam ${
        language === "ID"
          ? "Bahasa Indonesia"
          : "English"
      }.

Topik:
${prompt}
`;
    }

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
          model:
            "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "user",
              content: finalPrompt,
            },
          ],
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

    const savedContent =
      await prisma.content.create({
        data: {
          userId: req.user.id,

          inputPrompt: prompt,

          result,

          type,

          language,
        },
      });

    res.json(savedContent);
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

      res.json(history);
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

      const { newPrompt } =
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
            model:
              "openai/gpt-3.5-turbo",

            messages: [
              {
                role: "user",
                content: `
Previous Prompt:
${oldContent.inputPrompt}

Previous AI Response:
${oldContent.result}

New User Message:
${newPrompt}

Continue naturally.
`,
              },
            ],
          }),
        }
      );

      const data =
        await response.json();

      const text =
        data.choices[0].message
          .content;

      const updated =
        await prisma.content.update({
          where: {
            id: parseInt(id),
          },

          data: {
            inputPrompt: `${oldContent.inputPrompt}

${newPrompt}`,

            result: `${oldContent.result}

${text}`,
          },
        });

      res.json(updated);
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