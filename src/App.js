import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
          <Link to="/" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>Home</Link>
          <Link to="/about" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>About</Link>
          <Link to="/projects" style={{ margin: "0 1rem", textDecoration: "none", fontWeight: "bold" }}>Projects</Link>
        </nav>

        <main style={{ padding: "2rem", textAlign: "center" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
<footer style={{ textAlign: "center", padding: "1rem", background: "#111", color: "#fff" }}>
  © 2025 Divya Teja | Built with React
</footer>

        </main>
      </div>
    </Router>
  );
}

export default App;
