// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require('dotenv').config();
const app = express();  // eta bad e localhost e sundor vabe run hoi --------------------<

// ✅ Static files (frontend)
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

// ✅ Database connection (dual-ready: local defaults + env vars for Railway)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "1234",
  database: process.env.MYSQLDATABASE || "notebook",
  port: process.env.MYSQLPORT || 3306,
});

// ✅ Test DB connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected!");
  }
});

// ✅ Add a new note
app.post("/notes", (req, res) => {
  const { note } = req.body;

  if (!note || note.trim() === "") {
    return res.status(400).json({ error: "Note cannot be empty" });
  }

  db.query("INSERT INTO notes (note) VALUES (?)", [note], (err, result) => {
    if (err) {
      console.error("❌ Failed to insert note:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.json({ message: "Note added!", id: result.insertId });
  });
});

// ✅ Get all notes
app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes", (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch notes:", err);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.json(results);
  });
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Dynamic port for Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
