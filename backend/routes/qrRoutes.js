import express from "express";
import { PrismaClient } from "@prisma/client";
import { Team } from "../moduls/Team.js";
import { Level } from "../moduls/Level.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @route POST /scan/:cohort/:level
 * @body { teamId: string }
 */
router.post("/scan/:cohort/:level", async (req, res) => {
  try {
    const { teamId } = req.body;
    const { cohort, level } = req.params;

    if (!teamId) {
      return res.status(400).json({ error: "Missing team ID" });
    }

    const numericLevel = parseInt(level, 10);
    const numericCohort = parseInt(cohort, 10);

    if (Number.isNaN(numericLevel) || Number.isNaN(numericCohort)) {
      return res.status(400).json({ error: "Invalid cohort or level" });
    }

    // Find team
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Ensure team belongs to same cohort
    if (team.cohortId !== numericCohort) {
      return res
        .status(403)
        .json({ error: "This QR code does not belong to your cohort" });
    }

    // Find QR code
    const qr = await prisma.qRCode.findFirst({
      where: { level: numericLevel, cohortId: numericCohort },
    });

    if (!qr) {
      return res
        .status(404)
        .json({ error: "Invalid QR or level not registered" });
    }

    // Check if limit reached

    // Check if already completed
    const completed = await Level.isCompleted(team.id, numericLevel);
    if (completed) {
      return res.status(400).json({ error: "This level is already completed." });
    }
    if (qr.currentTeams >= qr.limit) {
      return res
        .status(400)
        .json({ error: "You're late! This QR is no longer active." });
    }

    // Check sequential level completion
    if (numericLevel !== team.currentLevel + 1) {
      return res.status(400).json({
        error: `You must complete level ${team.currentLevel + 1} next.`,
      });
    }

    // ✅ Mark team level as completed (update currentLevel)
    const updatedTeam = await Level.markCompleted(team.id, numericLevel);

    // 🟢 Send success response FIRST
    res.json({
      message: `🎉 Level ${numericLevel} completed successfully for Cohort ${numericCohort}!`,
      flag: qr.flag,
      team: {
        id: updatedTeam.id,
        currentLevel: updatedTeam.currentLevel,
      },
      qr
    });

    // 🚀 THEN update currentTeams asynchronously (non-blocking)
  } catch (err) {
    console.error("❌ Scan route error:", err);
    res.status(500).json({
      error: "Server error during scan",
      details: err.message,
    });
  }
});

export default router;
