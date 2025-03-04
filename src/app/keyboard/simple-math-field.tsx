"use client";
import React, { useEffect, useRef } from "react";
import "mathlive";

const SimpleMathField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mathField = new window.MathfieldElement();
    window.MathfieldElement.fontsDirectory = "/mathlive/fonts";
    window.MathfieldElement.soundsDirectory = "/mathlive/sounds";

    mathField.style.width = "100%";
    mathField.style.border = "1px solid #ccc";
    mathField.style.padding = "8px";
    mathField.style.fontSize = "1.2rem";

    if (containerRef.current) {
      containerRef.current.appendChild(mathField);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(mathField);
      }
    };
  }, []);

  return (
    <div>
      <h2>MathLive Example</h2>
      <div ref={containerRef} style={{ minHeight: "50px" }}></div>
    </div>
  );
};

export default SimpleMathField;
