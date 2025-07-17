import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem("dark", darkMode);
  }, [darkMode]);

  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        background: darkMode ? "#444" : "#eee",
        color: darkMode ? "#eee" : "#333",
        border: "none",
        cursor: "pointer",
        zIndex: 999
      }}
    >
      {darkMode ? "🌙 Night" : "☀️ Day"}
    </button>
  );
};

export default ThemeToggle;
