import React from "react";
import "../index.css";

const skills = [
  "HTML", "CSS", "Python", "Machine Learning",
  "Git & GitHub", "UI/UX", "SQL", "AI", "GEN AI", "POWER BI"
];

const Skills = () => {
  return (
    <div className="skills-container" style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>💼 Skills & Tools</h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem"
      }}>
        {skills.map((skill, index) => (
          <div key={index} style={{
            padding: "1rem 2rem",
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#f8f8f8",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.1)"
          }}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
