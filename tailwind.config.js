/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#ffeb3b',
        'brand-black': '#0a0a0a',
      },
    },
  },
  plugins: [],
}
