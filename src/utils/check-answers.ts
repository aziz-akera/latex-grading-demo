import * as math from "mathjs";

const latexToMathJs = (latex: string): string => {
  latex = latex.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, "($1)/($2)");

  latex = latex
    .replace(/\\times/g, "*")
    .replace(/\\cdot/g, "*")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\[{}]/g, "");

  return latex;
};

const evaluateExpression = (expr: string): math.MathNode => {
  try {
    return math.parse(expr);
  } catch (error) {
    throw new Error(
      `Failed to parse expression: ${expr}. ${(error as Error).message}`
    );
  }
};

export const areExpressionsEquivalent = (
  expression1: string,
  expression2: string
): boolean => {
  try {
    const mathJs1 = latexToMathJs(expression1);
    const mathJs2 = latexToMathJs(expression2);

    const parsed1 = evaluateExpression(mathJs1);
    const parsed2 = evaluateExpression(mathJs2);

    // for algebraic expressions, compare the simplified forms
    const simplified1 = math.simplify(parsed1).toString();
    const simplified2 = math.simplify(parsed2).toString();

    if (simplified1 === simplified2) {
      return true;
    }

    // for numeric expressions, evaluate and compare
    const scope = { x: 1 };
    const result1 = parsed1.evaluate(scope);
    const result2 = parsed2.evaluate(scope);

    return Math.abs(result1 - result2) < 1e-10; // compare with small (or big) tolerance for floating-point arithmetic
  } catch (error) {
    console.error("Error evaluating expressions:", error);
    throw error;
  }
};
