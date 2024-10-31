import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettier,
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } }, globals: globals.browser } },
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
      "react/react-in-jsx-scope": "error",
      "no-console": "warn",
      quotes: ["error", "double", { avoidEscape: true }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          vars: "all",
          args: "after-used",
          caughtErrors: "none",
        },
      ],
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
