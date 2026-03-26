import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  const [newTask, setNewTask] = useState({
    title: "",
    category: "personal",
    priority: "low",
    due_date: ""
  });

  // 🔹 Fetch tasks
  const getTasks = async () => {
    const res = await API.get(`/tasks/${user.id}`);
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ➕ Add task
  const addTask = async () => {
    await API.post("/tasks", {
      ...newTask,
      user_id: user.id
    });

    getTasks();
  };

  // ✔ Complete
  const markCompleted = async (id) => {
    await API.put(`/tasks/status/${id}`);
    getTasks();
  };

  // ❌ Cross
  const crossTask = async (id) => {
    await API.put(`/tasks/cross/${id}`);
    getTasks();
  };

  // 🗑 Delete
  const deleteTask = async (id) => {
    await API.put(`/tasks/delete/${id}`);
    getTasks();
  };

  // 🔹 Filter
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.category === filter);

  return (
    <div>
      <Navbar setFilter={setFilter} />

      <div style={{ padding: "20px" }}>
        {/* Add Task */}
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

        {/* Tasks */}
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              margin: "10px 0",
              textDecoration:
                task.status === "not_completed"
                  ? "line-through"
                  : "none"
            }}
          >
            <b>{task.title}</b> ({task.category}) - {task.priority}
            <br />
            Due: {task.due_date}

            {/* Status Labels */}
            {task.status === "completed" && (
              <span style={{ color: "green", marginLeft: "10px" }}>
                ✅ Completed
              </span>
            )}

            {task.status === "not_completed" && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                ❌ Not Completed
              </span>
            )}

            <br />

            <button onClick={() => markCompleted(task.id)}>✔</button>
            <button onClick={() => crossTask(task.id)}>❌</button>
            <button onClick={() => deleteTask(task.id)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}