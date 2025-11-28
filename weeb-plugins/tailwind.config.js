/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Exclude preview files and generated files
    '!./src/**/previews/**',
    '!./src/**/*.svg',
    '!./src/styles/**/*.css', // Exclude CSS files themselves
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Plugin to add 'half:' variant that applies when #svg-main has class "half"
    function ({ addVariant }) {
      addVariant('half', '#svg-main.half &')
    },
  ],
  // Disable default styles to only generate utilities
  corePlugins: {
    preflight: false,
    container: false, // Disable container utility (not used)
  },
  // Safelist for arbitrary values that might not be detected
  // Note: Tailwind automatically detects classes used in code, so we only need
  // to safelist classes that are dynamically generated or used in ways Tailwind can't detect
  safelist: [
    // Arbitrary text sizes (used in components)
    'text-[8px]',
    'text-[10px]',
    'text-[11px]',
    'text-[12px]',
    'text-[0.75rem]',
    // Half mode variants (used in responsive components)
    'half:grid-cols-4',
    'half:grid-cols-5',
    'half:grid-cols-10',
    'half:line-clamp-2',
    'half:flex-col',
    'half:hidden',
  ],
}

