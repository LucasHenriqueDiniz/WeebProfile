import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    rules: {
      quotes: ["error", "double", { avoidEscape: true }],
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",
      "react/jsx-no-duplicate-props": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
    },
  },
]
