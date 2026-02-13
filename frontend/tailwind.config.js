/** @type {import('tailwindcss').Config} */
// Force reload
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F4C81',
        accent: '#2FB973',
        background: '#F6FBF9',
        'soft-green': '#E8F5EE',
        'dark-blue': '#0A3D68',
        'green-eco': '#2FB973',
        'primary-blue': '#0F4C81',
        'teal': '#2FB973',
        'green': '#2FB973',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
