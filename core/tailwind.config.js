import tailwindConfig from "../source/plugins/@themes/themes"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../source/plugins/**/*.{js,jsx,ts,tsx}", "../source/templates/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...tailwindConfig.theme.extend.colors,
      },
      aspectRatio: {
        ...tailwindConfig.theme.extend.aspectRatio,
      },
      gridTemplateColumns: {
        ...tailwindConfig.theme.extend.gridTemplateColumns,
      },
    },
  },
  plugins: [...tailwindConfig.plugins],
  corePlugins: {
    preflight: false,
  },
}
