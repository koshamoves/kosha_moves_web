import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily:{
        "dm-sans": ['var(--font-dm-sans)'],
        "source-sans": ['var(--font-source-sans)'],
        "poppins": ['var(--font-poppins)']
      },
      screens: {
        'custom-496': '496px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        white: {
          100: "#FFFFFF",
          200: "#FAFBFC",
          300: "#F0F0F2",
          400: "#E0E5F2",
          500: "#FAFCFE"
        },
        blue: {
          100: "#27446E",
          200: "#2B3674",
          300: "#707EAE"
        },
        grey: {
          100: "#A3AED0",
          200: "#A6A6A6",
          300: "#7D7D7D",
          400: "#AAAAAA",
          500: "#DFDFDF",
          600: "#858B94",
          700: "#E9E9E9",
          800: "#C4C4C4"
        },
        green: {
          100: "#19B000",
          200: "#34A853"
        },
        orange: {
          100: "#C29C80"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "calc(var(--radius) + 120px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'yellow-gradient': 'linear-gradient(180deg, #FFFFFF 10%, #F6DF9C 100%)',
        'virtual-card': "url('/images/virtual-card-pg.png')"
      },
      boxShadow: {
        'custom': '14px 17px 40px 4px #7090B014',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config