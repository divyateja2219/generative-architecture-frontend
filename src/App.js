import React from "react";
import CanvasRenderer from "./CanvasRenderer";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", color: "white", padding: "10px" }}>
        🎨 Generative Playground
      </h1>
      <CanvasRenderer />
    </div>
  );
}

export default App;
