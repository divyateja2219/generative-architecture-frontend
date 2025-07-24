// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
