import brandClassnamesOnly from './rules/brand-classnames-only.js';
import brandMarginPolicy from './rules/brand-margin-policy.js';

const plugin = {
  meta: {
    name: '@brandplan/eslint-plugin',
    version: '0.1.0',
  },
  rules: {
    'brand-classnames-only': brandClassnamesOnly,
    'brand-margin-policy': brandMarginPolicy,
  },
  configs: {
    recommended: {
      plugins: ['@brandplan'],
      rules: {
        '@brandplan/brand-classnames-only': 'error',
        '@brandplan/brand-margin-policy': 'error',
      },
    },
  },
};

export default plugin;
