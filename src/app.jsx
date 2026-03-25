import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";


function App() {
  return (
    <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<h1>Dashboard</h1>} />
</Routes>
  );
}

export default App;
