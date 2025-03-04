"use client";

import type React from "react";
import { useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { areExpressionsEquivalent } from "@/utils/check-answers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MathInput from "./keyboard/math-input";

const examples = [
  {
    question: "Simplify: $3x + 3 - (x - 2)$",
    correctAnswer: "2x + 5",
    placeholder: "Answer format: 2x + 5",
    options: {},
  },
  {
    question: "Simplify: $\\frac{2}{4} + \\frac{1}{6}$",
    correctAnswer: "\\frac{2}{3}",
    placeholder: "Answer format: \\frac{2}{3} or 2/3",
    options: {},
  },
  {
    question:
      "Express the probability of drawing a heart from a standard deck of cards in simplest form.",
    correctAnswer: "\\frac{1}{4}",
    placeholder: "Answer format: \\frac{1}{4} or 1/4 (must be simplified)",
    options: { requireSimplified: true },
  },
  {
    question: "Factor completely: $x^4 - 1$",
    correctAnswer: "(x-1)(x+1)(x^2+1)",
    placeholder: "Answer format: (x-1)(x+1)(x^2+1) or (x-1)*(x+1)*(x^2+1)",
    options: { requireFullFactorization: true },
  },
  {
    question: "Solve for x: $x^2 - 16 = 0$",
    correctAnswer: "x = 4, x = -4",
    placeholder: "Answer format: x = 4, x = -4 or {-4, 4} or S = {-4, 4}",
    options: { allowMultipleSolutions: true },
  },
  {
    question: "Specify the domain of $f(x) = \\frac{1}{x}$",
    correctAnswer: "x \\in \\mathbb{R}\\setminus\\{0\\}",
    placeholder:
      "Answer format: x \\in \\mathbb{R}\\setminus\\{0\\} or R\\{0} or ]-∞;0[∪]0;+∞[",
    options: { isDomainRestriction: true },
  },
  {
    question: "Simplify: $(3 + 4i) + (2 - 3i)$",
    correctAnswer: "5 + i",
    placeholder: "Answer format: 5 + i or 5+i",
    options: { isComplexNumber: true },
  },
  {
    question: "Simplify: $\\sqrt{8}$",
    correctAnswer: "2\\sqrt{2}",
    placeholder: "Answer format: 2\\sqrt{2} or 2*sqrt(2)",
    options: {},
  },
  {
    question: "Simplify: $\\sin^2(x) + \\cos^2(x)$",
    correctAnswer: "1",
    placeholder: "Answer format: 1",
    options: {},
  },
  {
    question: "Calculate: $\\log_{10}(100)$",
    correctAnswer: "2",
    placeholder: "Answer format: 2",
    options: {},
  },
  {
    question: "Simplify: $e^{\\ln(5)}$",
    correctAnswer: "5",
    placeholder: "Answer format: 5",
    options: {},
  },
];

export default function Home() {
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        areExpressionsEquivalent(
          userAnswer,
          examples[questionIndex].correctAnswer,
          examples[questionIndex].options
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
    setShowHint(false);
  };

  const nextQuestion = () =>
    changeQuestion((questionIndex + 1) % examples.length);
  const prevQuestion = () =>
    changeQuestion((questionIndex - 1 + examples.length) % examples.length);

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8 text-center">
        Advanced Math Quiz Demo
      </h1>
      <div className="w-full max-w-2xl px-2 md:px-4">
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <button
            onClick={prevQuestion}
            className="p-1 md:p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-w-[80%]">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => changeQuestion(index)}
                className={`w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
            className="p-1 md:p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              Question {questionIndex + 1}:
            </h2>
            <div className="text-sm md:text-base">
              <Latex>{examples[questionIndex].question}</Latex>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Answer:
              </label>
              <MathInput
                // id="answer"
                value={userAnswer}
                onChange={setUserAnswer}
                placeholder={examples[questionIndex].placeholder}
                className="mt-1"
              />

              <p className="mt-1 text-xs md:text-sm text-gray-500">
                {examples[questionIndex].placeholder}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={toggleHint}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            </div>
          </form>
          {result && (
            <div
              className={`mt-4 p-2 rounded text-sm md:text-base ${
                result === "Correct!"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result}
            </div>
          )}
          {showHint && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded border border-blue-200">
              <h3 className="font-medium mb-1 text-sm md:text-base">Hint:</h3>
              <p className="text-xs md:text-sm">
                {examples[questionIndex].options.requireSimplified
                  ? "Make sure your answer is in the simplest form."
                  : examples[questionIndex].options.requireFullFactorization
                  ? "Make sure to factor the expression completely."
                  : examples[questionIndex].options.allowMultipleSolutions
                  ? "Remember to include all solutions."
                  : examples[questionIndex].options.isDomainRestriction
                  ? "Specify the domain using proper notation."
                  : examples[questionIndex].options.isComplexNumber
                  ? "Remember to simplify both real and imaginary parts."
                  : "Try to simplify your answer as much as possible."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
