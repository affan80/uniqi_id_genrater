import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const Level = {
  async isCompleted(teamId, level) {
    try {
      const record = await prisma.completedLevel.findFirst({
        where: { teamId, level },
      });

      return !!record; // Converts to true/false
    } catch (error) {
      console.error("❌ Error checking if level is completed:", error.message);
      throw new Error("Database error while checking level completion");
    }
  },

  async markCompleted(teamId, level) {
    try {
      const completedLevel = await prisma.completedLevel.create({
        data: { teamId, level },
      });

      return completedLevel;
    } catch (error) {
      console.error("❌ Error marking level as completed:", error.message);
      throw new Error("Database error while marking level as completed");
    }
  },
};
export default Level;