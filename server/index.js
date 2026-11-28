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
    attendeeCount: Number(row.attendee_count ?? 0),
    isJoined: row.is_joined ?? false,
  };
};

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "fyre" });
});

app.get("/runs", async (req, res) => {
  try {
    const userId = "user-1"; //Temporary for Development
    const result = await pool.query(
      `SELECT
    run_events.*,
    COUNT(run_attendees.user_id) AS attendee_count,
    EXISTS (
        SELECT 1
        FROM run_attendees
        WHERE run_attendees.run_event_id = run_events.id
        AND run_attendees.user_id = $1
    ) AS is_joined
FROM run_events
LEFT JOIN run_attendees
    ON run_events.id = run_attendees.run_event_id
GROUP BY
    run_events.id;
`,
      [userId],
    );
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

app.post("/runs/:runId/join", async (req, res) => {
  try {
    const userId = "user-1"; //Temporary for development
    const runId = req.params.runId;
    await pool.query(
      "INSERT INTO run_attendees (user_id, run_event_id) VALUES ($1, $2);",
      [userId, runId],
    );

    res.status(201).json({
      message: "Successfully joined run",
    });
  } catch (error) {
    console.error("Error joining User to Run Event", error);
    if (error.code === "23503") {
      return res.status(404).json({
        error: "Run event does not exist",
      });
    }
    if (error.code === "23505") {
      return res.status(409).json({
        error: "User has already joined this run",
      });
    }
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/runs/:runId/join", async (req, res) => {
  try {
    const userId = "user-1"; //Temporary for development
    const runId = req.params.runId;
    const result = await pool.query(
      "DELETE FROM run_attendees WHERE user_id = $1 AND run_event_id = $2;",
      [userId, runId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "You are not attending this run",
      });
    }
    res.status(200).json({ message: "Successfully left run" });
  } catch (error) {
    console.error("Error leaving run", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
