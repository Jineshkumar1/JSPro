import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1E1E1E",
        card: "#2A2A2A",
        accent: "#FF4B6E",
        success: "#00C853",
        error: "#FF3D00",
        "text-primary": "#FFFFFF",
        "text-secondary": "#8F8F8F",
      },
      maxWidth: {
        container: "1200px",
      },
      width: {
        sidebar: "240px",
      },
      spacing: {
        section: "24px",
        internal: "16px",
        sidebar: "240px",
      },
      screens: {
        desktop: "1200px",
        tablet: "992px",
        mobile: "768px",
        small: "576px",
      },
    },
  },
  plugins: [],
};

export default config;
