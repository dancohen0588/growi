/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Palette Growi - Unifiée avec globals.css
        growi: {
          lime: '#B4DD7F',      // Vert lime
          forest: '#1E5631',    // Vert sapin
          sand: '#F9F7E8',      // Beige sable (renommé pour cohérence)
          sun: '#F6C445',       // Jaune soleil
        },
        // Aliases pour compatibility avec le CSS existant
        lime: '#B4DD7F',
        forest: '#1E5631',
        beige: '#F9F7E8',
        sun: '#F6C445',
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
      fontFamily: {
        'poppins': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'raleway': ['Raleway', 'ui-sans-serif', 'system-ui'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#374151',
            h1: {
              color: '#1E5631',
              fontFamily: 'Poppins',
            },
            h2: {
              color: '#1E5631',
              fontFamily: 'Poppins',
            },
            h3: {
              color: '#1E5631',
              fontFamily: 'Poppins',
            },
            blockquote: {
              borderLeftColor: '#B4DD7F',
              backgroundColor: '#F9F7E8',
              padding: '1rem',
              borderRadius: '0.5rem',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            code: {
              backgroundColor: '#F9F7E8',
              color: '#1E5631',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // require("@tailwindcss/typography"), // Temporarily commented out - styles defined manually
  ],
}