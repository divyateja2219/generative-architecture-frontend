import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", textAlign: "center", backgroundColor: "#eee" }}>
      <Link to="/" style={{ margin: "0 1rem" }}>Home</Link>
      <Link to="/visualizer" style={{ margin: "0 1rem" }}>Visualizer</Link>
      <Link to="/login" style={{ margin: "0 1rem" }}>Login</Link>
    </nav>
  );
}
