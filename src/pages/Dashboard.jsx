import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // ✅ New states for tick & cross
  const [completedTasks, setCompletedTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const [newTask, setNewTask] = useState({
    title: "",
    category: "personal",
    priority: "low",
    due_date: ""
  });

  // 🔹 Fetch tasks
  const getTasks = async () => {
    try {
      const res = await API.get(`/tasks/${user.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // 🔹 Add task
  const addTask = async () => {
    try {
      await API.post("/tasks", {
        ...newTask,
        user_id: user.id
      });

      getTasks(); // refresh tasks
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Filter logic
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.category === filter);

  return (
    <div>
      {/* ✅ Navbar */}
      <Navbar setFilter={setFilter} />

      <div style={{ padding: "20px" }}>
        {/* ❌ Removed Dashboard Title */}

        {/* ➕ Add Task Section */}
        <input
          placeholder="Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setNewTask({ ...newTask, category: e.target.value })
          }
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
        </select>

        <select
          onChange={(e) =>
            setNewTask({ ...newTask, priority: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          onChange={(e) =>
            setNewTask({ ...newTask, due_date: e.target.value })
          }
        />

        <button onClick={addTask}>Add Task</button>

        <hr />

        {/* 📋 Task List */}
        {filteredTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          const isDeleted = deletedTasks.includes(task.id);

          return (
            <div
              key={task.id}
              style={{
                margin: "10px 0",
                textDecoration: isDeleted ? "line-through" : "none",
                opacity: isDeleted ? 0.5 : 1
              }}
            >
              <b>{task.title}</b> ({task.category}) - {task.priority}
              <br />
              Due: {task.due_date}

              {/* ✅ Completed Label */}
              {isCompleted && (
                <span style={{ color: "green", marginLeft: "10px" }}>
                  ✅ Completed
                </span>
              )}

              <br />

              {/* ✔ Tick Button */}
              <button
                onClick={() =>
                  setCompletedTasks([...completedTasks, task.id])
                }
              >
                ✔
              </button>

              {/* ❌ Cross Button */}
              <button
                onClick={() =>
                  setDeletedTasks([...deletedTasks, task.id])
                }
              >
                ❌
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}