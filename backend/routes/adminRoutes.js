// backend/routes/adminRoutes.js
import express from "express";
import { Cohort } from "../models/Cohort.js";
import { Team } from "../models/Team.js";
import { QRCode } from "../models/QRCode.js";

const router = express.Router();

/**
 * 🧠 GET all cohorts with their teams and QR progress
 */
router.get("/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find()
      .lean()
      .then(async (cohortDocs) => {
        return Promise.all(
          cohortDocs.map(async (c) => {
            const teams = await Team.find({ cohortId: c._id })
              .select("id name currentLevel")
              .lean();

            const qrcodes = await QRCode.find({ cohortId: c._id })
              .select("level flag limit currentTeams")
              .lean();

            return {
              ...c,
              teams,
              qrcodes,
            };
          })
        );
      });

    res.json(cohorts);
  } catch (error) {
    console.error("❌ Error fetching cohorts:", error.message);
    res.status(500).json({ error: "Failed to fetch cohort data" });
  }
});

/**
 * 🧠 GET specific cohort by ID
 */
router.get("/cohorts/:id", async (req, res) => {
  try {
    const cohortId = req.params.id;

    const cohort = await Cohort.findById(cohortId).lean();
    if (!cohort) return res.status(404).json({ error: "Cohort not found" });

    const teams = await Team.find({ cohortId }).lean();
    const qrcodes = await QRCode.find({ cohortId }).lean();

    res.json({
      ...cohort,
      teams,
      qrcodes,
    });
  } catch (error) {
    console.error("❌ Error fetching cohort:", error.message);
    res.status(500).json({ error: "Failed to fetch cohort" });
  }
});

export default router;
