import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    await API.post("/register", user);
    alert("Registered successfully ✅");
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Username"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />

      <input placeholder="Password" type="password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
