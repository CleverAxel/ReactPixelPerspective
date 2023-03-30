/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      inter : ["Inter", "sans-serif"],
      open : ["Open Sans", "sans-serif"],
      press : ["'Press Start 2P'", "cursive"]
    },
    extend: {
      colors : {
        "header" : {
          100 : "#1c459c",
        }
      }
    },
  },
  plugins: [],
}
