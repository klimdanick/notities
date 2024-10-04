// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
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