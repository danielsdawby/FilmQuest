/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Добавляем поддержку темной темы через класс
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        dark: "#06070E",
        accent: "#121426",
        light: {
          bg: "#ffffff",
          accent: "#f3f4f6",
          text: "#111827"
        }
      },
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1240px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
}