const js = require("@eslint/js")
const typescript = require("@typescript-eslint/eslint-plugin")
const parser = require("@typescript-eslint/parser")
const react = require("eslint-plugin-react")
const reactHooks = require("eslint-plugin-react-hooks")
const prettier = require("eslint-plugin-prettier")
const globals = require("globals")

module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/npm-only-allow/**",
      "**/.next/**",
    ],
    languageOptions: {
      parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: true,
        React: true,
        NodeJS: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "prettier/prettier": ["error", {}, { usePrettierrc: true }],
      "react/react-in-jsx-scope": "off",
      "no-undef": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react/prop-types": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]
