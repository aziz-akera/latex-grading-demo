/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
export const convertLatexToAsciiMath = jest.fn().mockImplementation((latex) => {
    // Simple mock implementation that just returns the input
    return latex;
  });