/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // 👈 This makes Tailwind scan all your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
