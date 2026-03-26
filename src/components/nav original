import { useNavigate } from "react-router-dom";

export default function Navbar({ setFilter }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear session
    navigate("/"); // redirect to login
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#f0f0f0",
        borderBottom: "1px solid #ccc"
      }}
    >
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("personal")}>Personal</button>
        <button onClick={() => setFilter("work")}>Work</button>
        <button onClick={() => setFilter("study")}>Study</button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "#ff4d4d",
          color: "white",
          border: "none",
          padding: "5px 15px",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Logout
      </button>
    </div>
  );
}