const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                blue: {
                    400: "#5A76AB",
                    600: "#2F80ED",
                },
                green: {
                    400: "#5FE487",
                    600: "#00D03F",
                },
                red: {
                    600: "#FB1B1B",
                },
                gray: {
                    700: "#333333",
                    600: "#4F4F4F",
                    500: "#828282",
                    400: "#BDBDBD",
                    300: "#E4E4E4",
                    200: "#F7F7F7",
                },
            },
        },
        fontFamily: {
            sans: ["Inter", ...defaultTheme.fontFamily.sans],
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
