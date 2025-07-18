import React from "react";
import "../index.css"; // make sure your main CSS is imported

const skills = [
  "HTML",
  "CSS",
  "Python",
  "Machine Learning",
  "Git & GitHub",
  "UI/UX",
  "SQL",
  "AI",
  "GEN AI",
  "POWER BI",
];

const Skills = () => {
  return (
    <div className="skills-section">
      <h2 className="skills-title">💼 Skills & Tools</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
