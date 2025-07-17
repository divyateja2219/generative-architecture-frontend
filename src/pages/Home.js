import React from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Hi, I'm Divya Teja 👋</h1>
      <h2 style={{ fontSize: "1.5rem", color: "#555" }}>
        <Typewriter
          words={['React Developer', 'ML Enthusiast', 'Dreamer']}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h2>
    </div>
  );
}
