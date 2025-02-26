import { areExpressionsEquivalent } from '@/utils/check-answers';

describe('areExpressionsEquivalent', () => {
  describe('Basic algebraic expressions', () => {
    it('should correctly evaluate equivalent algebraic expressions', () => {
      expect(areExpressionsEquivalent('3x + 2', '2 + 3x')).toBe(true);
      expect(areExpressionsEquivalent('2(x + 1)', '2x + 2')).toBe(true);
      expect(areExpressionsEquivalent('x^2 + 2x + 1', '(x + 1)^2')).toBe(true);
      expect(areExpressionsEquivalent('3x + 3 - (x - 2)', '2x + 5')).toBe(true);
    });
  });

  describe('Fractions', () => {
    it('should correctly evaluate equivalent fractions', () => {
      expect(areExpressionsEquivalent('\\frac{2}{4}', '\\frac{1}{2}')).toBe(true);
      expect(areExpressionsEquivalent('2/4', '1/2')).toBe(true);
      expect(areExpressionsEquivalent('\\frac{2}{4} + \\frac{1}{6}', '\\frac{2}{3}')).toBe(true);
    });

    it('should enforce simplified fractions when required', () => {
      expect(areExpressionsEquivalent('\\frac{2}{4}', '\\frac{1}{2}', { requireSimplified: true })).toBe(false);
      expect(areExpressionsEquivalent('2/4', '1/2', { requireSimplified: true })).toBe(false);
      expect(areExpressionsEquivalent('\\frac{1}{2}', '\\frac{1}{2}', { requireSimplified: true })).toBe(true);
    });
  });

  describe('Factorization', () => {
    it('should correctly evaluate equivalent factorizations', () => {
      expect(areExpressionsEquivalent('(x-1)(x+1)', 'x^2 - 1')).toBe(true);
      expect(areExpressionsEquivalent('(x-2)(x+3)', 'x^2 + x - 6')).toBe(true);
    });

    it('should enforce complete factorization when required', () => {
      expect(areExpressionsEquivalent('(x^2-1)(x^2+1)', '(x-1)(x+1)(x^2+1)', { requireFullFactorization: true })).toBe(false);
      expect(areExpressionsEquivalent('(x-1)(x+1)(x^2+1)', '(x-1)(x+1)(x^2+1)', { requireFullFactorization: true })).toBe(true);
    });
  });

  describe('Multiple solutions', () => {
    it('should correctly evaluate equivalent solution sets', () => {
      expect(areExpressionsEquivalent('x = 4, x = -4', '{-4, 4}', { allowMultipleSolutions: true })).toBe(true);
      expect(areExpressionsEquivalent('x = 4, x = -4', 'S = {-4, 4}', { allowMultipleSolutions: true })).toBe(true);
      expect(areExpressionsEquivalent('{-4, 4}', 'S = {4, -4}', { allowMultipleSolutions: true })).toBe(true);
    });

    it('should fail when solution sets are not equivalent', () => {
      expect(areExpressionsEquivalent('x = 4, x = -4', 'x = 4', { allowMultipleSolutions: true })).toBe(false);
      expect(areExpressionsEquivalent('x = 4, x = -4, x = 0', '{-4, 4}', { allowMultipleSolutions: true })).toBe(false);
    });
  });

  describe('Domain restrictions', () => {
    it('should correctly evaluate equivalent domain restrictions', () => {
      expect(areExpressionsEquivalent('$x \in \mathbb{R} \setminus \{0\}$', '$x \in \mathbb{R} \setminus \{0\}$', { isDomainRestriction: true })).toBe(true);
    });
  });
  describe('Complex numbers', () => {
    it('should correctly evaluate equivalent complex numbers', () => {
      expect(areExpressionsEquivalent('3 + 4i', '3 + 4i', { isComplexNumber: true })).toBe(true);
      expect(areExpressionsEquivalent('3 + 4i', '3+4i', { isComplexNumber: true })).toBe(true);
      expect(areExpressionsEquivalent('(3 + 4i) + (2 - 3i)', '5 + i', { isComplexNumber: true })).toBe(true);
    });

  });

  describe('Square roots and other functions', () => {
    it('should correctly evaluate equivalent expressions with square roots', () => {
      expect(areExpressionsEquivalent('\\sqrt{8}', '2\\sqrt{2}')).toBe(true);
      expect(areExpressionsEquivalent('\\sqrt{16}', '4')).toBe(true);
    });

    it('should correctly evaluate equivalent trigonometric expressions', () => {
      expect(areExpressionsEquivalent('\\sin^2(x) + \\cos^2(x)', '1')).toBe(true);
      expect(areExpressionsEquivalent('\\sin(0)', '0')).toBe(true);
      expect(areExpressionsEquivalent('\\cos(0)', '1')).toBe(true);
    });

    it('should correctly evaluate equivalent logarithmic expressions', () => {
      expect(areExpressionsEquivalent('\\log_{10}(100)', '2')).toBe(true);
      expect(areExpressionsEquivalent('\\ln(e)', '1')).toBe(true);
      expect(areExpressionsEquivalent('e^{\\ln(5)}', '5')).toBe(true);
    });
  });

  describe('Integrals', () => {
    it('should correctly evaluate equivalent integral expressions', () => {
      expect(areExpressionsEquivalent('\\int x^2 dx', '\\frac{x^3}{3} + C', { isIntegral: true })).toBe(true);
      expect(areExpressionsEquivalent('\\int 2x dx', 'x^2 + C', { isIntegral: true })).toBe(true);
    });
  });


  describe('Edge cases', () => {
    it('should handle whitespace and formatting differences', () => {
      expect(areExpressionsEquivalent('3x + 2', '3x+2')).toBe(true);
      expect(areExpressionsEquivalent('  3x  +  2  ', '3x+2')).toBe(true);
    });

    it('should handle different multiplication symbols', () => {
      expect(areExpressionsEquivalent('3*x', '3x')).toBe(true);
      expect(areExpressionsEquivalent('3∗x', '3x')).toBe(true);
    });
  });
});