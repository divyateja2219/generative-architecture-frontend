// src/App.js

import { HashRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return <h1 style={{ textAlign: "center" }}>Welcome Home 🏡</h1>;
}

function About() {
  return <h1 style={{ textAlign: "center" }}>About Page 📖</h1>;
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
