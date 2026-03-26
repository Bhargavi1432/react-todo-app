export default function Navbar({ setFilter }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#333",
      color: "white"
    }}>
      <h3>Todo App</h3>

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("personal")}>Personal</button>
        <button onClick={() => setFilter("work")}>Work</button>
        <button onClick={() => setFilter("study")}>Study</button>
      </div>
    </div>
  );
}