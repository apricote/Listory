const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    // css is purged via postcss-purgecss
    enabled: false,
  },
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      black: "#000",
      white: "#fff",

      // Tailwind v1 Colors
      gray: {
        100: "#f7fafc",
        200: "#edf2f7",
        300: "#e2e8f0",
        400: "#cbd5e0",
        500: "#a0aec0",
        600: "#718096",
        700: "#4a5568",
        800: "#2d3748",
        900: "#1a202c",
      },

      green: {
        100: "#f0fff4",
        200: "#c6f6d5",
        300: "#9ae6b4",
        400: "#68d391",
        500: "#48bb78",
        600: "#38a169",
        700: "#2f855a",
        800: "#276749",
        900: "#22543d",
      },

      yellow: colors.yellow,
    },
  },
};
