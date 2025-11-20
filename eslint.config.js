import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import globals from "globals";
import js from "@eslint/js";
import { jsdoc } from "eslint-plugin-jsdoc";
import markdown from "@eslint/markdown";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  globalIgnores([
    "js/bundle.js",
    "package-lock.json",
    "rollup.config.js",
    "third-party/"
  ]),
  { files: ["**/*.css"], languageOptions: { tolerant: true }, plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.browser }
    },
    extends: [
      importX.recommended,
      js.configs.recommended,
      stylistic.configs.recommended
    ],
    rules: {
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error"
    }
  },
  jsdoc({
    files: ["src/**/*.js"],
    config: "flat/recommended",
    rules: {
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
  }),
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  }
]);
