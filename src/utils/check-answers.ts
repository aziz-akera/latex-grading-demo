import * as math from "mathjs";
import { convertLatexToAsciiMath } from "mathlive";

const customMath = math.create(math.all, {});

customMath.import(
  {
    ln: (x: number) => Math.log(x),
    log: (x: number, base = 10) => Math.log(x) / Math.log(base),
    exp: (x: number) => Math.exp(x),
    i: customMath.complex(0, 1), // imaginary unit
  },
  { override: true }
);

interface GradingOptions {
  requireSimplified?: boolean;
  requireFullFactorization?: boolean;
  allowMultipleSolutions?: boolean;
  isIntegral?: boolean;
  isDomainRestriction?: boolean;
  isComplexNumber?: boolean;
}

const normalizeMultiplication = (expr: string): string => {
  return expr.replace(/∗/g, "*"); // replace Unicode multiplication sign with standard asterisk
};

const evaluateExpression = (expr: string): math.MathNode => {
  try {
    return customMath.parse(expr);
  } catch (error) {
    throw new Error(`Failed to parse expression: ${expr}. ${(error as Error).message}`);
  }
};

const isSimplestForm = (numerator: number, denominator: number): boolean => {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  return gcd(Math.abs(numerator), Math.abs(denominator)) === 1;
};

const extractFraction = (expr: string): { numerator: number; denominator: number } | null => {
  try {
    const fractionRegex = /^(\d+)\/(\d+)$/;
    const latexFractionRegex = /^\\frac\{(\d+)\}\{(\d+)\}$/;

    let match = expr.match(fractionRegex);
    if (match) {
      return {
        numerator: Number.parseInt(match[1]),
        denominator: Number.parseInt(match[2]),
      };
    }

    match = expr.match(latexFractionRegex);
    if (match) {
      return {
        numerator: Number.parseInt(match[1]),
        denominator: Number.parseInt(match[2]),
      };
    }

    return null;
  } catch (error) {
    console.error("Error extracting fraction:", error);
    return null;
  }
};

const parseSolutionSet = (expr: string): Set<string> => {
  const cleanExpr = expr.replace(/[{}()[\]]/g, "").replace(/S\s*=\s*/, "");
  const solutions = cleanExpr.split(",").map((s) => s.trim());

  const normalizedSolutions = new Set<string>();
  for (const solution of solutions) {
    if (solution.includes("=")) {
      const value = solution.split("=")[1].trim();
      normalizedSolutions.add(value);
    } else {
      normalizedSolutions.add(solution);
    }
  }

  return normalizedSolutions;
};

const normalizeFactorization = (expr: string): string => {
  return expr
    .replace(/\s+/g, "") // remove all whitespace
    .replace(/−/g, "-") // replace Unicode minus sign with regular hyphen
    .replace(/\*/g, "") // remove explicit multiplication symbols
    .replace(/x\*x|xx/g, "x^2") // convert xx or x*x to x^2
    .replace(/([0-9]+)x/g, "$1*x") // add * between numbers and x
    .replace(/\)\(/g, ")*(") // add * between closing and opening parentheses
    .replace(/x\(/g, "x*(") // add * between x and opening parenthesis
    .replace(/\)x/g, ")*x") // add * between closing parenthesis and x
    .replace(/[−‐‑‒–—―]/g, "-"); // replace all types of hyphens/dashes with standard minus
};

