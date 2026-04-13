import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./login.css"; // ✅ Import CSS

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    userid: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!user.userid || !user.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await API.post("/login", {
        userid: user.userid,
        password: user.password,
      });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        alert("Invalid login");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleRegister = async () => {
    if (
      !user.username ||
      !user.firstname ||
      !user.lastname ||
      !user.email ||
      !user.userid ||
      !user.password
    ) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await API.post("/register", user);
      alert(res.data.message);
      setIsRegister(false);
      setUser({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        userid: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? "Register Page" : "Login Page"}</h2>

        {isRegister ? (
          <>
            <input
              placeholder="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <input
              placeholder="Firstname"
              value={user.firstname}
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
            />
            <input
              placeholder="Lastname"
              value={user.lastname}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
            />
            <input
              placeholder="Email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              placeholder="User ID"
              type="number"
              value={user.userid}
              onChange={(e) => setUser({ ...user, userid: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button onClick={handleRegister}>Register</button>
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Login</span>
            </p>
          </>
        ) : (
          <>
            <input
              placeholder="User ID"
              type="number"
              value={user.userid}
              onChange={(e) => setUser({ ...user, userid: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button onClick={handleLogin}>Login</button>
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsRegister(true)}>Register</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
