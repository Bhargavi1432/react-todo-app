const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bhagi@159/",
  database: "todo_app"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:");
    console.error(err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (result.length > 0) {
        res.json({ success: true, user: result[0] });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// ➕ ADD TASK
app.post("/tasks", (req, res) => {
  const { user_id, title, category, priority, due_date } = req.body;

  db.query(
    "INSERT INTO tasks (user_id, title, category, priority, due_date) VALUES (?, ?, ?, ?, ?)",
    [user_id, title, category, priority, due_date],
    () => res.send("Task Added")
  );
});

// 📥 GET TASKS
app.get("/tasks/:userId", (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id=?",
    [req.params.userId],
    (err, result) => res.json(result)
  );
});

// ✏️ UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const { title, priority, due_date } = req.body;

  db.query(
    "UPDATE tasks SET title=?, priority=?, due_date=? WHERE id=?",
    [title, priority, due_date, req.params.id],
    () => res.send("Updated")
  );
});

// ❌ DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  db.query("DELETE FROM tasks WHERE id=?", [req.params.id], () =>
    res.send("Deleted")
  );
});

app.listen(5000, () => console.log("Server running"));
