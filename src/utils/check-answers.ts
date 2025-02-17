import * as math from "mathjs";
import { convertLatexToAsciiMath } from "mathlive";

const customMath = math.create(math.all, {});

customMath.import(
  {
    ln: (x: number) => Math.log(x),
    log: (x: number, base: number = 10) => Math.log(x) / Math.log(base),
    exp: (x: number) => Math.exp(x),
  },
  { override: true }
);

const normalizeMultiplication = (expr: string): string => {
  return expr.replace(/∗/g, "*"); // replace Unicode multiplication sign with standard asterisk
};

const evaluateExpression = (expr: string): math.MathNode => {
  try {
    return customMath.parse(expr);
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
    let mathJs1 = convertLatexToAsciiMath(expression1);
    let mathJs2 = convertLatexToAsciiMath(expression2);

    mathJs1 = normalizeMultiplication(mathJs1);
    mathJs2 = normalizeMultiplication(mathJs2);

    const parsed1 = evaluateExpression(mathJs1);
    const parsed2 = evaluateExpression(mathJs2);

    // for algebraic expressions, compare the simplified forms
    const simplified1 = customMath.simplify(parsed1).toString();
    const simplified2 = customMath.simplify(parsed2).toString();

    if (simplified1 === simplified2) {
      return true;
    }

    // for numeric expressions, evaluate and compare
    const scope = { x: 1, y: 2, z: 3 };
    const result1 = parsed1.evaluate(scope);
    const result2 = parsed2.evaluate(scope);

    return Math.abs(result1 - result2) < 1e-10; // compare with small tolerance for floating-point arithmetic
  } catch (error) {
    console.error("Error evaluating expressions:", error);
    throw error;
  }
};
