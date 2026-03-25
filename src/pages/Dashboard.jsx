import React, { useEffect, useState } from "react";  
import API from "../services/api";  
  
export default function Dashboard() {  
  const [user, setUser] = useState(null);  
  const [tasks, setTasks] = useState([]);  
  const [newTask, setNewTask] = useState({  
    title: "",  
    category: "",  
    priority: "",  
    due_date: ""  
  });  
  const [editTaskId, setEditTaskId] = useState(null);  
  const [editTaskData, setEditTaskData] = useState({  
    title: "",  
    priority: "",  
    due_date: ""  
  });  
  
  useEffect(() => {  
    const storedUser = localStorage.getItem("user");  
    if (storedUser) {  
      const parsedUser = JSON.parse(storedUser);  
      setUser(parsedUser);  
      fetchTasks(parsedUser.id);  
    }  
  }, []);  
  
  // Fetch tasks for user  
  const fetchTasks = async (userId) => {  
    console.log("Fetching tasks for userId:", userId);  
    try {  
      const res = await API.get(`/tasks/${Number(userId)}`);  
      console.log("Tasks fetched:", res.data);  
      setTasks(res.data);  
    } catch (error) {  
      console.error("Error fetching tasks:", error.response || error);  
      alert("Failed to fetch tasks");  
    }  
  };  
  
  // Add task  
  const handleAddTask = async () => {  
    if (!newTask.title || !newTask.category || !newTask.priority || !newTask.due_date) {  
      alert("Please fill all fields");  
      return;  
    }  
  
    try {  
      await API.post("/tasks", {  
        user_id: Number(user.id),  
        title: newTask.title,  
        category: newTask.category,  
        priority: newTask.priority,  
        due_date: newTask.due_date.trim()  
      });  
      setNewTask({ title: "", category: "", priority: "", due_date: "" });  
      fetchTasks(user.id);  
    } catch (error) {  
      console.error("Error adding task:", error.response || error);  
      alert("Failed to add task");  
    }  
  };  
  
  // Delete task  
  const handleDeleteTask = async (taskId) => {  
    try {  
      await API.delete(`/tasks/${Number(taskId)}`);  
      fetchTasks(user.id);  
    } catch (error) {  
      console.error("Error deleting task:", error.response || error);  
      alert("Failed to delete task");  
    }  
  };  
  
  // Start editing a task  
  const startEditTask = (task) => {  
    setEditTaskId(task.id);  
    setEditTaskData({  
      title: task.title,  
      priority: task.priority,  
      due_date: task.due_date  
    });  
  };  
  
  // Cancel editing  
  const cancelEdit = () => {  
    setEditTaskId(null);  
    setEditTaskData({ title: "", priority: "", due_date: "" });  
  };  
  
  // Save edited task ✅ UPDATED
  const saveEditTask = async () => {  
    const { title, priority, due_date } = editTaskData;  

    if (!title || !priority || !due_date) {  
      alert("Please fill all fields");  
      return;  
    }  

    try {  
      console.log("Updating task:", editTaskId, editTaskData);

      await API.put(`/tasks/${Number(editTaskId)}`, {  
        title: title.trim(),  
        priority: priority.trim(),  
        due_date: due_date.trim()  
      });  

      // Update task list immediately without full refetch
      setTasks(tasks.map(t => t.id === editTaskId ? { ...t, ...editTaskData } : t));

      setEditTaskId(null);  
      setEditTaskData({ title: "", priority: "", due_date: "" });  

    } catch (error) {  
      console.error("Error updating task:", error.response || error);  
      alert("Failed to update task");  
    }  
  };  
  
  return (  
    <div style={{ textAlign: "center", marginTop: "50px" }}>  
      <h1>Welcome to your Dashboard!</h1>  
      {user ? <h2>Hello, {user.username} 👋</h2> : <h2>Loading user...</h2>}  

      <h3 style={{ marginTop: "40px" }}>Your Tasks:</h3>  
      {tasks.length === 0 ? (  
        <p>No tasks yet.</p>  
      ) : (  
        <ul style={{ listStyleType: "none", padding: 0 }}>  
          {tasks.map((task) => (  
            <li key={task.id} style={{ marginBottom: "15px" }}>  
              {editTaskId === task.id ? (  
                <>  
                  <input  
                    type="text"
                    value={editTaskData.title}  
                    onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}  
                  />  
                  <input  
                    type="text"
                    value={editTaskData.priority}  
                    onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}  
                  />  
                  <input  
                    type="date"
                    value={editTaskData.due_date}  
                    onChange={(e) => setEditTaskData({ ...editTaskData, due_date: e.target.value })}  
                  />  
                  <button onClick={saveEditTask}>Save</button>  
                  <button onClick={cancelEdit}>Cancel</button>  
                </>  
              ) : (  
                <>  
                  <strong>{task.title}</strong> - {task.category} - {task.priority} - Due: {task.due_date}{" "}  
                  <button onClick={() => startEditTask(task)}>Edit</button>  
                  <button onClick={() => handleDeleteTask(task.id)}>Delete</button>  
                </>  
              )}  
            </li>  
          ))}  
        </ul>  
      )}  

      {/* Add Task Form */}  
      <div style={{ marginTop: "40px" }}>  
        <h3>Add New Task</h3>  
        <input  
          placeholder="Title"  
          value={newTask.title}  
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}  
        />  
        <br /><br />  
        <input  
          placeholder="Category"  
          value={newTask.category}  
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}  
        />  
        <br /><br />  
        <input  
          placeholder="Priority"  
          value={newTask.priority}  
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}  
        />  
        <br /><br />  
        <input  
          type="date"  
          value={newTask.due_date}  
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}  
        />  
        <br /><br />  
        <button onClick={handleAddTask}>Add Task</button>  
      </div>  
    </div>  
  );  
}