import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const Level = {
  /**
   * Check if a level is completed by the team.
   * @param {string} teamId
   * @param {number} level
   * @returns {Promise<boolean>}
   */
  async isCompleted(teamId, level) {
    try {
      if (!teamId) throw new Error("Missing team ID");
      if (typeof level !== 'number' || isNaN(level)) throw new Error("Invalid level number");

      const team = await prisma.team.findUnique({
        where: { id: teamId.trim() },
        select: { currentLevel: true },
      });

      if (!team) throw new Error("Team not found");

      // A team has completed a level if their currentLevel >= that level
      return team.currentLevel >= level;
    } catch (error) {
      console.error("❌ Error checking if level is completed:", error);
      throw new Error("Database error while checking level completion");
    }
  },

  /**
   * Mark a level as completed (must be next in sequence).
   * @param {string} teamId
   * @param {number} level
   * @returns {Promise<object>} Updated team data
   */
  async markCompleted(teamId, level) {
    try {
      if (!teamId) throw new Error("Missing team ID");
      if (typeof level !== 'number' || isNaN(level)) throw new Error("Invalid level number");

      const team = await prisma.team.findUnique({
        where: { id: teamId.trim() },
        select: { currentLevel: true },
      });

      if (!team) throw new Error("Team not found");

      // Sequential rule: can only complete the next level
      if (level === team.currentLevel + 1) {
        return await prisma.team.update({
          where: { id: teamId.trim() },
          data: { currentLevel: level },
        });
      } else if (level <= team.currentLevel) {
        // Already done or lower level (no change needed)
        return team;
      } else {
        throw new Error(`Cannot skip levels. Complete Level ${team.currentLevel + 1} first.`);
      }
    } catch (error) {
      console.error("❌ Error marking level as completed:", error);
      throw new Error(error.message || "Database error while marking level as completed");
    }
  },
};

export default Level;
