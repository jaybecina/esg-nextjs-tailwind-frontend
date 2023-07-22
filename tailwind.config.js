/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      "sans-pro": ["Source Sans Pro", "sans-serif"]
    },
    colors: {
      ...colors,
      "jll-red": "#E30613",
      "jll-red-light": "#ea4a53",
      "jll-gray": "#b1b2b4",
      "jll-gray-dark": "#626468",
      "jll-blue": "#18A0FB",
      "jll-green": "#478646",
      "jll-orange": "#ED700A",
      "jll-orange-light": "#F6B784",
      "jll-black": "#2c2c2c",
      "jll-brown": "#DBD6C7"
    },
    extend: {
      animation: {
        "alert-show": "alert-show 300ms ease-in-out",
        "fade-in": "fade-in 200ms ease-in-out",
        "fade-out": "fade-out 200ms ease-in-out",
      },
      keyframes: {
        "alert-show": {
          "0%": { transform: "translateX(110%)" },
          "50%": { transform: "translateX(-2rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "from": { opacity: "0%" },
          "to": { opacity: "100%" },
        },
        "fade-out": {
          "from": { opacity: "100%" },
          "to": { opacity: "0%" },
        }
      }
    },
  },
  plugins: [],
}