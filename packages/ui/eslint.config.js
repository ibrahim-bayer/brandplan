import tseslint from 'typescript-eslint';
import brandplan from '@brandplan/eslint-plugin';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      '@brandplan': brandplan,
    },
    rules: {
      '@brandplan/brand-classnames-only': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
