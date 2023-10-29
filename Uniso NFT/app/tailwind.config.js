/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        carrois: ['"Carrois Gothic SC"', "sans"],
        lato: ["Lato", "sans"],
        oxygen: ["Oxygen", "sans"],
      },
    },
  },
  plugins: [],
};
