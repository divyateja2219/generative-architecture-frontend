import React, { useState } from "react";

const projectData = [
  { title: "AI-based Design Assistant", description: "Generates architectural layouts based on user prompts." },
  { title: "Parametric Pavilion", description: "A pavilion design using generative geometry principles." },
  { title: "Climate-Responsive Facade", description: "Dynamic shading system that reacts to solar exposure." },
  { title: "Algorithmic Tower", description: "High-rise design driven by optimization algorithms." },
  { title: "3D Printed Shells", description: "Form-finding techniques translated into printable geometries." },
  { title: "VR Walkthrough Generator", description: "Turns 2D plans into immersive virtual tours." },
];

const Projects = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? projectData : projectData.slice(0, 3);

  return (
    <div className="projects-container">
      <h2>✨ My Projects</h2>
      <div className="project-list">
        {visibleProjects.map((project, index) => (
          <div className="project-card" key={index}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
      <button className="show-more-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default Projects;
