CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(50)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  category VARCHAR(50),
  priority VARCHAR(10),
  due_date DATE
);



//index.js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bhagi@159",
  database: "todo_app"
});

// ✅ ADD THIS BLOCK
db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:");
    console.error(err);
  } else {
    console.log("✅ MySQL Connected");
  }
});