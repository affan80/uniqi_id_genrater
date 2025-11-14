import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import { Team } from "./models/Team.js";
import { Cohort } from "./models/Cohort.js";
import { QRCode } from "./models/QRCode.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Starting MongoDB Seeder...\n");
  await connectDB();

  /* ================================================
     1️⃣ LOAD & SEED TEAMS + COHORTS
     ================================================ */

  const teamCsv = fs.readFileSync(path.join(__dirname, "teams.csv"), "utf8");
  const teamRows = Papa.parse(teamCsv, {
    header: true,
    skipEmptyLines: true,
  }).data;

  console.log(`📌 Found ${teamRows.length} teams in CSV`);

  // Map numeric cohort -> MongoDB ObjectId
  const cohortMap = {};

  for (const row of teamRows) {
    const teamUID = row["Team UID"]?.trim();
    const teamName = row["Team Name"]?.trim();

    // Handle Cohort OR Cohort(space)
    const cohortNum = (row["Cohort"] || row["Cohort "] || "").trim();

    const level = parseInt(row["Level"]) || 0;

    if (!teamUID || !cohortNum) {
      console.log("⚠️ Skipping invalid team row:", row);
      continue;
    }

    const cohortName = `Cohort ${cohortNum}`;

    // Create/find cohort
    let cohort = await Cohort.findOne({ name: cohortName });
    if (!cohort) {
      cohort = await Cohort.create({ name: cohortName });
      console.log(`🆕 Created cohort ${cohortName}`);
    }

    cohortMap[cohortNum] = cohort._id;

    // Avoid duplicates
    const exists = await Team.findOne({ id: teamUID });
    if (exists) continue;

    await Team.create({
      id: teamUID,
      name: teamName || "",
      currentLevel: level,
      cohortId: cohort._id,
    });

    console.log(`✅ Added team: ${teamUID} (${teamName}) → ${cohortName}`);
  }

  /* ================================================
     2️⃣ SEED QR CODES
     ================================================ */

  console.log("\n🚀 Seeding QR Codes...");

  const qrCsv = fs.readFileSync(path.join(__dirname, "QRCode_Seed.csv"), "utf8");
  const qrRows = Papa.parse(qrCsv, {
    header: true,
    skipEmptyLines: true,
  }).data;

  console.log(`📌 Found ${qrRows.length} QR rows`);

  for (const row of qrRows) {
    const cohortIdNum = (row["cohortId"] || row["cohortId "] || "").trim();
    const level = parseInt(row["level"]);
    const flag = row["flag"]?.trim();
    const limit = parseInt(row["limit"]);

    const cohortObjectId = cohortMap[cohortIdNum];

    if (!cohortObjectId) {
      console.log(`❌ No cohort found for numeric ID: ${cohortIdNum}`);
      continue;
    }

    const exists = await QRCode.findOne({ flag });
    if (exists) continue;

    await QRCode.create({
      flag,
      level,
      limit,
      currentTeams: 0,
      cohortId: cohortObjectId,
    });

    console.log(`🎯 Added QR: ${flag} (Level ${level}, Cohort ${cohortIdNum})`);
  }

  console.log("\n🎉 SEEDING COMPLETE!\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
