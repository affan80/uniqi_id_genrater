import mongoose from "mongoose";


const CohortSchema = new mongoose.Schema({
name: { type: String, unique: true },
});


export const Cohort = mongoose.model("Cohort", CohortSchema);