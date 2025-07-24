import React, { useState } from "react";

export default function Visualizer() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelURL, setModelURL] = useState(null); // This will hold the 3D model URL

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      // Placeholder for now. Replace with actual API later
      setModelURL("https://modelviewer.dev/shared-assets/models/Astronaut.glb");
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Generate 3D Architecture</h2>
      <input
        type="text"
        placeholder="Describe your architecture idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "60%",
          marginBottom: "1rem",
          fontSize: "1rem",
        }}
      />
      <br />
      <button
        onClick={handleGenerate}
        style={{
          padding: "0.6rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Generate
      </button>

      {loading && <p>Loading your 3D model...</p>}

      {/* 3D Viewer */}
      {modelURL && (
        <model-viewer
          src={modelURL}
          alt="Generated 3D Model"
          auto-rotate
          camera-controls
          style={{ width: "600px", height: "400px", marginTop: "2rem" }}
        ></model-viewer>
      )}
    </div>
  );
}
