
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./login.css";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/login", {
        userid: user.userid,
        password: user.password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError("Invalid login credentials");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/register", user);
      setError(res.data.message || "Registered successfully!");
      setIsRegister(false);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>

          {/* ✅ REGISTER-ONLY FIELDS */}
          {isRegister && (
            <>
              <input
                placeholder="Username"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                required
              />
              <input
                placeholder="First Name"
                onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                required
              />
              <input
                placeholder="Last Name"
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </>
          )}

          {/* ✅ COMMON FIELDS */}
          <input
            placeholder="User ID"
            onChange={(e) => setUser({ ...user, userid: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* ✅ TOGGLE (THIS WAS MISSING) */}
        <p className="toggle-text">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Login" : " Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
