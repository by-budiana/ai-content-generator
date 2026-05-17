require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const prisma = require("./lib/prisma");

const app = express();

const PORT = process.env.PORT || 5000;

// ======================
// MIDDLEWARE
// ======================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ai-content-generator-self-xi.vercel.app/",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(morgan("dev"));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ======================
// ROOT
// ======================

app.get("/", (req, res) => {
  res.json({
    message:
      "AI Content Generator API is running...",
  });
});

// ======================
// HEALTH CHECK
// ======================

app.get(
  "/api/health",
  async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: "OK",
        database: "Connected",
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        database: "Disconnected",
        error: error.message,
      });
    }
  }
);

// ======================
// ROUTES
// ======================

const authRoutes = require("./routes/auth.routes");

const contentRoutes = require("./routes/content.routes");

const templateRoutes = require("./routes/template.routes");

const dashboardRoutes = require("./routes/dashboard.routes");

const userRoutes = require("./routes/user.routes");

app.use("/api/auth", authRoutes);

app.use(
  "/api/content",
  contentRoutes
);

app.use(
  "/api/templates",
  templateRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use("/api/user", userRoutes);

// ======================
// ERROR HANDLER
// ======================

app.use(
  (err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
      message:
        "Internal Server Error",

      error:
        process.env.NODE_ENV ===
        "development"
          ? err.message
          : {},
    });
  }
);

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});
