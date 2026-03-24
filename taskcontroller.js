const db = require("../db");

const addTask = (req, res) => {
  const { user_id, title, category, due_date, priority } = req.body;

  db.query(
    "INSERT INTO tasks (user_id, title, category, due_date, priority) VALUES (?, ?, ?, ?, ?)",
    [user_id, title, category, due_date, priority],
    (err) => {
      if (err) return res.send(err);
      res.send("Task added");
    }
  );
};

const getTasks = (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [req.params.userId],
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
};

const deleteTask = (req, res) => {
  db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Deleted");
  });
};

const updateTask = (req, res) => {
  const { title, category, due_date, priority } = req.body;

  db.query(
    "UPDATE tasks SET title=?, category=?, due_date=?, priority=? WHERE id=?",
    [title, category, due_date, priority, req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Updated");
    }
  );
};

module.exports = { addTask, getTasks, deleteTask, updateTask };