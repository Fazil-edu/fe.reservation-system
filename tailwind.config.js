/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,js,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': {
                    DEFAULT: '#1a1a1a',
                    50: '#f5f5f5',
                    100: '#e6e6e6',
                    200: '#cccccc',
                    300: '#b3b3b3',
                    400: '#999999',
                    500: '#1a1a1a',
                    600: '#0d0d0d',
                    700: '#000000',
                },
            }
        },
    },
    plugins: [],
} 