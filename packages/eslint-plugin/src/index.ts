import brandClassnamesOnly from './rules/brand-classnames-only.js';

const plugin = {
  meta: {
    name: '@brandplan/eslint-plugin',
    version: '0.1.0',
  },
  rules: {
    'brand-classnames-only': brandClassnamesOnly,
  },
  configs: {
    recommended: {
      plugins: ['@brandplan'],
      rules: {
        '@brandplan/brand-classnames-only': 'error',
      },
    },
  },
};

export default plugin;
