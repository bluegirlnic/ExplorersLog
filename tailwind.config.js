/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Natural, muted earth tones
        earth: {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e1d7c7',
          300: '#cabda4',
          400: '#b3a082',
          500: '#8b7355',
          600: '#6b5744',
          700: '#534535',
          800: '#3d332a',
          900: '#2a2219',
        },
        forest: {
          50: '#f3f6f4',
          100: '#e1ebe5',
          200: '#c3d7cb',
          300: '#9dbcaa',
          400: '#739985',
          500: '#527864',
          600: '#3f5f4e',
          700: '#334d40',
          800: '#2b3f35',
          900: '#25352e',
        },
        sky: {
          50: '#f5f8fa',
          100: '#e8f0f5',
          200: '#cfe1eb',
          300: '#a8c9db',
          400: '#7dabc4',
          500: '#5a8ba8',
          600: '#46708c',
          700: '#3a5a72',
          800: '#334d5f',
          900: '#2e4251',
        },
        trail: {
          50: '#faf9f7',
          100: '#f2eeea',
          200: '#e3dcd4',
          300: '#cfc2b5',
          400: '#b5a090',
          500: '#96806d',
          600: '#7a6757',
          700: '#635349',
          800: '#54463e',
          900: '#483d37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
