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
    <div className="projects-container px-4 py-10">
      <h2 className="section-heading text-3xl font-bold mb-6 text-black dark:text-white">✨ My Projects</h2>
      <div className="project-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((project, index) => (
          <div className="project-card p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 transition-colors duration-300" key={index}>
            <h3 className="project-title text-xl font-semibold mb-2 text-black dark:text-white">
              {project.title}
            </h3>
            <p className="project-description text-gray-700 dark:text-gray-300">
              {project.description}
            </p>
          </div>
        ))}
      </div>
      <button
        className="show-more-btn mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default Projects;
