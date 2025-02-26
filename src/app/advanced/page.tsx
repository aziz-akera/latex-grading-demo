"use client";

import type React from "react";

import { useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { areExpressionsEquivalent } from "@/utils/check-answers";
import { ChevronLeft, ChevronRight } from "lucide-react";

const advancedExamples = [
  {
    id: "probability",
    title: "Probability Simplification",
    question:
      "What is the probability of drawing a red card from a standard deck of 52 cards?",
    correctAnswer: "\\frac{1}{2}",
    placeholder: "Answer format: \\frac{1}{2} or 1/2 (must be simplified)",
    options: { requireSimplified: true },
    explanation:
      "There are 26 red cards in a standard deck of 52 cards. The probability is $\\frac{26}{52} = \\frac{1}{2}$. Note that $\\frac{26}{52}$ is correct mathematically, but $\\frac{1}{2}$ is the simplest form.",
  },
  {
    id: "factorization",
    title: "Complete Factorization",
    question: "Factor completely: $x^4 - 1$",
    correctAnswer: "(x-1)(x+1)(x^2+1)",
    placeholder: "Answer format: (x-1)(x+1)(x^2+1) or (x-1)*(x+1)*(x^2+1)",
    options: { requireFullFactorization: true },
    explanation:
      "The factorization $x^4 - 1 = (x^2 - 1)(x^2 + 1)$ is correct but incomplete. The complete factorization is $(x-1)(x+1)(x^2+1)$ because $x^2 - 1$ can be further factored as $(x-1)(x+1)$.",
  },
  {
    id: "integral",
    title: "Integral Evaluation",
    question: "Evaluate: $\\int x^2 dx$",
    correctAnswer: "\\frac{x^3}{3} + C",
    placeholder: "Answer format: \\frac{x^3}{3} + C or x^3/3 + C",
    options: { isIntegral: true },
    explanation:
      "The integral of $x^2$ is $\\frac{x^3}{3} + C$, where $C$ is the constant of integration. Remember to include the constant of integration in your answer.",
  },
  {
    id: "complex",
    title: "Complex Numbers",
    question: "If $z = 3 + 4i$, find $z^2$.",
    correctAnswer: "-7 + 24i",
    placeholder: "Answer format: -7 + 24i",
    options: {},
    explanation:
      "To square a complex number $z = a + bi$, use the formula: $z^2 = (a + bi)^2 = a^2 - b^2 + 2abi$. \n\nHere, $z = 3 + 4i$, so: \n$z^2 = (3 + 4i)^2 = 3^2 - 4^2 + 2(3)(4)i = 9 - 16 + 24i = -7 + 24i$.",
  },
  {
    id: "domain",
    title: "Domain Restrictions",
    question: "Specify the domain of $f(x) = \\frac{1}{x}$.",
    correctAnswer: "$x \\in \\mathbb{R} \\setminus \\{0\\}$",
    placeholder: " $x \\in \\mathbb{R} \\setminus \\{0\\}$",
    options: { isDomainRestriction: true },
    explanation:
      "The function $f(x) = \\frac{1}{x}$ is defined for all real numbers except $x = 0$. The domain can be written in several equivalent ways:\n1) $x \\in \\mathbb{R} \\setminus \\{0\\}$\n2) $\\mathbb{R} \\setminus \\{0\\}$\n3) $(-\\infty,0) \\cup (0,+\\infty)$",
  },
  {
    id: "multiple-solutions",
    title: "Multiple Solutions",
    question: "Solve for x: $x^2 - 16 = 0$",
    correctAnswer: "x = 4, x = -4",
    placeholder: "Answer format: x = 4, x = -4 or {-4, 4} or S = {-4, 4}",
    options: { allowMultipleSolutions: true },
    explanation:
      "The equation $x^2 - 16 = 0$ can be rewritten as $(x-4)(x+4) = 0$. This gives us two solutions: $x = 4$ and $x = -4$. Both solutions must be included in your answer.",
  },
];

export default function AdvancedQuiz() {
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        areExpressionsEquivalent(
          userAnswer,
          advancedExamples[questionIndex].correctAnswer,
          advancedExamples[questionIndex].options
        )
      ) {
        setResult("Correct!");
        setShowExplanation(true);
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
    setShowExplanation(false);
  };

  const nextQuestion = () =>
    changeQuestion((questionIndex + 1) % advancedExamples.length);
  const prevQuestion = () =>
    changeQuestion(
      (questionIndex - 1 + advancedExamples.length) % advancedExamples.length
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8 text-center">
        Advanced Math Challenges
      </h1>
      <div className="w-full max-w-2xl px-2 md:px-4">
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <button
            onClick={prevQuestion}
            className="p-1 md:p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <div className="text-center flex-1 px-2">
            <span className="text-sm md:text-lg font-medium line-clamp-1">
              {advancedExamples[questionIndex].title}
            </span>
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
              Challenge {questionIndex + 1}:{" "}
              {advancedExamples[questionIndex].id}
            </h2>
            <div className="text-sm md:text-base">
              <Latex>{advancedExamples[questionIndex].question}</Latex>
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
              <input
                type="text"
                id="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm md:text-base"
                placeholder={advancedExamples[questionIndex].placeholder}
              />
              <p className="mt-1 text-xs md:text-sm text-gray-500">
                {advancedExamples[questionIndex].placeholder}
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
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
          {showExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-base md:text-lg font-medium mb-2">
                {advancedExamples[questionIndex].title} Explanation
              </h3>
              <div className="text-xs md:text-sm text-gray-700">
                <Latex>{advancedExamples[questionIndex].explanation}</Latex>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
