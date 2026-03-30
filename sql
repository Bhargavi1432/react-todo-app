-- 🔹 Create Database
CREATE DATABASE todo_app;

-- 🔹 Use Database
USE todo_app;


-- ================= USERS TABLE =================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  userid INT NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- ================= TASKS TABLE =================

CREATE TABLE tasks (
  user_id INT NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,   -- personal / work / study
  priority VARCHAR(50) NOT NULL,   -- low / medium / high
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',   -- pending / completed / not_completed
  is_deleted TINYINT(1) DEFAULT 0,        -- 0 = visible, 1 = deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ================= SAMPLE DATA (OPTIONAL) =================

-- Add a test user
INSERT INTO users (username, password)
VALUES ('testuser', '1234');

-- Add sample tasks
INSERT INTO tasks (user_id, title, category, priority, due_date)
VALUES
(1, 'Study React', 'study', 'high', '2026-04-01'),
(1, 'Gym Workout', 'personal', 'medium', '2026-04-02'),
(1, 'Project Meeting', 'work', 'high', '2026-04-03');

updated task table

CREATE TABLE tasks (
    ->   id INT AUTO_INCREMENT PRIMARY KEY,       -- unique task id
    ->   user_id INT NOT NULL,                    -- foreign key to users.id
    ->
    ->   title VARCHAR(255) NOT NULL,             -- task title
    ->   category ENUM('personal', 'work', 'study') NOT NULL,
    ->   priority ENUM('low', 'medium', 'high') NOT NULL,
    ->
    ->   status ENUM('pending', 'completed', 'not_completed') DEFAULT 'pending',
    ->   is_deleted TINYINT(1) DEFAULT 0,
    ->
    ->   created_at BIGINT NOT NULL,              -- epoch timestamp
    ->   updated_at BIGINT DEFAULT NULL,          -- epoch timestamp
    ->   due_date BIGINT DEFAULT NULL,            -- epoch timestamp
    ->
    ->   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    -> );
