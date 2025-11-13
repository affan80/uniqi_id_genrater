import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const Team = {
  /**
   * Find a team by its string ID (Team UID from CSV)
   * @param {string} id - The team UID
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error("Invalid or missing team ID");
    }

    const cleanId = id.trim();

    try {
      const team = await prisma.team.findUnique({
        where: { id: cleanId },
        include: { cohort: true }, // auto-load cohort details
      });

      if (!team) {
        console.warn(`⚠️ No team found with id: ${cleanId}`);
        return null;
      }

      return team;
    } catch (error) {
      console.error("❌ Error fetching team by ID:", error);
      throw new Error("Database error while fetching team");
    }
  },

  /**
   * Update the team's current level
   * @param {string} id - The team UID
   * @param {number} level - The new level value
   * @returns {Promise<object>}
   */
  async updateCurrentLevel(id, level) {
    if (!id || typeof id !== 'string') {
      throw new Error("Invalid or missing team ID");
    }
    if (typeof level !== 'number' || Number.isNaN(level)) {
      throw new Error("Level must be a valid number");
    }

    const cleanId = id.trim();

    try {
      const updatedTeam = await prisma.team.update({
        where: { id: cleanId },
        data: { currentLevel: level },
      });

      console.log(`✅ Updated team ${cleanId} to level ${level}`);
      return updatedTeam;
    } catch (error) {
      console.error("❌ Error updating team level:", error);
      throw new Error("Database error while updating team level");
    }
  },
};

export default Team;
