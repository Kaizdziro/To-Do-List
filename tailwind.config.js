/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./files/**/*.{html,js}"],
  theme: {
    extend: {
      screens:{
        '2sm' : '320px',
      },
    },  
  },
  plugins: [],
}

