import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const prisma = new PrismaClient();

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Starting full seed for HACK THE HUNT...\n');

  /** ============================
   * 🧩 1. SEED TEAMS & COHORTS
   * ============================ */
  const teamCsvPath = path.join(__dirname, '..', 'teams.csv');
  const teamCsvFile = fs.readFileSync(teamCsvPath, 'utf8');

  const teamParsed = Papa.parse(teamCsvFile, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const teamRows = teamParsed.data;
  console.log(`📊 Found ${teamRows.length} teams in CSV\n`);

  let successTeams = 0, skipTeams = 0, errorTeams = 0;

  for (const row of teamRows) {
    try {
      const teamUID = row['Team UID']?.trim();
      const teamName = row['Team Name']?.trim();
      const cohortNum = row['Cohort']?.trim();
      const level = parseInt(row['Level']) || 0;

      if (!teamUID || !teamName || !cohortNum) {
        console.log(`⚠ Skipping invalid row: ${JSON.stringify(row)}`);
        skipTeams++;
        continue;
      }

      const cohortName = `Cohort ${cohortNum}`;

      // Skip if team already exists
      const existing = await prisma.team.findUnique({ where: { id: teamUID } });
      if (existing) {
        console.log(`⚠ Team "${teamName}" already exists, skipping...`);
        skipTeams++;
        continue;
      }

      await prisma.team.create({
        data: {
          id: teamUID,
          name: teamName,
          currentLevel: level,
          cohort: {
            connectOrCreate: {
              where: { name: cohortName },
              create: { name: cohortName },
            },
          },
        },
      });

      console.log(`✅ ${teamUID} | ${teamName} → ${cohortName}`);
      successTeams++;
    } catch (err) {
      console.error(`✗ Error creating team: ${err.message}`);
      errorTeams++;
    }
  }

  /** ============================
   * 🧠 2. SEED QR CODES
   * ============================ */
  console.log('\n🚀 Seeding QR Codes...\n');

  const qrCsvPath = path.join(__dirname, '..', 'QRCode_Seed.csv');
  const qrCsvFile = fs.readFileSync(qrCsvPath, 'utf8');

  const qrParsed = Papa.parse(qrCsvFile, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const qrRows = qrParsed.data;
  console.log(`📋 Found ${qrRows.length} QR codes in CSV\n`);

  let successQR = 0, skipQR = 0, errorQR = 0;

  for (const row of qrRows) {
    try {
      const cohortId = parseInt(row['cohortId']);
      const level = parseInt(row['level']);
      const flag = row['flag']?.trim();

      if (!cohortId || !level || !flag) {
        console.log(`⚠ Skipping invalid QR row: ${JSON.stringify(row)}`);
        skipQR++;
        continue;
      }

      // Skip if flag already exists
      const existingFlag = await prisma.qRCode.findUnique({ where: { flag } });
      if (existingFlag) {
        console.log(`⚠ QR flag already exists: ${flag}`);
        skipQR++;
        continue;
      }

      await prisma.qRCode.create({
        data: {
          flag,
          level,
          cohort: {
            connect: { id: cohortId },
          },
        },
      });

      console.log(`✅ Level ${level} | Cohort ${cohortId} | ${flag}`);
      successQR++;
    } catch (err) {
      console.error(`✗ Error creating QRCode: ${err.message}`);
      errorQR++;
    }
  }

  /** ============================
   * ✅ Summary
   * ============================ */
  console.log('\n' + '='.repeat(60));
  console.log('✅ SEEDING COMPLETED!');
  console.log(`📈 Teams Created: ${successTeams}`);
  console.log(`⚠️ Teams Skipped: ${skipTeams}`);
  console.log(`❌ Team Errors: ${errorTeams}`);
  console.log(`\n🏁 QR Codes Created: ${successQR}`);
  console.log(`⚠️ QR Codes Skipped: ${skipQR}`);
  console.log(`❌ QR Code Errors: ${errorQR}`);
  console.log('='.repeat(60));

  const totalCohorts = await prisma.cohort.count();
  const totalTeams = await prisma.team.count();
  const totalQRCodes = await prisma.qRCode.count();

  console.log(`\n📊 DB Summary → Cohorts: ${totalCohorts}, Teams: ${totalTeams}, QR Codes: ${totalQRCodes}\n`);
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
