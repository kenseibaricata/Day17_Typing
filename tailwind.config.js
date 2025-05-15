/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-black': '#000000',
        'terminal-green': '#00ff00',
        'terminal-green-dark': '#008800',
        'terminal-green-light': '#88ff88',
      },
      fontFamily: {
        'code': ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
} 