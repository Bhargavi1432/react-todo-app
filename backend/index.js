const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "todo_app"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
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
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ message: "User registered ✅" });
    }
  );
});

// ➕ ADD TASK
app.post("/tasks", (req, res) => {
  const { user_id, title, category, priority, due_date } = req.body;
  const uid = Number(user_id);

  if (!uid || !title || !category || !priority || !due_date) {
    return res.status(400).send("All fields are required");
  }

  db.query(
    "INSERT INTO tasks (user_id, title, category, priority, due_date) VALUES (?, ?, ?, ?, ?)",
    [uid, title, category, priority, due_date],
    (err) => {
      if (err) {
        console.error("Error adding task:", err);
        return res.status(500).send(err);
      }

      res.send("Task Added");
    }
  );
});

// 📥 GET TASKS
app.get("/tasks/:userId", (req, res) => {
  console.log("GET /tasks called with userId:", req.params.userId);
  const userId = Number(req.params.userId);

  if (!userId) {
    console.log("Invalid userId:", req.params.userId);
    return res.status(400).send("Invalid userId");
  }

  db.query(
    "SELECT * FROM tasks WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("MySQL Error fetching tasks:", err);
        return res.status(500).send(err);
      }

      console.log("Tasks fetched:", result);
      res.json(result);
    }
  );
});

// ✏️ UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const { title, priority, due_date } = req.body;
  const taskId = Number(req.params.id);

  if (!taskId || !title || !priority || !due_date) {
    return res.status(400).send("All fields are required: title, priority, due_date");
  }

  db.query(
    "UPDATE tasks SET title=?, priority=?, due_date=? WHERE id=?",
    [title, priority, due_date, taskId],
    (err, result) => {
      if (err) {
        console.error("MySQL Error updating task:", err);
        return res.status(500).send(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Task not found");
      }

      console.log(`Task ${taskId} updated successfully`);
      res.send("Updated");
    }
  );
});

// ❌ DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!taskId) return res.status(400).send("Invalid task ID");

  db.query(
    "DELETE FROM tasks WHERE id=?",
    [taskId],
    (err, result) => {
      if (err) {
        console.error("MySQL Error deleting task:", err);
        return res.status(500).send(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Task not found");
      }

      console.log(`Task ${taskId} deleted successfully`);
      res.send("Deleted");
    }
  );
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));