import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		screens: {
  			xs: '360px',
        xss: '450px'
  		},
  		container: {
  			center: true,
  			padding: '1rem'
  		},
  		fontFamily: {
  			montserrat: [
  				'Montserrat',
  				'sans-serif'
  			],
  			poppins: [
  				'Poppins',
  				'sans-serif'
  			]
  		},
  		colors: {
  			accent: '#3a69ff',
  			background: '#212428',
  			text: '#fff',
        foreground: "#ffffff",
        muted: "#e5e7eb",
        mutedforeground: "#4b5563",
        dforeground: "#1f2937",
        dmuted: "#374151",
        dmutedforeground: "#d1d5db",
        dbackground: "#f3f4f6",

  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-dot-thick": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
      require("tailwindcss-animate")
],
} satisfies Config;


// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}