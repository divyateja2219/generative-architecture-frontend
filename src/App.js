import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return <div style={{ padding: "2rem", fontSize: "2rem" }}>🏠 Home Page</div>;
}

function About() {
  return <div style={{ padding: "2rem", fontSize: "2rem" }}>ℹ️ About Page</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
