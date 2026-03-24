import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
    </Routes>
  );
}

export default App;
