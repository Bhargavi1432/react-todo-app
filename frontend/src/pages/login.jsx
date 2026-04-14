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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user.userid || !user.password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/login", {
        userid: user.userid,
        password: user.password,
      });
      if (res.data.success) {
        // Store only token or safe user info
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid login credentials");
      }
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !user.username ||
      !user.firstname ||
      !user.lastname ||
      !user.email ||
      !user.userid ||
      !user.password
    ) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/register", user);
      setError(res.data.message);
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
      setError("Server error. Please try again later.");
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
          {isRegister && (
            <>
              <label>
                Username
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Firstname
                <input
                  type="text"
                  value={user.firstname}
                  onChange={(e) =>
                    setUser({ ...user, firstname: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Lastname
                <input
                  type="text"
                  value={user.lastname}
                  onChange={(e) =>
                    setUser({ ...user, lastname: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </label>
            </>
          )}

          <label>
            User ID
            <input
              type="text"
              value={user.userid}
              onChange={(e) => setUser({ ...user, userid: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
