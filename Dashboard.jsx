import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState("work");
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get(`/tasks/${user.id}`).then(res => setTasks(res.data));
  }, []);

  const filteredTasks = tasks.filter(
    t =>
      t.category === category &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Dashboard</h2>

      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <Navbar setCategory={setCategory} />

      {filteredTasks.map(task => (
        <div key={task.id}>
          <p>{task.title}</p>
          <p>{task.priority}</p>
          <p>{task.due_date}</p>
        </div>
      ))}
    </div>
  );
}