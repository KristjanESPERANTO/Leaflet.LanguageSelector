import eslintPluginJs from "@eslint/js";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import { flatConfigs } from "eslint-plugin-import-x";
import globals from "globals";

const config = [
  eslintPluginJs.configs.all,
  flatConfigs.recommended,
  ...eslintPluginJsonc.configs["flat/recommended-with-json"],
  {
    ignores: [
      "js/bundle.js",
      "package-lock.json",
      "rollup.config.js",
      "third-party/"
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node
      },
      sourceType: "module"
    },
    plugins: {
      ...eslintPluginStylistic.configs.recommended.plugins
    },
    rules: {
      ...eslintPluginStylistic.configs.recommended.rules,
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/function-paren-newline": "off",
      "@stylistic/implicit-arrow-linebreak": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/multiline-ternary": "off",
      "@stylistic/object-property-newline": "off",
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "complexity": "off",
      "curly": ["error", "multi-line"],
      "func-style": "off",
      "id-length": ["error", { exceptions: ["i", "L"] }],
      "import-x/no-unresolved": ["error", { ignore: ["eslint-plugin-package-json/configs/recommended"] }],
      "init-declarations": "off",
      "max-depth": ["warn", 5],
      "max-lines": ["warn", 500],
      "max-lines-per-function": ["warn", 200],
      "max-params": ["warn", 5],
      "max-statements": "off",
      "no-await-in-loop": "off",
      "no-console": "off",
      "no-inline-comments": "off",
      "no-magic-numbers": "off",
      "no-param-reassign": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "no-underscore-dangle": "off",
      "no-use-before-define": "off",
      "no-warning-comments": "off",
      "one-var": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "require-atomic-updates": "off",
      "sort-keys": "off"
    }
  },
  {
    files: ["src/**/*.js"],
    plugins: {
      jsdoc: eslintPluginJsdoc
    },
    rules: {
      ...eslintPluginJsdoc.configs["flat/recommended"].rules,
      // Require JSDoc for functions (not methods starting with _)
      "jsdoc/require-jsdoc": ["warn", {
        checkGetters: false,
        checkSetters: false,
        enableFixer: false,
        exemptEmptyConstructors: true,
        exemptEmptyFunctions: false,
        publicOnly: false,
        require: {
          ArrowFunctionExpression: false,
          ClassDeclaration: true,
          ClassExpression: false,
          FunctionDeclaration: true,
          FunctionExpression: false,
          MethodDefinition: false
        }
      }],
      // Make these warnings for gradual adoption
      "jsdoc/require-param": "warn",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-returns": "warn",
      "jsdoc/require-returns-description": "warn"
    }
  },
  {
    files: ["**/*.json"],
    rules: {
      "max-lines": "off"
    }
  }
];

export default config;
