import mongoose from "mongoose";


const TeamSchema = new mongoose.Schema({
id: { type: String, unique: true },
name: String,
currentLevel: { type: Number, default: 0 },
cohortId: { type: mongoose.Schema.Types.ObjectId, ref: "Cohort" },
});


export const Team = mongoose.model("Team", TeamSchema);