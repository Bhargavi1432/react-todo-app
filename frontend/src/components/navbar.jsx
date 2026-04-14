import { useNavigate, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login/home after logout
  };

  return (
    <nav className="navbar">
      {/* 🔹 Navigation Links */}
      <div className="nav-links">
        <NavLink to="/dashboard" className="nav-item">
          Dashboard
        </NavLink>
        <NavLink to="/data" className="nav-item">
          Data
        </NavLink>
      </div>

      {/* 🔹 Logout Button */}
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
