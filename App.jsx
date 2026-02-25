import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";

function App() {
  return (
      <Routes>
        <Route path="/Profile" element={<Profile />} />
      </Routes>
  );
}

export default App;
