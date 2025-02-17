"use client";

import type React from "react";
import { useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { areExpressionsEquivalent } from "@/utils/check-answers";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  {
    question: "Solve: $\\sqrt{16} + \\sqrt{9}$",
    correctAnswer: "7",
    placeholder: "Enter your answer (e.g., 7)",
  },
  {
    question: "Simplify: $\\sin^2(x) + \\cos^2(x)$",
    correctAnswer: "1",
    placeholder: "Enter your answer (e.g., 1)",
  },
  {
    question: "Calculate: $\\log_{10}(100)$",
    correctAnswer: "2",
    placeholder: "Enter your answer (e.g., 2)",
  },
  {
    question: "Simplify: $e^{\\ln(5)}$",
    correctAnswer: "5",
    placeholder: "Enter your answer (e.g., 5)",
  },
];

export default function Home() {
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        areExpressionsEquivalent(
          userAnswer,
          examples[questionIndex].correctAnswer
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

  const changeQuestion = (newIndex: number) => {
    setQuestionIndex(newIndex);
    setUserAnswer("");
    setResult(null);
  };

  const nextQuestion = () =>
    changeQuestion((questionIndex + 1) % examples.length);
  const prevQuestion = () =>
    changeQuestion((questionIndex - 1 + examples.length) % examples.length);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Advanced Math Quiz Demo</h1>
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={prevQuestion}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex space-x-2">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => changeQuestion(index)}
                className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  index === questionIndex
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={nextQuestion}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Question {questionIndex + 1}:
            </h2>
            <Latex>{examples[questionIndex].question}</Latex>
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
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder={examples[questionIndex].placeholder}
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
        </div>
      </div>
    </main>
  );
}
