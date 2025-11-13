import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Team } from '../moduls/Team.js';
import { Level } from '../moduls/Level.js';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @route GET /api/team/:teamId
 * @desc Get team data including captured flags
 */
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    // ✅ 1. Fetch the team
    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ error: 'Team not found' });

    // ✅ 2. Get captured flags (all levels <= currentLevel)
    const capturedFlags = [];
    for (let level = 1; level <= team.currentLevel; level++) {
      const qr = await prisma.qRCode.findFirst({
        where: {
          cohortId: team.cohortId,
          level: level,
        },
      });
      if (qr) {
        capturedFlags.push({
          level: qr.level,
          flag: qr.flag,
          capturedAt: new Date().toISOString(), // In real app, you'd store capture timestamps
        });
      }
    }

    // ✅ 3. Respond
    res.json({
      id: team.id,
      name: team.name,
      currentLevel: team.currentLevel,
      cohort: team.cohort,
      capturedFlags: capturedFlags,
    });

  } catch (err) {
    console.error('❌ Error in /team/:teamId:', err);
    res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
});

/**
 * @route GET /api/cohort/:cohortId/teams
 * @desc Get all teams in a cohort with their current levels
 */
router.get('/cohort/:cohortId/teams', async (req, res) => {
  try {
    const { cohortId } = req.params;
    const cohort = parseInt(cohortId);

    // ✅ 1. Fetch all teams in the cohort
    const teams = await prisma.team.findMany({
      where: { cohortId: cohort },
      include: { cohort: true },
      orderBy: { currentLevel: 'desc' }, // Sort by level descending
    });

    // ✅ 2. Respond
    res.json({
      cohort: teams[0]?.cohort || null,
      teams: teams.map(team => ({
        id: team.id,
        name: team.name,
        currentLevel: team.currentLevel,
      })),
    });

  } catch (err) {
    console.error('❌ Error in /cohort/:cohortId/teams:', err);
    res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
});

/**
 * @route POST /api/qr/scan/:cohort/:level
 * @body { teamId: string }
 * Description:
 *  - Verify if team belongs to cohort
 *  - Check if correct level (no skipping)
 *  - Mark level completed and update team
 */
router.post('/scan/:cohort/:level', async (req, res) => {
  try {
    const { teamId } = req.body;
    let { cohort, level } = req.params;

    // ✅ Validate inputs
    if (!teamId)
      return res.status(400).json({ error: 'teamId is required in the request body' });

    cohort = parseInt(cohort);
    level = parseInt(level);

    // ✅ 1. Fetch the team
    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ error: 'Team not found' });

    // ✅ 2. Check if team belongs to this cohort
    if (team.cohortId !== cohort)
      return res.status(403).json({ error: 'This QR code does not belong to your cohort' });

    // ✅ 3. Fetch QRCode data for verification (based on cohort + level)
    const qr = await prisma.qRCode.findFirst({
      where: {
        cohortId: cohort,
        level: level,
      },
    });

    if (!qr)
      return res.status(404).json({ error: 'Invalid QR or level not registered' });

    // ✅ 4. Check if level already completed
    const completed = await Level.isCompleted(team.id, qr.level);
    if (completed)
      return res.status(400).json({ error: 'Level already completed' });

    // ✅ 5. Enforce level progression
    if (qr.level !== team.currentLevel + 1)
      return res.status(400).json({
        error: `You must complete level ${team.currentLevel + 1} next`,
      });

    // ✅ 6. Mark level completed and update team
    await Level.markCompleted(team.id, qr.level);
    await Team.updateCurrentLevel(team.id, qr.level);

    // ✅ 7. Respond
    res.json({
      message: `🎉 Level ${qr.level} completed successfully for Cohort ${team.cohort.name}!`,
      currentLevel: qr.level,
      flag: qr.flag,
    });

  } catch (err) {
    console.error('❌ Error in /scan:', err);
    res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
});

export default router;
