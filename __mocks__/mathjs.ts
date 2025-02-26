/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

export const create = jest.fn().mockReturnValue({
    import: jest.fn(),
    parse: jest.fn().mockImplementation((expr) => ({
      evaluate: jest.fn().mockReturnValue(1), // Mock return value for evaluate
      toString: jest.fn().mockReturnValue(expr),
    })),
    simplify: jest.fn().mockImplementation((expr) => ({
      toString: jest.fn().mockReturnValue(expr.toString()),
    })),
    evaluate: jest.fn().mockImplementation((expr) => {
      // Simple mock implementation for evaluate
      if (typeof expr === 'string' && expr.includes('i')) {
        return { re: 1, im: 1 }; // Mock complex number
      }
      return 1; // Default mock return
    }),
    complex: jest.fn().mockReturnValue({ re: 0, im: 1 }),
  });
  
  export const all = {};