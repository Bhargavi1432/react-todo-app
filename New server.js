const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct paths
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});