import React, { useEffect, useState } from "react";
import "../index.css";

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to be irreplaceable, one must always be different.",
  "Java is to JavaScript what car is to Carpet.",
  "Simplicity is the soul of efficiency.",
  "Talk is cheap. Show me the code."
];

const QuoteFooter = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div style={{
      backgroundColor: "#222",
      color: "#fff",
      textAlign: "center",
      padding: "1rem",
      fontStyle: "italic",
      fontSize: "1rem"
    }}>
      ❝ {quote} ❞
    </div>
  );
};

export default QuoteFooter;
