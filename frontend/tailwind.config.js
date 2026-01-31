/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#0F4C81',
          DEFAULT: '#0F4C81',
        },
        teal: '#1F7A8C',
        green: {
          eco: '#2FB973',
          DEFAULT: '#2FB973',
        },
        mint: {
          soft: '#CFF6E4',
          DEFAULT: '#CFF6E4',
        },
        background: '#F6FBF9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
