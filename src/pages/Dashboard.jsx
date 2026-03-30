import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./dashboard.css";

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

  const getTasks = async () => {
    if (!user) return;
    try {
      const res = await API.get(`/tasks/${user.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      alert("Failed to load tasks.");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.title || !newTask.due_date) {
      alert("Please fill Title and Due Date");
      return;
    }
    const dueDateEpoch = new Date(newTask.due_date).getTime();
    try {
      await API.post("/tasks", { 
        ...newTask, 
        due_date: dueDateEpoch, 
        user_id: user.id 
      });
      setNewTask({ title: "", category: "personal", priority: "low", due_date: "" });
      getTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  const updateTask = async (id, updates) => {
    try {
      await API.put(`/tasks/${id}`, updates);
      getTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task.");
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div className="dashboard-container">
      <Navbar setFilter={setFilter} />

      {/* Add Task */}
      <div className="task-input">
        <input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />

        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
        </select>

        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      <hr />

      {/* Display Tasks */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.status === "completed" ? "completed" : task.status === "not_completed" ? "not-completed" : ""}`}
          >
            <b>{task.title}</b> ({task.category}) - {task.priority} <br />
            Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"} <br />

            <div className="task-actions">
              <button className="complete" onClick={() => updateTask(task.id, { status: "completed" })}>✔ Complete</button>
              <button className="not-complete" onClick={() => updateTask(task.id, { status: "not_completed" })}>❌ Not Complete</button>
              <button className="delete" onClick={() => updateTask(task.id, { is_deleted: 1 })}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

            {/* Buttons */}
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => updateTask(task.id, { status: "completed" })}>✔</button>
              <button onClick={() => updateTask(task.id, { status: "not_completed" })}>❌</button>
              <button onClick={() => updateTask(task.id, { is_deleted: 1 })}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
