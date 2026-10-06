/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        // Animação de pulsação neon
        neonPulse: {
          '0%': {
            'box-shadow': '0 0 5px #07D99D, 0 0 10px #07D99D, 0 0 15px #2924A6, 0 0 25px #2924A6',
            filter: 'drop-shadow(0 0 10px #07D99D) drop-shadow(0 0 20px #07D99D) drop-shadow(0 0 25px #2924A6) drop-shadow(0 0 35px #2924A6)'
          },
          '100%': {
            'box-shadow': '0 0 10px #07D99D, 0 0 20px #07D99D, 0 0 30px #2924A6, 0 0 50px #2924A6',
            filter: 'drop-shadow(0 0 20px #07D99D) drop-shadow(0 0 35px #07D99D) drop-shadow(0 0 50px #2924A6) drop-shadow(0 0 70px #2924A6)'
          },
        },
        // Animação de gradiente deslizante (luz percorrendo a borda)
        neonSlide: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '200% 50%' },
        },
      },
      animation: {
        neonPulse: 'neonPulse 2.5s ease-in-out infinite alternate',
        neonSlide: 'neonSlide 3s linear infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
