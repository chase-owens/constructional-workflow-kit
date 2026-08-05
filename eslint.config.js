import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/.nx/**",
      "**/.svelte-kit/**",
      "**/build/**",
      "**/cdk.out/**",
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**"
    ]
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],

  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    plugins: {
      "simple-import-sort": simpleImportSort
    },

    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error"
    }
  },

  {
    files: ["**/*.svelte"],

    languageOptions: {
      globals: {
        ...globals.browser
      }
    },

    plugins: {
      "simple-import-sort": simpleImportSort
    },

    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error"
    }
  },

  eslintConfigPrettier
];
