export default function Navbar({ setCategory }) {
  return (
    <div>
      <button onClick={() => setCategory("work")}>Work</button>
      <button onClick={() => setCategory("study")}>Study</button>
      <button onClick={() => setCategory("personal")}>Personal</button>
    </div>
  );
}