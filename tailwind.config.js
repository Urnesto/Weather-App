/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        cats: "url('../src/assets/bg/background.svg')",
      },
      colors: {
        primary: "#6919FF",
        neutrals: {
          50: "#F8FAFC",
          300: "#CBD5E1",
          400: "#94A3B8",
          700: "#292961",
          800: "#1C1B45",
          900: "#12112C",
        },
      },
    },
  },
  plugins: [
    // ...
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
