const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "todo_app"
});

db.connect(err => {
  if (err) return console.error("❌ DB Connection Failed:", err);
  console.log("✅ MySQL Connected");
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.json(result.length > 0 ? { success: true, user: result[0] } : { success: false });
    }
  );
});

// 📝 REGISTER
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    err => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.json({ success: true, message: "User registered ✅" });
    }
  );
});

// ➕ ADD TASK
app.post("/tasks", (req, res) => {
  const { user_id, title, category, priority, due_date } = req.body;
  if (!user_id || !title || !category || !priority || !due_date)
    return res.status(400).json({ success: false, message: "All fields are required" });

  db.query(
    "INSERT INTO tasks (user_id, title, category, priority, due_date) VALUES (?, ?, ?, ?, ?)",
    [Number(user_id), title, category, priority, due_date],
    err => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.json({ success: true, message: "Task added ✅" });
    }
  );
});

// 📥 GET TASKS
app.get("/tasks/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ success: false, message: "Invalid userId" });

  db.query(
    "SELECT * FROM tasks WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.json(result);
    }
  );
});

// ✏️ UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, priority, due_date } = req.body;
  if (!taskId || !title || !priority || !due_date)
    return res.status(400).json({ success: false, message: "All fields required" });

  // Ensure due_date format works for MySQL DATE/DATETIME
  const formattedDueDate = due_date.length === 10 ? due_date + " 00:00:00" : due_date;

  db.query(
    "UPDATE tasks SET title=?, priority=?, due_date=? WHERE id=?",
    [title, priority, formattedDueDate, taskId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Task not found" });
      res.json({ success: true, message: "Task updated ✅" });
    }
  );
});

// ❌ DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!taskId) return res.status(400).json({ success: false, message: "Invalid task ID" });

  db.query("DELETE FROM tasks WHERE id=?", [taskId], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted ✅" });
  });
});

// 🔹 Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));