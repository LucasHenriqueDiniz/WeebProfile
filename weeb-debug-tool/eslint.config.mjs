import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

/**
 * Mirrors svg-generator's config. This package had none at all and sat outside the
 * root lint/typecheck scripts, which is how four real type errors survived here --
 * a port typed `string | number` that no app.listen overload accepts, an "error"
 * listener attached to the express app instead of the http server (so it never
 * fired), and a ReactNode assigned to a ReactElement.
 */
export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
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
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      // TypeScript already validates undefined identifiers, including ambient
      // globals ESLint's no-undef cannot see.
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      // This is a local development tool -- printing to the terminal is its job.
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
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
