import React, { useEffect } from "react";
import "../index.css";

const CursorTrail = () => {
  useEffect(() => {
    const trailElements = [];

    const createTrail = (x, y) => {
      const trail = document.createElement("div");
      trail.className = "trail";
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      document.body.appendChild(trail);
      trailElements.push(trail);
      setTimeout(() => {
        trail.remove();
      }, 1000);
    };

    const handleMouseMove = (e) => {
      createTrail(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
};

export default CursorTrail;
