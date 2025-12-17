import type { Rule } from 'eslint';
import type { Node, Literal, TemplateLiteral } from 'estree';
import picomatch from 'picomatch';

interface JSXAttribute extends Node {
  type: 'JSXAttribute';
  name: {
    type: 'JSXIdentifier';
    name: string;
  };
  value: Literal | { type: 'JSXExpressionContainer'; expression: Node } | null;
}

interface RuleOptions {
  ignorePaths?: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce brand-prefixed utilities for design-critical properties and allow layout utilities only',
      recommended: true,
    },
    messages: {
      forbiddenClass:
        'Non-brand utility "{{className}}" is not allowed. Use brand-prefixed utilities (e.g., {{suggestion}}) or layout utilities only.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePaths: {
            type: 'array',
            items: {
              type: 'string',
            },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options: RuleOptions = context.options[0] || {};
    const ignorePaths = options.ignorePaths || [];

    // Check if current file should be ignored
    if (ignorePaths.length > 0) {
      const filename = context.getFilename();

      // Treat empty or <input> filenames as unknown - do NOT ignore them
      if (filename && filename !== '<input>') {
        // Normalize path separators to forward slashes
        const normalizedFilename = filename.replace(/\\/g, '/');

        // Check if any pattern matches
        const isIgnored = ignorePaths.some((pattern) => {
          const matcher = picomatch(pattern);
          return matcher(normalizedFilename);
        });

        if (isIgnored) {
          return {}; // Skip all checks for this file
        }
      }
    }
    // Layout utilities that are allowed (structural, not brand-critical)
    const allowedPrefixes = [
      // Display & Layout
      'flex',
      'grid',
      'block',
      'inline',
      'hidden',
      'visible',
      'invisible',
      // Sizing (width/height/max/min)
      'w-',
      'h-',
      'max-w-',
      'max-h-',
      'min-w-',
      'min-h-',
      'size-',
      // Positioning
      'static',
      'fixed',
      'absolute',
      'relative',
      'sticky',
      'top-',
      'right-',
      'bottom-',
      'left-',
      'inset-',
      'z-',
      // Flexbox & Grid
      'items-',
      'justify-',
      'content-',
      'self-',
      'place-',
      'flex-',
      'grow',
      'shrink',
      'basis-',
      'order-',
      'col-',
      'row-',
      'grid-cols-',
      'grid-rows-',
      'auto-cols-',
      'auto-rows-',
      // Container
      'container',
      'mx-auto',
      'my-auto',
      // Overflow
      'overflow-',
      'overscroll-',
      'truncate',
      'text-ellipsis',
      'text-clip',
      // Whitespace & breaks
      'whitespace-',
      'break-',
      // Cursor
      'cursor-',
      'pointer-events-',
      // Transitions (structural, not color)
      'transition',
      'duration-',
      'ease-',
      'delay-',
      // Opacity (when used for states, not color)
      'opacity-',
    ];

    // Brand-critical prefixes that MUST have "brand" in them
    const brandCriticalPrefixes = [
      'p-',       // padding
      'px-',
      'py-',
      'pt-',
      'pb-',
      'pl-',
      'pr-',
      'm-',       // margin
      'mx-',
      'my-',
      'mt-',
      'mb-',
      'ml-',
      'mr-',
      'gap-',     // gap
      'space-',   // space between
      'rounded-', // border radius
      'bg-',      // background
      'text-',    // text color (unless text-sm, text-lg etc. size)
      'border-',  // border color/width
      'ring-',    // ring color
      'shadow-',  // shadow
      'from-',    // gradient
      'via-',
      'to-',
    ];

    function checkClassName(classString: string, node: Node): void {
      const classes = classString.split(/\s+/).filter(Boolean);

      for (const className of classes) {
        // Skip brand-prefixed utilities
        if (className.includes('-brand-') || className.startsWith('brand-')) {
          continue;
        }

        // Check if it's an allowed layout utility
        const isAllowed = allowedPrefixes.some((prefix) =>
          className === prefix || className.startsWith(prefix)
        );

        if (isAllowed) {
          continue;
        }

        // Allow text-size utilities (structural, not brand-critical)
        // text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, etc.
        if (/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(className)) {
          continue;
        }

        // Check if it's a brand-critical utility without "brand" in it
        const isBrandCritical = brandCriticalPrefixes.some((prefix) =>
          className.startsWith(prefix)
        );

        if (isBrandCritical) {
          // Suggest brand version
          const suggestion = className.replace(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space|rounded|bg|text|border|ring|shadow|from|via|to)-/, '$1-brand-');

          context.report({
            node,
            messageId: 'forbiddenClass',
            data: {
              className,
              suggestion,
            },
          });
        }
      }
    }

    return {
      JSXAttribute(node: Node): void {
        const attr = node as JSXAttribute;

        // Only check className attributes
        if (attr.name?.name !== 'className') {
          return;
        }

        const { value } = attr;

        if (!value) {
          return;
        }

        // Handle string literals: className="flex p-4"
        if (value.type === 'Literal' && typeof value.value === 'string') {
          checkClassName(value.value, node);
        }

        // Handle template literals: className={`flex ${dynamic}`}
        if (value.type === 'JSXExpressionContainer') {
          const { expression } = value;

          if (expression.type === 'TemplateLiteral') {
            const template = expression as TemplateLiteral;
            template.quasis.forEach((quasi) => {
              if (quasi.value.raw) {
                checkClassName(quasi.value.raw, node);
              }
            });
          }

          // Handle string literals in expressions: className={"flex p-4"}
          if (expression.type === 'Literal' && typeof expression.value === 'string') {
            checkClassName(expression.value, node);
          }
        }
      },
    };
  },
};

export default rule;
