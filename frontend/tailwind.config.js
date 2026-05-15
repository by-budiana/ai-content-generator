/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],

  // Mengaktifkan fitur dark mode berdasarkan class atau preferensi sistem
  darkMode: 'media', 
  theme: {
    extend: {
      colors: {
        // Warna utama sesuai identitas brand yang kamu tentukan
        accent: "#aa3bff",
        "accent-bg": "rgba(170, 59, 255, 0.1)",
        "accent-border": "rgba(170, 59, 255, 0.5)",
        "text-h": "#08060d",
      },
      fontFamily: {
        // Menggunakan Inter dan Montserrat untuk kesan high-fidelity
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        // Animasi halus untuk logo React agar tidak kaku
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      backdropBlur: {
        // Mendukung efek glassmorphism pada kartu hasil generate
        xs: '2px',
      }
    },
  },
  plugins: [],
}