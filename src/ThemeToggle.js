import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div style={{ position: "fixed", top: 15, right: 15, zIndex: 1000 }}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          backgroundColor: darkMode ? "#fff" : "#111",
          color: darkMode ? "#111" : "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
};

export default ThemeToggle;
