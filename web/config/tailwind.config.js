/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      error: '#e74c3c',
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
