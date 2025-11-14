import { Team } from "../models/Team.js";
import { connectDB } from "../db.js";
connectDB();


export const TeamService = {
async findById(id) {
if (!id) throw new Error("Missing team ID");
return Team.findOne({ id: id.trim() }).populate("cohortId");
},


async updateCurrentLevel(id, level) {
if (!id) throw new Error("Missing team ID");
if (typeof level !== "number") throw new Error("Level must be a number");


return Team.findOneAndUpdate(
{ id: id.trim() },
{ currentLevel: level },
{ new: true }
);
}
};