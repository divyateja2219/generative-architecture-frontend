import React from "react";
import "../index.css";

const skills = [
  "JavaScript",
  "React.js",
  "HTML5",
  "CSS3",
  "Git & GitHub",
  "Node.js",
  "Express",
  "MongoDB",
  "Python",
  "TensorFlow",
  "Figma"
];

const Skills = () => {
  return (
    <section className="skills-section">
      <h2>🛠️ Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
