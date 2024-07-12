/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
          neutral: "rgb(24, 24, 24)",
          accent: "rgb(255,143,0)",
          secondary: "rgb(122,0,194)",
        },
      },
      {
        halloween: {
          ...daisyUIThemes["halloween"],
          "base-100": "rgb(0,0,0)",
        },
      },
    ],
  },
};
