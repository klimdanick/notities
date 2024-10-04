// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // ESLint rules
      'no-unused-vars': 'warn', // Warn for unused variables (JavaScript)
      '@typescript-eslint/no-unused-vars': [
        'warn', 
        { 
          argsIgnorePattern: '^_', // Ignore unused args starting with _
          varsIgnorePattern: '^_', // Ignore unused vars starting with _
        }
      ],
      // Add any other rules you want to customize
      'prettier/prettier': 'error', // Make Prettier issues errors
    },
  }
);