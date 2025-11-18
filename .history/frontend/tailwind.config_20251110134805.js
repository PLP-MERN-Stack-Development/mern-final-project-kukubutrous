
//frontend/tailwind.config.css

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brightGreen: "#22c55e",
        brightPink: "#ec4899",
      },
    },
  },
  plugins: [],
};
