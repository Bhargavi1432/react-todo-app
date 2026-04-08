const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DB CONNECTION ================= */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bhagi@159/",
  database: "todo_app"
});

db.connect((err) => {
  if (err) console.error("❌ DB Connection Error:", err);
  else console.log("✅ MySQL Connected");
});

/* ================= MULTER CONFIG ================= */

const upload = multer({ dest: "uploads/" });

/* ================= FILE UPLOAD (ONLY READ) ================= */

app.post("/upload-subscription-file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetName],
    { defval: "" }
  );

  res.json({
    success: true,
    filename: req.file.filename,
    data: sheetData
  });
});

/* ================= SAVE SIM DATA (DUPLICATES IGNORED ✅) ================= */

app.post("/save-sim-data", (req, res) => {
  const rows = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "No data received" });
  }

  const sql = `
    INSERT IGNORE INTO sim_configured_details
    (subscription_id, msisdn, iccid, imsi,
     activation_date, creation_date,
     plan_name, product_type,
     business_unit, status,
     current_epoch)
    VALUES ?
  `;

  const values = rows.map(row => [
    row.subscriptionId,
    row.msisdn,
    row.iccid,
    row.imsi,
    row.activationDate,
    row.creationDate,
    row.planName,
    row.productType,
    row.businessUnit,
    row.status,
    row.currentDate
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ error: err.sqlMessage });
    }

    res.json({
      success: true,
      inserted: result.affectedRows,
      message: "✅ Data saved (duplicates ignored)"
    });
  });
});

/* ================= FETCH SIM DATA ================= */

app.get("/get-sim-data", (req, res) => {
  const sql = `
    SELECT
      id,
      subscription_id AS subscriptionId,
      msisdn,
      iccid,
      imsi,
      activation_date AS activationDate,
      creation_date AS creationDate,
      plan_name AS planName,
      product_type AS productType,
      business_unit AS businessUnit,
      status,
      current_epoch AS currentDate
    FROM sim_configured_details
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

/* ================= AUTH ================= */

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

/* ================= TASKS ================= */

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
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ success: true });
    }
  );
});

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

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status, title, category, priority, due_date, is_deleted } = req.body;

  let fields = [];
  let values = [];

  if (status !== undefined) { fields.push("status=?"); values.push(status); }
  if (title !== undefined) { fields.push("title=?"); values.push(title); }
  if (category !== undefined) { fields.push("category=?"); values.push(category); }
  if (priority !== undefined) { fields.push("priority=?"); values.push(priority); }
  if (due_date !== undefined) { fields.push("due_date=?"); values.push(due_date); }
  if (is_deleted !== undefined) { fields.push("is_deleted=?"); values.push(is_deleted); }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id=?`;
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ success: true });
  });
});

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
