/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                'matte-black': '#0B0E14',
                'matte-grey': '#121826',
                'border-subtle': '#232E40',
                'volt-green': '#DFFF00',
            }
        },
    },
    plugins: [],
}