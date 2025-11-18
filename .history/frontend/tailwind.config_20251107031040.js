/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-50': '#f0fff5',
        'brand-100': '#dbffe8',
        'brand-200': '#b7ffd1',
        'brand-300': '#7efaa6',
        'brand-400': '#3ced6d',
        'brand-500': '#18c745',
        'brand-600': '#12a93a',
        'brand-700': '#0d852b',
        'brand-800': '#08681f',
        'brand-900': '#054b14'
      },
      borderRadius: {
        'xl-2': '1.25rem'
      }
    }
  },
  plugins: [],
}
