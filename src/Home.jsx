import React from "react";
import "../index.css";
import { Typewriter } from "react-simple-typewriter";
import { BsChevronDown } from "react-icons/bs";

const Home = () => {
  return (
    <div className="home-container" style={{ textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        👩‍💻{" "}
        <span style={{ color: "#000" }}>
          <Typewriter
            words={["Design", "Code", "Innovate", "Visualize", "Research"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Welcome to my generative architecture portfolio.<br />
        Explore ideas where design meets intelligence.
      </p>
      <BsChevronDown style={{ fontSize: "2rem", marginTop: "2rem" }} />
    </div>
  );
};

export default Home;
