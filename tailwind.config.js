/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'police-blue': '#004277',
        'police-blue-dark': '#00335c',
        'police-yellow': '#FFB81C',
      }
    },
  },
  plugins: [],
}
