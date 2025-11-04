const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


let entries = []; // team registrations
let quests = {}; // progress tracker:

app.get("/", (req, res) => {
  res.send("Treasure Hunt API is running 🚀");
});

/**
 * DB Schema Idea:
 * entries: [
 *   { uid: 1730712123456, name: "Team Phoenix", cohort: "A" }
 * ]
 * quests: {
 *   "Team Phoenix": 2 // means last completed quest = Quest 2
 * }
 */





// Register team	/api/register	POST	Generates UID and registers team

// Assign cohort	/api/assign-cohort	POST	Admin manually assigns cohort

// Check if team exists	/api/check-team?name=TeamX	GET	Returns { exists: true/false }

// Submit quest	/api/quest	POST	Checks previous quest and marks as completed

// View all teams	/api/entries	GET	Admin listing of all registered teams


app.post("/api/register", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Team name is required" });


  const exists = entries.some(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) return res.status(400).json({ error: "Team already registered" });

  const uid = Date.now(); // Unique ID based on timestamp
  const newEntry = { uid, name, cohort: null };
  entries.push(newEntry);
  quests[name] = 0; // Start from quest 0

  res.status(201).json({ message: "Team registered successfully", newEntry });
});


app.get("/api/entries", (req, res) => {
  res.json(entries);
});


app.post("/api/assign-cohort", (req, res) => {
  const { name, cohort } = req.body;
  if (!name || !cohort)
    return res.status(400).json({ error: "Name and cohort required" });

  const team = entries.find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (!team) return res.status(404).json({ error: "Team not found" });

  team.cohort = cohort;
  res.json({ message: `Cohort ${cohort} assigned to ${name}`, team });
});


app.get("/api/check-team", (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Team name is required" });

  const exists = entries.some(
    (entry) => entry.name.toLowerCase() === name.toLowerCase()
  );
  res.json({ exists });
});


app.post("/api/quest", (req, res) => {
  const { name, questNumber } = req.body;
  if (!name || questNumber === undefined)
    return res.status(400).json({ error: "Name and quest number required" });

  if (!quests[name])
    return res.status(400).json({ error: "Team not registered" });


  if (quests[name] !== questNumber - 1)
    return res.status(403).json({
      error: `You must complete Quest ${quests[name] + 1} first.`,
    });


  quests[name] = questNumber;
  res.json({
    message: `Quest ${questNumber} completed successfully!`,
    nextQuest: questNumber + 1,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
