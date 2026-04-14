import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [newTask, setNewTask] = useState({
    title: "",
    category: "personal",
    priority: "low",
    due_date: ""
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({
    title: "",
    category: "",
    priority: "",
    due_date: ""
  });

  // Fetch tasks
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

  // Add new task
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

  // Update task
  const updateTask = async (id, updates) => {
    try {
      await API.put(`/tasks/${id}`, updates);
      getTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task.");
    }
  };

  // Filtering
  let filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.category === filter);

  // Searching
  filteredTasks = filteredTasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  if (sortBy === "due_date") {
    filteredTasks = [...filteredTasks].sort((a, b) => a.due_date - b.due_date);
  } else if (sortBy === "priority") {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    filteredTasks = [...filteredTasks].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  } else if (sortBy === "status") {
    filteredTasks = [...filteredTasks].sort((a, b) => (a.status > b.status ? 1 : -1));
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      {user && (
        <h2 className="welcome-name">
          👋 Welcome, <span>{user.username}</span>
        </h2>
      )}

      {/* Filters */}
      <div className="filters">
        {["all", "personal", "work", "study"].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

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

      {/* Search + Sort Controls */}
      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="none">Sort by</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map((task) => {
          const isOverdue = task.due_date && new Date(task.due_date) < new Date();
          return (
            <div
              key={task.id}
              className={`task-card ${
                task.status === "completed"
                  ? "completed"
                  : task.status === "not_completed"
                  ? "not-completed"
                  : ""
              }`}
            >
              {editingTaskId === task.id ? (
                <>
                  <input
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  />
                  <select
                    value={editTask.category}
                    onChange={(e) => setEditTask({ ...editTask, category: e.target.value })}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                  </select>
                  <select
                    value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input
                    type="date"
                    value={
                      editTask.due_date
                        ? new Date(editTask.due_date).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
                  />
                  <button
                    onClick={() => {
                      const dueDateEpoch = editTask.due_date
                        ? new Date(editTask.due_date).getTime()
                        : null;
                      updateTask(task.id, { ...editTask, due_date: dueDateEpoch });
                      setEditingTaskId(null);
                    }}
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingTaskId(null)}>✖ Cancel</button>
                </>
              ) : (
                <div className="task-content">
                  <div className="task-info">
                    <b>{task.title}</b> ({task.category}) - {task.priority}
                  </div>
                  <div className={`task-due-date ${isOverdue ? "overdue" : ""}`}>
                    Due:{" "}
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "No due date"}
                  </div>
                </div>
              )}

              <div className="task-actions">
                <button
                  className="complete"
                  onClick={() => updateTask(task.id, { status: "completed" })}
                >
                  Complete
                </button>
                <button
                  className="not-complete"
                  onClick={() => updateTask(task.id, { status: "not_completed" })}
                >
                  Not Complete
                </button>
                <button
                  className="delete"
                  onClick={() => updateTask(task.id, { is_deleted: 1 })}
                >
                  Delete
                </button>
                <button
                  className="edit"
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditTask({
                      title: task.title,
                      category: task.category,
                      priority: task.priority,
                      due_date: task.due_date
                    });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
