import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Temporary Dashboard */}
        <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;