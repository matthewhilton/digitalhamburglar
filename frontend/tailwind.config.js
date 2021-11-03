const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'display': ['Source Code Pro']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
