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