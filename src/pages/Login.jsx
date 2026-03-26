import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    userid: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false); // toggle login/register
  const navigate = useNavigate();

  // 🔹 Login handler
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
        navigate("/dashboard"); // redirect to dashboard
      } else {
        alert("Invalid login");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // 🔹 Register handler
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
      alert(res.data.message); // show success message
      setIsRegister(false); // switch back to login
      setUser({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        userid: "",
        password: "",
      }); // clear inputs
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{isRegister ? "Register Page" : "Login Page"}</h2>

      {isRegister ? (
        <>
          <input
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Firstname"
            value={user.firstname}
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Lastname"
            value={user.lastname}
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="User ID"
            type="number"
            value={user.userid}
            onChange={(e) => setUser({ ...user, userid: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <br /><br />

          <button onClick={handleRegister}>Register</button>
          <p>
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsRegister(false)}
            >
              Login
            </span>
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
          <br /><br />

          <input
            placeholder="Password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <br /><br />

          <button onClick={handleLogin}>Login</button>
          <p>
            Don't have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsRegister(true)}
            >
              Register
            </span>
          </p>
        </>
      )}
    </div>
  );
}
