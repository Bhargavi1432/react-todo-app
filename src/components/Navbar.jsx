import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // 🔹 Import CSS

export default function Navbar({ setFilter }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("personal")}>Personal</button>
        <button onClick={() => setFilter("work")}>Work</button>
        <button onClick={() => setFilter("study")}>Study</button>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}