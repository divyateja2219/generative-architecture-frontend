import React from "react";
import { Typewriter } from "react-simple-typewriter";
import Skills from "../components/Skills"; // ✅ Import Skills component

function Home() {
  return (
    <div className="home-container">
      {/* Typewriter intro */}
      <h1 className="home-heading">
        <Typewriter
          words={[
            "👩‍💻 Designing Algorithms",
            "🧠 Architecting Ideas",
            "🎨 Generating Spaces",
            "🚀 Dream. Design. Deploy.",
          ]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={40}
          delaySpeed={2000}
        />
      </h1>

      <p className="home-subtext">
        Welcome to my generative architecture portfolio. <br />
        Explore ideas where design meets intelligence.
      </p>

      <div className="scroll-down">&#x25BC;</div>

      {/* Skills Section */}
      <Skills />
    </div>
  );
}

export default Home;
