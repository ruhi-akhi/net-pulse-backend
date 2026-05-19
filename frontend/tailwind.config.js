export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#020617',
          900: '#071018',
          800: '#0f172a',
          700: '#111827',
          600: '#0f766e',
          500: '#10b981'
        }
      },
      boxShadow: {
        glow: '0 0 50px rgba(16, 185, 129, 0.18)'
      }
    }
  },
  plugins: [],
};
