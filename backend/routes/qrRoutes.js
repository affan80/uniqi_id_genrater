import express from "express";
import { Cohort } from "../models/Cohort.js";
import { Team } from "../models/Team.js";
import { QRCode } from "../models/QRCode.js";
import { Level } from "../moduls/Level.js";

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
    const cohortNumber = cohort.trim();

    if (Number.isNaN(numericLevel)) {
      return res.status(400).json({ error: "Invalid level" });
    }

    // ---- Find Team ----
    const team = await Team.findOne({ id: teamId.trim() }).lean();
    if (!team) return res.status(404).json({ error: "Team not found" });

    // ---- Find Cohort Document ----
    const cohortDoc = await Cohort.findOne({ name: `Cohort ${cohortNumber}` });
    if (!cohortDoc)
      return res.status(404).json({ error: "Cohort not found" });

    // Ensure team belongs to same cohort
    if (String(team.cohortId) !== String(cohortDoc._id)) {
      return res.status(403).json({ error: "This QR does not belong to your cohort" });
    }

    // ---- Find QR entry ----
    const qr = await QRCode.findOne({
      level: numericLevel,
      cohortId: cohortDoc._id,
    });

    if (!qr) {
      return res.status(404).json({ error: "Invalid QR or level not registered" });
    }

    // ---- Check if level already completed ----
    const completed = await Level.isCompleted(team.id, numericLevel);
    if (completed) {
      return res.status(400).json({ error: "This level is already completed." });
    }

    // ---- Check if limit reached ----
    if (qr.currentTeams >= qr.limit) {
      return res.status(400).json({
        error: "You're late! This QR is no longer active.",
      });
    }

    // ---- Sequential check ----
    if (numericLevel !== team.currentLevel + 1) {
      return res.status(400).json({
        error: `You must complete level ${team.currentLevel + 1} next.`,
      });
    }

    // ---- Mark completed ----
    const updatedTeam = await Level.markCompleted(team.id, numericLevel);

    res.json({
      message: `🎉 Level ${numericLevel} completed successfully for Cohort ${cohortNumber}!`,
      flag: qr.flag,
      team: {
        id: updatedTeam.id,
        currentLevel: updatedTeam.currentLevel,
      },
      qr,
    });
  } catch (err) {
    console.error("❌ Scan route error:", err);
    res.status(500).json({
      error: "Server error during scan",
      details: err.message,
    });
  }
});

export default router;
