import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        // Senin proje yapına (apps/web-client) uygun yollar:
        "./apps/web-client/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./apps/web-client/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./apps/web-client/components/**/*.{js,ts,jsx,tsx,mdx}",

        // Standart yollar (Garanti olsun diye ekliyoruz):
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
export default config;