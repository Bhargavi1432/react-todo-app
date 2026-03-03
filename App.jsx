import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Users from "./pages/Users";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  );
}

export default App;


import Login from "./pages/Login";

<Route path="/" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />