// tailwind.config.js
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-[480px]',
    'text-[30rem]',
    'font-fun',
  ],
  theme: {
    extend: {
      fontFamily: {
        fun: ['"Luckiest Guy"', 'cursive'],
      },
      typography: (theme) => ({
        invert: {
          css: {
            color: theme("colors.gray.200"),
            h1: {
              color: theme("colors.white"),
              fontSize: theme("fontSize.6xl")[0], // text-6xl
              fontWeight: "800",
              marginBottom: "1rem",
            },
            h2: {
              color: theme("colors.white"),
              fontSize: theme("fontSize.4xl")[0], // text-4xl
              fontWeight: "700",
              marginBottom: "0.75rem",
            },
            h3: {
              color: theme("colors.white"),
              fontSize: theme("fontSize.2xl")[0], // text-2xl
              fontWeight: "600",
              marginBottom: "0.5rem",
            },
            p: {
              marginTop: "1rem",
              marginBottom: "1rem",
              lineHeight: "1.75",
            },
            a: {
              color: theme("colors.pink.400"),
              textDecoration: "underline",
              "&:hover": {
                color: theme("colors.pink.300"),
              },
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: theme("colors.gray.500"),
              color: theme("colors.gray.300"),
            },
            ul: {
              listStyleType: "disc",
              marginLeft: "1.5rem",
            },
            ol: {
              listStyleType: "decimal",
              marginLeft: "1.5rem",
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
