import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const browserGlobals = {
  Element: "readonly",
  FileReader: "readonly",
  HTMLElement: "readonly",
  console: "readonly",
  crypto: "readonly",
  document: "readonly",
  sessionStorage: "readonly",
  window: "readonly",
};

const nodeTestGlobals = {
  globalThis: "readonly",
};

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}", "data/**/*.js", "vite.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: "module",
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...browserGlobals,
        ...nodeTestGlobals,
      },
      sourceType: "module",
    },
  },
];
