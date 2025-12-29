/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Posten Bring inspireret palette
                brand: {
                    50: '#f2f9f0',  // Meget lys grøn baggrund
                    100: '#e1f2dc', // Lys grøn
                    500: '#7bc144', // Bring Green (Primær handling)
                    600: '#5da62a', // Hover state
                    700: '#3a6e1d', // Active/Dark state
                    900: '#2c2c2c', // Bring Black/Dark Grey (Tekst)
                },
                // Enterprise UI gråtoner til borders og baggrunde
                ui: {
                    50: '#f8f8f8',
                    100: '#eef1f3',
                    200: '#cfd8dc', // Border color
                    800: '#2c2c2c', // Primary Text
                }
            },
            fontFamily: {
                // Vi holder Inter, da det minder om Posten Sans
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}