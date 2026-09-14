/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F1115',
        surface: {
          DEFAULT: '#181B20',
          hover: '#21252C',
        },
        border: '#2A2E37',
        text: {
          primary: '#F5F6F7',
          secondary: '#A0A6B0',
          tertiary: '#6B7280',
        },
        accent: {
          light: '#FF9152',
          DEFAULT: '#F97316',
          hover: '#EA5F0A',
        },
        muted: {
          teal: '#4FB6AC',
          blue: '#6C8EBF',
          lavender: '#9B8AC4',
          gold: '#D9B85C',
          success: '#6FAE8C',
          danger: '#D9756B',
        },
        bodyPart: {
          chest: '#E08A5C',
          back: '#6C8EBF',
          shoulders: '#9B8AC4',
          legs: '#4FB6AC',
          arms: '#D9B85C',
          core: '#6FAE8C',
          cardio: '#D9756B',
          full_body: '#A0A6B0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
