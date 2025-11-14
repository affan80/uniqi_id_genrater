import mongoose from "mongoose";


const QRCodeSchema = new mongoose.Schema({
level: Number,
cohortId: { type: mongoose.Schema.Types.ObjectId, ref: "Cohort" },
flag: { type: String, unique: true },
limit: { type: Number, default: 50 },
currentTeams: { type: Number, default: 0 },
token: { type: String }, // SIGNED QR TOKEN
});


export const QRCode = mongoose.model("QRCode", QRCodeSchema);