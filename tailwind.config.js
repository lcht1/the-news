/** @type {import('tailwindcss').Config} */

import { customTheme } from "./src/theme/customTheme";

export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: customTheme,
    },
    plugins: [],
};
