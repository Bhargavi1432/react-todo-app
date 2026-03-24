import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await API.post("/login", user);

    if (res.data.success) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input placeholder="Password" type="password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}