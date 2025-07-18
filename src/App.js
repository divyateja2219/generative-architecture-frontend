import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ThemeToggle from "./components/ThemeToggle";
import CursorTrail from "./components/CursorTrail";
import QuoteFooter from "./components/QuoteFooter";
import Skills from "./components/Skills";


function App() {
  return (
    <Router>
      <CursorTrail />
      <div>
        <ThemeToggle />

        <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
          <Link to="/" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>Home</Link>
          <Link to="/about" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>About</Link>
          <Link to="/projects" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>Projects</Link>
          <Link to="/skills" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>Skills</Link>

        </nav>

        <main style={{ padding: "2rem", textAlign: "center" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
          </Routes>
        </main>

        {/* Footer section */}
        <footer style={{ backgroundColor: "#111", color: "#fff", textAlign: "center", padding: "1rem" }}>
          © 2025 Divya Teja | Built with React
        </footer>

        {/* Quote footer below site footer */}
        <QuoteFooter />
      </div>
    </Router>
  );
}

export default App;
