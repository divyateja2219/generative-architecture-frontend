import React, { useEffect, useState } from "react";

const emojis = ["🚀", "✨", "💡", "🔥", "🎨", "🎯", "⚡️"];

const EmojiFlicker = () => {
  const [emoji, setEmoji] = useState(emojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = emojis[Math.floor(Math.random() * emojis.length)];
      setEmoji(random);
    }, 800); // change every 800ms

    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ fontSize: "2rem", marginLeft: "0.5rem" }}>{emoji}</span>
  );
};

export default EmojiFlicker;