const areFactorizationsEquivalent = (
  expr1: string,
  expr2: string,
  requireFullFactorization: boolean
): boolean => {
  try {
    const normalizedExpr1 = normalizeFactorization(expr1);
    const normalizedExpr2 = normalizeFactorization(expr2);

    if (requireFullFactorization) {
      const factorCount1 = (normalizedExpr1.match(/\(/g) || []).length;
      const factorCount2 = (normalizedExpr2.match(/\(/g) || []).length;

      if (factorCount1 !== factorCount2) {
        return false;
      }
    }

    // Test numerical equivalence at multiple points
    const testPoints = [-2, -1, 0, 1, 2, 3, 4, 5];
    const scope: Record<string, number> = {};

    for (const point of testPoints) {
      scope.x = point;
      const value1 = customMath.evaluate(normalizedExpr1, scope);
      const value2 = customMath.evaluate(normalizedExpr2, scope);

      if (Math.abs(value1 - value2) > 1e-10) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error comparing factorizations:", error);
    return false;
  }
};

const areDomainRestrictionsEquivalent = (expr1: string, expr2: string): boolean => {
  const normalize = (expr: string): string => {
    return expr
      .replace(/\$|\$/g, "")
      .replace(/\s+/g, "")
      .replace(/\\setminus/g, "\\")
      .replace(/\\backslash/g, "\\")
      .replace(/\\/g, "\\")
      .replace(/\\mathbb\{R\}/g, "R")
      .replace(/\\mathbb{R}/g, "R")
      .replace(/\\R/g, "R")
      .replace(/R\*/g, "R\\{0}")
      .replace(/\\infty/g, "inf")
      .replace(/-\\infty/g, "-inf")
      .replace(/\+\\infty/g, "inf")
      .replace(/infinity/g, "inf")
      .replace(/\\cup/g, "∪")
      .replace(/\\union/g, "∪")
      .replace(/U/g, "∪")
      .replace(/\\in/g, "in")
      .replace(/∈/g, "in")
      .replace(/\\/g, "")
      .replace(/x=/g, "")
      .replace(/x/g, "")
      .replace(/$$\-inf\,0$$∪$$0\,inf$$/g, "R\\{0}")
      .replace(/\[\-inf\,0\[∪\]0\,inf\]/g, "R\\{0}")
      .replace(/\]\-inf\;0\[∪\]0\;\+inf\[/g, "R\\{0}")
      .toLowerCase()
      .replace(/[{}]/g, "")
      .replace(/[()]/g, "")
      .replace(/;/g, ",");
  };

  const normalized1 = normalize(expr1);
  const normalized2 = normalize(expr2);

  return normalized1 === normalized2;
};

const areComplexNumbersEquivalent = (expr1: string, expr2: string): boolean => {
  try {
    const parseComplex = (expr: string): { re: number; im: number } => {
      const normalized = expr
        .replace(/\s+/g, "")
        .replace(/(\d+)i/g, "$1*i")
        .replace(/i(\d+)/g, "i*$1");

      const complex = customMath.evaluate(normalized);
      return {
        re: typeof complex.re === "number" ? complex.re : 0,
        im: typeof complex.im === "number" ? complex.im : 0,
      };
    };

    const complex1 = parseComplex(expr1);
    const complex2 = parseComplex(expr2);

    return Math.abs(complex1.re - complex2.re) < 1e-10 && Math.abs(complex1.im - complex2.im) < 1e-10;
  } catch (error) {
    console.error("Error comparing complex numbers:", error);
    return false;
  }
};

export const areExpressionsEquivalent = (
  studentAnswer: string,
  correctAnswer: string,
  options: GradingOptions = {}
): boolean => {
  if (!studentAnswer || !correctAnswer) {
    throw new Error("Both student answer and correct answer must be provided");
  }

  try {
    const {
      requireSimplified = false,
      requireFullFactorization = false,
      allowMultipleSolutions = false,
      isDomainRestriction = false,
      isComplexNumber = false,
    } = options;

    if (isDomainRestriction) {
      return areDomainRestrictionsEquivalent(studentAnswer, correctAnswer);
    }

    if (isComplexNumber) {
      return areComplexNumbersEquivalent(studentAnswer, correctAnswer);
    }

    if (allowMultipleSolutions) {
      const studentSolutions = parseSolutionSet(studentAnswer);
      const correctSolutions = parseSolutionSet(correctAnswer);

      if (studentSolutions.size !== correctSolutions.size) {
        return false;
      }

      for (const solution of studentSolutions) {
        let found = false;
        for (const correctSolution of correctSolutions) {
          if (areExpressionsEquivalent(solution, correctSolution)) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }

      return true;
    }

    if (requireSimplified) {
      const studentFraction = extractFraction(studentAnswer);
      if (studentFraction) {
        if (!isSimplestForm(studentFraction.numerator, studentFraction.denominator)) {
          return false;
        }
      }
    }

    if (requireFullFactorization) {
      return areFactorizationsEquivalent(studentAnswer, correctAnswer, true);
    }

    // Convert LaTeX to AsciiMath for standard processing
    let mathJs1 = convertLatexToAsciiMath(studentAnswer);
    let mathJs2 = convertLatexToAsciiMath(correctAnswer);

    mathJs1 = normalizeMultiplication(mathJs1);
    mathJs2 = normalizeMultiplication(mathJs2);

    const parsed1 = evaluateExpression(mathJs1);
    const parsed2 = evaluateExpression(mathJs2);

    // Test numerical equivalence at multiple points
    const testPoints = [-2, -1, 0, 1, 2, 3];
    const scope: Record<string, number> = {};

    for (const point of testPoints) {
      scope.x = point;
      const value1 = parsed1.evaluate(scope);
      const value2 = parsed2.evaluate(scope);

      if (Math.abs(value1 - value2) > 1e-10) {
        return false;
      }
    }

    return true;
  } catch (error) {
    throw new Error(`Error evaluating expressions: ${(error as Error).message}`);
  }
};