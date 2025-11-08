import express from 'express';
import { Team } from '../models/Team.js';
import { QRCode } from '../models/QRCode.js';
import { Level } from '../models/Level.js';

const router = express.Router();

/**
 * @route POST /api/qr/scan
 * @body { teamId: number, qrCode: string }
 */
router.post('/scan', async (req, res) => {
  try {
    const { teamId, qrCode } = req.body;

    // 1️Fetch team and QR
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const qr = await QRCode.findByCode(qrCode);
    if (!qr) return res.status(404).json({ error: 'Invalid QR code' });

    // 2 Cohort check
    if (team.cohortId !== qr.cohortId)
      return res.status(403).json({ error: 'QR code does not belong to your cohort' });

    // 3️Already completed?
    const completed = await Level.isCompleted(team.id, qr.level);
    if (completed)
      return res.status(400).json({ error: 'Level already completed' });

    // 4 Must complete previous level first
    if (qr.level !== team.currentLevel + 1)
      return res.status(400).json({
        error: `You must complete level ${team.currentLevel + 1} next`
      });

    // 5 Mark level completed
    await Level.markCompleted(team.id, qr.level);
    await Team.updateCurrentLevel(team.id, qr.level);

    res.json({
      message: `🎉 Level ${qr.level} completed successfully for Cohort ${team.cohort.name}!`,
      currentLevel: qr.level
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;