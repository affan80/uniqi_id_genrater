import mongoose from "mongoose";
import { Team } from "../models/Team.js";
import { QRCode } from "../models/QRCode.js";
import { connectDB } from "../db.js";

connectDB();

export const Level = {
  async isCompleted(teamId, level) {
    if (!teamId) throw new Error("Missing team ID");
    if (typeof level !== "number") throw new Error("Invalid level number");

    const team = await Team.findOne({ id: teamId.trim() }).select(
      "currentLevel"
    );
    if (!team) throw new Error("Team not found");

    return team.currentLevel >= level;
  },

  async markCompleted(teamId, level) {
    if (!teamId) throw new Error("Missing team ID");
    if (typeof level !== "number") throw new Error("Invalid level number");

    const team = await Team.findOne({ id: teamId.trim() });
    if (!team) throw new Error("Team not found");

    const qr = await QRCode.findOne({ level, cohortId: team.cohortId });
    if (!qr) throw new Error("QR Code not found for this level & cohort");

    if (qr.currentTeams >= qr.limit) {
      throw new Error("You're late! This QR is no longer active.");
    }

    if (level === team.currentLevel + 1) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const updatedTeam = await Team.findOneAndUpdate(
          { id: teamId.trim() },
          { currentLevel: level },
          { new: true, session }
        );

        await QRCode.findByIdAndUpdate(
          qr._id,
          { $inc: { currentTeams: 1 } },
          { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return updatedTeam;
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    }

    if (level <= team.currentLevel) return team;

    throw new Error(
      `Cannot skip levels. Complete Level ${team.currentLevel + 1} first.`
    );
  },
};
