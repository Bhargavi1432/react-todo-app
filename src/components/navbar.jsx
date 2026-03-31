import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); 
  };

  return (
    <div className="navbar">
      {/* 🔹 Navigation Links */}
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/data">Data</Link>
      </div>

      {/* 🔹 Logout */}
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
