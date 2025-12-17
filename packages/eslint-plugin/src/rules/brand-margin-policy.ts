import type { Rule } from 'eslint';
import type { Node, Literal, TemplateLiteral, Expression, CallExpression, ArrayExpression } from 'estree';
import picomatch from 'picomatch';

interface JSXAttribute extends Node {
  type: 'JSXAttribute';
  name: {
    type: 'JSXIdentifier';
    name: string;
  };
  value: Literal | { type: 'JSXExpressionContainer'; expression: Node } | null;
}

interface JSXElement extends Node {
  type: 'JSXElement';
  openingElement: {
    type: 'JSXOpeningElement';
    name: {
      type: 'JSXIdentifier';
      name: string;
    };
    attributes: JSXAttribute[];
  };
}

interface RuleOptions {
  allowSection?: boolean;
  ignorePaths?: string[];
}

const MARGIN_REGEX = /\b(m|mx|my|mt|mr|mb|ml)-brand-\S+/g;

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce margin utilities only on semantic layout elements',
      recommended: true,
    },
    messages: {
      marginOnNonSemanticElement:
        'BrandPlan margin utilities are only allowed on semantic layout elements ({{allowed}}). Consider using gap-brand-* or padding instead.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowSection: {
            type: 'boolean',
            default: false,
          },
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
    const allowSection = options.allowSection ?? false;
    const ignorePaths = options.ignorePaths || [];

    // Check if current file should be ignored
    if (ignorePaths.length > 0) {
      const filename = context.getFilename();

      // Skip if filename is unknown or <input>
      if (!filename || filename === '<input>') {
        // Treat unknown filenames as not ignored
      } else {
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

    const allowedTags = ['main', 'header', 'footer'];
    if (allowSection) {
      allowedTags.push('section');
    }

    function extractClassNamesFromString(str: string): string[] {
      const classes: string[] = [];
      const matches = str.matchAll(MARGIN_REGEX);
      for (const match of matches) {
        classes.push(match[0]);
      }
      return classes;
    }

    function extractClassNamesFromExpression(expression: Node): string[] {
      const classes: string[] = [];

      // Handle string literals
      if (expression.type === 'Literal' && typeof expression.value === 'string') {
        classes.push(...extractClassNamesFromString(expression.value));
      }

      // Handle template literals
      if (expression.type === 'TemplateLiteral') {
        const template = expression as TemplateLiteral;
        template.quasis.forEach((quasi) => {
          if (quasi.value.raw) {
            classes.push(...extractClassNamesFromString(quasi.value.raw));
          }
        });
      }

      // Handle call expressions like cn(), clsx()
      if (expression.type === 'CallExpression') {
        const callExpr = expression as CallExpression;
        callExpr.arguments.forEach((arg) => {
          classes.push(...extractClassNamesFromExpression(arg as Node));
        });
      }

      // Handle array expressions
      if (expression.type === 'ArrayExpression') {
        const arrayExpr = expression as ArrayExpression;
        arrayExpr.elements.forEach((element) => {
          if (element) {
            classes.push(...extractClassNamesFromExpression(element as Node));
          }
        });
      }

      // Handle logical expressions (e.g., something && "class")
      if (expression.type === 'LogicalExpression') {
        const logicalExpr = expression as Expression & { right: Node; left: Node };
        classes.push(...extractClassNamesFromExpression(logicalExpr.right));
        classes.push(...extractClassNamesFromExpression(logicalExpr.left));
      }

      // Handle conditional expressions (e.g., condition ? "class1" : "class2")
      if (expression.type === 'ConditionalExpression') {
        const condExpr = expression as Expression & { consequent: Node; alternate: Node };
        classes.push(...extractClassNamesFromExpression(condExpr.consequent));
        classes.push(...extractClassNamesFromExpression(condExpr.alternate));
      }

      return classes;
    }

    return {
      JSXElement(node: Node): void {
        const element = node as JSXElement;
        const tagName = element.openingElement.name.name;

        // Only check if tag is NOT in allowed list
        if (allowedTags.includes(tagName)) {
          return;
        }

        // Find className attribute
        const classNameAttr = element.openingElement.attributes.find(
          (attr): attr is JSXAttribute =>
            attr.type === 'JSXAttribute' && attr.name?.name === 'className'
        );

        if (!classNameAttr || !classNameAttr.value) {
          return;
        }

        let marginClasses: string[] = [];

        // Handle string literals: className="m-brand-4"
        if (classNameAttr.value.type === 'Literal' && typeof classNameAttr.value.value === 'string') {
          marginClasses = extractClassNamesFromString(classNameAttr.value.value);
        }

        // Handle expressions: className={cn(...)}
        if (classNameAttr.value.type === 'JSXExpressionContainer') {
          const { expression } = classNameAttr.value;
          marginClasses = extractClassNamesFromExpression(expression);
        }

        // Report if margin classes found on non-semantic element
        if (marginClasses.length > 0) {
          context.report({
            node: classNameAttr,
            messageId: 'marginOnNonSemanticElement',
            data: {
              allowed: allowedTags.join(', '),
            },
          });
        }
      },
    };
  },
};

export default rule;
