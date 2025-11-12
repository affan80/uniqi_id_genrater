import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const Level = {
  /**
   * Check if a level is completed by the team.
   */
  async isCompleted(teamId, level) {
    try {
      if (!teamId) throw new Error("Missing team ID");
      if (typeof level !== "number" || isNaN(level)) throw new Error("Invalid level number");

      const team = await prisma.team.findUnique({
        where: { id: teamId.trim() },
        select: { currentLevel: true },
      });

      if (!team) throw new Error("Team not found");

      return team.currentLevel >= level;
    } catch (error) {
      console.error("❌ Error checking if level is completed:", error);
      throw new Error("Database error while checking level completion");
    }
  },

  /**
   * Mark a level as completed (must be next in sequence)
   * and enforce QR scan limit.
   */
  async markCompleted(teamId, level) {
    try {
      if (!teamId) throw new Error("Missing team ID");
      if (typeof level !== "number" || isNaN(level)) throw new Error("Invalid level number");

      const team = await prisma.team.findUnique({
        where: { id: teamId.trim() },
        select: { currentLevel: true, cohortId: true },
      });

      if (!team) throw new Error("Team not found");

      // 🔍 Find the corresponding QR code for this cohort + level
      const qr = await prisma.qRCode.findFirst({
        where: { level, cohortId: team.cohortId },
      });

      if (!qr) throw new Error("QR code not found for this level and cohort");

      // 🧮 Check limit
      if (qr.currentTeams >= qr.limit) {
        throw new Error("You're late! This QR is no longer active.");
      }

      // ✅ Sequential rule: must complete levels in order
      if (level === team.currentLevel + 1) {
        // Update both Team and QRCode in a transaction
        const [updatedTeam, updatedQr] = await prisma.$transaction([
          prisma.team.update({
            where: { id: teamId.trim() },
            data: { currentLevel: level },
          }),
          prisma.qRCode.update({
            where: { id: qr.id },
            data: { currentTeams: { increment: 1 } },
          }),
        ]);

        console.log(
          `✅ Team ${teamId} completed Level ${level} (Cohort ${team.cohortId}). Total scans: ${updatedQr.currentTeams}/${updatedQr.limit}`
        );

        return updatedTeam;
      } else if (level <= team.currentLevel) {
        // Already done
        return team;
      } else {
        throw new Error(`Cannot skip levels. Complete Level ${team.currentLevel + 1} first.`);
      }
    } catch (error) {
      console.error("❌ Error marking level as completed:", error.message);
      throw new Error(error.message || "Database error while marking level as completed");
    }
  },
};

export default Level;
