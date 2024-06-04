import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
module.exports = {
  media: false,
  content: [
    "./public/index.html",
    "./src/scenes/**/*.{html,js}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [daisyui],
};
