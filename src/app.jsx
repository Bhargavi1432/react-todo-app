import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard"; // 🔹 import Dashboard
import Data from "./pages/data";


function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/" element={<Login />} />

      {/* Dashboard page */}
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/data" element={<Data />} />
    </Routes>
  );
}

export default App;
