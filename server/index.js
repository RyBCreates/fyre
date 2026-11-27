const express = require("express");
const { Pool } = require("pg");
const { randomUUID } = require("node:crypto");

const app = express();
const PORT = 3001;

const pool = new Pool({
  database: "fyre_dev",
});

app.use(express.json());

const formatRun = (row) => {
  return {
    id: row.id,
    title: row.title,
    startLocation: row.start_location,
    distanceMiles: Number(row.distance_miles),
    difficulty: row.difficulty,
    startsAt: row.starts_at.toISOString(),
  };
};

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "fyre" });
});

app.get("/runs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM run_events");
    const formattedRuns = result.rows.map(formatRun);
    res.json(formattedRuns);
  } catch (error) {
    console.error(
      "There was an error getting the runs from the database",
      error,
    );
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/runs", async (req, res) => {
  try {
    if (req.body == null) {
      return res.status(400).json({
        error: "Missing data in request",
      });
    }
    const newId = randomUUID();
    const { title, startLocation, distanceMiles, difficulty, startsAt } =
      req.body;

    if (typeof title !== "string") {
      return res.status(400).json({
        error: "Title must be a string",
      });
    }
    if (title.trim() === "") {
      return res.status(400).json({
        error: "Title must not be blank",
      });
    }
    if (typeof startLocation !== "string") {
      return res.status(400).json({
        error: "Location must be a string",
      });
    }
    if (startLocation.trim() === "") {
      return res.status(400).json({
        error: "Location must not be blank",
      });
    }
    if (typeof distanceMiles !== "number") {
      return res.status(400).json({
        error: "Distance must be a number",
      });
    }
    if (!Number.isFinite(distanceMiles) || distanceMiles <= 0) {
      return res.status(400).json({
        error: "Distance must be a positive number",
      });
    }
    const allowedDifficulties = ["beginner", "intermediate", "advanced"];
    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: "Difficulty must be 'beginner', 'intermediate', or 'advanced'",
      });
    }
    if (typeof startsAt !== "string") {
      return res.status(400).json({
        error: "Date is not a string",
      });
    }

    const startDate = new Date(startsAt);
    if (!Number.isFinite(startDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format",
      });
    }
    if (startDate.getTime() <= Date.now()) {
      return res.status(400).json({
        error: "Date must be in the future",
      });
    }

    const result = await pool.query(
      "INSERT INTO run_events (id, title, start_location, distance_miles, difficulty, starts_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        newId,
        title.trim(),
        startLocation.trim(),
        distanceMiles,
        difficulty,
        startDate.toISOString(),
      ],
    );
    const savedRow = result.rows[0];
    const createdRun = formatRun(savedRow);
    res.status(201).json(createdRun);
  } catch (error) {
    console.error("Error posting run to Database", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
