/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-svelte"],
  printWidth: 100,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,

  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte"
      }
    }
  ]
};
