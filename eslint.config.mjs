// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules', 'dist', 'build', '*.js'],
    rules: {
      // ESLint rules
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
      ],
    },
  }
);