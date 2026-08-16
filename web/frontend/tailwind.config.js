/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ports-teal': {
          DEFAULT: '#00B2E0',
          light: '#22ACB6',
          dark: '#1BB5B5',
        },
        'ports-orange': {
          DEFAULT: '#EE6E2A',
          light: '#FF8C42',
          dark: '#F15A24',
        },
        'ports-purple': {
          DEFAULT: '#9E005D',
        },
        'ports-green': {
          DEFAULT: '#00AB81',
        },
      },
      spacing: {
        '15': '3.75rem',
      },
    },
  },
  plugins: [],
}

