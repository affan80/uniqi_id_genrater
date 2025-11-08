import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const Team = {
  async findById(id) {
    try {
      const team = await prisma.team.findUnique({
        where: { id },
        include: { cohort: true }
      });

      if (!team) {
        console.warn(`No team found with id: ${id}`);
        return null; // You can also throw an error if you prefer
      }

      return team;
    } catch (error) {
      console.error("Error fetching team by ID:", error.message);
      throw new Error("Database error while fetching team");
    }
  },

  async updateCurrentLevel(id, level) {
    try {
      const updatedTeam = await prisma.team.update({
        where: { id },
        data: { currentLevel: level }
      });

      return updatedTeam;
    } catch (error) {
      console.error("Error updating team level:", error.message);
      throw new Error("Database error while updating team level");
    }
  }
};
export default Team;