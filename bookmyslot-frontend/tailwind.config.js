/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',       // Example: Indigo 600, adjust to your preferred color
        'primary-dark': '#4338ca', // Slightly darker shade
      },
    },
  },
  plugins: [],
};
