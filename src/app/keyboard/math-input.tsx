/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import "mathlive";

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MathInput = ({
  value,
  onChange,
  placeholder,
  className = "",
}: MathInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mathFieldRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (mathFieldRef.current && containerRef.current) {
      try {
        if (containerRef.current.contains(mathFieldRef.current)) {
          containerRef.current.removeChild(mathFieldRef.current);
        }
      } catch (e) {
        console.error("Error removing math field:", e);
      }
      mathFieldRef.current = null;
    }

    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }

    if (!containerRef.current) return;

    window.MathfieldElement.fontsDirectory = "/mathlive/fonts";
    window.MathfieldElement.soundsDirectory = "/mathlive/sounds";

    const mathField = new window.MathfieldElement();
    mathFieldRef.current = mathField;
    isInitializedRef.current = true;

    mathField.value = value;

    mathField.style.width = "100%";
    mathField.style.padding = "8px";
    mathField.style.fontSize = "1rem";
    mathField.style.border = "none";
    mathField.style.outline = "none";
    mathField.style.backgroundColor = "transparent";

    const handleInput = () => {
      onChange(mathField.value);
    };

    mathField.addEventListener("input", handleInput);

    containerRef.current.appendChild(mathField);

    return () => {
      if (mathField) {
        mathField.removeEventListener("input", handleInput);
      }

      if (containerRef.current && mathField) {
        try {
          if (containerRef.current.contains(mathField)) {
            containerRef.current.removeChild(mathField);
          }
        } catch (e) {
          console.error("Error removing math field in cleanup:", e);
        }
      }

      isInitializedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      mathFieldRef.current &&
      isInitializedRef.current &&
      mathFieldRef.current.value !== value
    ) {
      mathFieldRef.current.value = value;
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`rounded-md border border-gray-300 shadow-sm focus-within:border-indigo-300 focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50 ${className}`}
      aria-label={placeholder}
    />
  );
};

export default MathInput;
