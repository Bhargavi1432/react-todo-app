import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Dashboard</Link>
      <Link to="/profile" style={{ marginRight: "15px" }}>Profile</Link>
      <Link to="/users">Users</Link>
    </nav>
  );
}

export default Navbar;
