import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import brandplan from '@brandplan/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...tseslint.configs.recommended,
  {
    files: ['**/*.tsx', '**/*.ts'],
    plugins: {
      '@brandplan': brandplan,
    },
    rules: {
      '@brandplan/brand-classnames-only': 'error',
      '@brandplan/brand-margin-policy': 'error',
    },
  },
];

export default eslintConfig;
