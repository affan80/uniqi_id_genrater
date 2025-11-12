// backend/routes/adminRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * 🧠 GET all cohorts with their teams and progress
 */
router.get("/cohorts", async (req, res) => {
  try {
    const cohorts = await prisma.cohort.findMany({
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            currentLevel: true,
          },
        },
        qrcodes: {
          select: {
            level: true,
            flag: true,
            limit: true,
            currentTeams: true,
          },
        },
      },
    });

    res.json(cohorts);
  } catch (error) {
    console.error("❌ Error fetching cohorts:", error.message);
    res.status(500).json({ error: "Failed to fetch cohort data" });
  }
});

/**
 * 🧠 GET specific cohort details
 */
router.get("/cohorts/:id", async (req, res) => {
  try {
    const cohortId = parseInt(req.params.id);
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      include: {
        teams: true,
        qrcodes: true,
      },
    });

    if (!cohort) return res.status(404).json({ error: "Cohort not found" });

    res.json(cohort);
  } catch (error) {
    console.error("❌ Error fetching cohort:", error.message);
    res.status(500).json({ error: "Failed to fetch cohort" });
  }
});

export default router;
