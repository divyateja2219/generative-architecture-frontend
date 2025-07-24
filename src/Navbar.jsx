import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional: Add your styles here

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Generative Architecture</h2>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/visualizer">Visualizer</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
