import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard"; // 🔹 import Dashboard

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/" element={<Login />} />

      {/* Dashboard page */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;