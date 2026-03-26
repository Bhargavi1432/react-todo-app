const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MySQL connection
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


// ================= AUTH ================= //

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

// 📝 REGISTER
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


// ================= TASKS ================= //

// ➕ ADD TASK
app.post("/tasks", (req, res) => {
  const { user_id, title, category, priority, due_date } = req.body;

  db.query(
    `INSERT INTO tasks 
    (user_id, title, category, priority, due_date, status, is_deleted) 
    VALUES (?, ?, ?, ?, ?, 'pending', 0)`,
    [user_id, title, category, priority, due_date],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Task Added" });
    }
  );
});

// 📥 GET TASKS (only active tasks)
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

// ✏️ UPDATE TASK DETAILS
app.put("/tasks/:id", (req, res) => {
  const { title, category, priority, due_date } = req.body;

  db.query(
    "UPDATE tasks SET title=?, category=?, priority=?, due_date=? WHERE id=?",
    [
      title || null,
      category || null,
      priority || null,
      due_date || null,
      req.params.id
    ],
    (err) => {
      if (err) {
        console.error("❌ Update Error:", err);
        return res.status(500).send(err);
      }

      res.json({ success: true, message: "Task Updated" });
    }
  );
});

// ✅ UPDATE STATUS (Complete)
app.put("/tasks/status/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Status Updated" });
    }
  );
});

// ❌ SOFT DELETE (Strike task)
app.put("/tasks/delete/:id", (req, res) => {
  db.query(
    "UPDATE tasks SET is_deleted=1, status='deleted' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Task Striked" });
    }
  );
});

// 🗑 PERMANENT DELETE
app.delete("/tasks/permanent/:id", (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Task Deleted Permanently" });
    }
  );
});


// ================= SERVER ================= //

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});