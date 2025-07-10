// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'text-[480px]',
    'text-[30rem]',
  ],
 theme: {
    extend: {
      fontFamily: {
        fun: ['"Luckiest Guy"', 'cursive'],
      },
    },
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ['font-fun'],
  plugins: [],
};
