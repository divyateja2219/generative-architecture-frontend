import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ThemeToggle from "./ThemeToggle";
import CursorTrail from "./CursorTrail";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Login from "./pages/Login";
import Visualizer from "./pages/Visualizer";

function App() {
  return (
    <Router>
      <div className="App">
        <ThemeToggle />
        <CursorTrail />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/login" element={<Login />} />
          <Route path="/visualizer" element={<Visualizer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
