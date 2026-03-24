const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) return res.send(err);
      res.send("User registered");
    }
  );
};

const loginUser = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) return res.send(err);
      if (result.length === 0) return res.send("User not found");

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.send("Wrong password");

      const token = jwt.sign({ id: user.id }, "secret");

      res.json({ token, userId: user.id });
    }
  );
};

module.exports = { registerUser, loginUser };