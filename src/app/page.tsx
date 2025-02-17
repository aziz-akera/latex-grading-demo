"use client";

import type React from "react";
import { useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { areExpressionsEquivalent } from "@/utils/check-answers";

const examples = [
  {
    question: "Simplify: $3x + 3 - (x - 2)$",
    correctAnswer: "2x + 5",
    placeholder: "Enter your answer (e.g., 2x + 5, 2*x + 5)",
  },
  {
    question: "Simplify: $\\frac{2}{4} + \\frac{1}{6}$",
    correctAnswer: "\\frac{2}{3}",
    placeholder: "Enter your answer (e.g., \\frac{2}{3}, 2/3, 0.6666)",
  },
];

export default function Home() {
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        areExpressionsEquivalent(
          userAnswer,
          examples[exampleIndex].correctAnswer
        )
      ) {
        setResult("Correct!");
      } else {
        setResult("Incorrect. Try again.");
      }
    } catch (error) {
      setResult(`Invalid input: ${(error as Error).message}`);
    }
  };

  const toggleExample = () => {
    setExampleIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    setUserAnswer("");
    setResult(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Math Quiz Demo</h1>
      <div className="w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Question:</h2>
          <Latex>{examples[exampleIndex].question}</Latex>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700"
            >
              Your Answer:
            </label>
            <input
              type="text"
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder={examples[exampleIndex].placeholder}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
        {result && (
          <div
            className={`mt-4 p-2 rounded ${
              result === "Correct!"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {result}
          </div>
        )}
        <button
          onClick={toggleExample}
          className="mt-3 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Switch to {exampleIndex === 0 ? "Fraction" : "Algebraic"} Example
        </button>
      </div>
    </main>
  );
}
