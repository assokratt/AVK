/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-primary': '#1e3a8a',
        'blue-secondary': '#3b82f6',
      }
    },
  },
  plugins: [],
}
