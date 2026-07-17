import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

export default [
  {
    // Global ignores: must live in their own config object (no "files"/"rules" alongside)
    // for ESLint v9 flat config to treat this as an unconditional exclusion.
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
      // TypeScript's compiler already validates undefined identifiers/types (including
      // ambient globals from lib.dom.d.ts and @cloudflare/workers-types), which ESLint's
      // no-undef cannot see.
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
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
