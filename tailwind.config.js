/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: { primary: "#0056b3", secondary: "#28a745" },
      borderRadius: {
        full: "9999px",
        button: "8px",
      },
    },
  },
  plugins: [],
}

