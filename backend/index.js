const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bhagi@159/", // replace with your password
  database: "todo_app"
});

db.connect((err) => {
  if (err) console.error("❌ DB Connection Error:", err);
  else console.log("✅ MySQL Connected");
});

// ================= AUTH ================= //

// LOGIN
app.post("/login", (req, res) => {
  const { userid, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE userid=? AND password=?",
    [userid, password],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        res.json({ success: true, user: result[0] });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// REGISTER
app.post("/register", (req, res) => {
  const { username, firstname, lastname, email, userid, password } = req.body;

  db.query(
    "INSERT INTO users (username, firstname, lastname, email, userid, password) VALUES (?, ?, ?, ?, ?, ?)",
    [username, firstname, lastname, email, userid, password],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ message: "User registered ✅" });
    }
  );
});

// ================= TASKS ================= //

// ➕ ADD TASK (due_date stored as epoch BIGINT)
app.post("/tasks", (req, res) => {
  const { user_id, title, category, priority, due_date } = req.body;

  if (!user_id || !title || !due_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    `INSERT INTO tasks 
    (user_id, title, category, priority, due_date, status, is_deleted, created_at)
    VALUES (?, ?, ?, ?, ?, 'pending', 0, ?)`,
    [user_id, title, category, priority, due_date, Date.now()],
    (err) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ error: err.sqlMessage });
      }
      res.json({ success: true });
    }
  );
});

// 📥 GET TASKS
app.get("/tasks/:userId", (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id=? AND is_deleted=0",
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

// 🔄 UPDATE TASK (flexible route)
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status, title, category, priority, due_date, is_deleted } = req.body;

  let fields = [];
  let values = [];

  if (status !== undefined) {
    // ✅ Only allow valid ENUM values
    if (!["pending", "completed", "not_completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    fields.push("status=?");
    values.push(status);
  }
  if (title !== undefined) {
    fields.push("title=?");
    values.push(title);
  }
  if (category !== undefined) {
    fields.push("category=?");
    values.push(category);
  }
  if (priority !== undefined) {
    fields.push("priority=?");
    values.push(priority);
  }
  if (due_date !== undefined) {
    fields.push("due_date=?");
    values.push(due_date);
  }
  if (is_deleted !== undefined) {
    fields.push("is_deleted=?");
    values.push(is_deleted);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id=?`;
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json({ success: true });
  });
});

// ================= SERVER ================= //
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
