/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "pixel-bg": "#0e0a16",
        "pixel-panel": "#e8dcb8",
        "pixel-panel-dark": "#d8caa0",
        "pixel-text": "#3a2a1a",
        "pixel-gold": "#b8863a",
        "pixel-gold-dark": "#8a5f26",
        "pixel-green": "#3d6630",
        "pixel-green-dark": "#2e4a26",
        "pixel-brown": "#6b4a2f",
      },
      fontFamily: {
        heading: ["Cinzel", "serif"],
        body: ["'EB Garamond'", "serif"],
      },
    },
  },
  plugins: [],
};