/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary - Violet/Indigo range
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    light: 'rgb(var(--color-primary-light) / <alpha-value>)',
                    dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
                    foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
                },
                // Secondary - Slate/Zinc
                secondary: {
                    DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
                    light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
                    dark: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
                },
                // Background colors
                background: {
                    DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
                    paper: 'rgb(var(--color-background-paper) / <alpha-value>)',
                    subtle: 'rgb(var(--color-background-subtle) / <alpha-value>)',
                },
                // Surface/Card colors
                surface: {
                    DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
                    hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
                    active: 'rgb(var(--color-surface-active) / <alpha-value>)',
                },
                // Semantic colors
                success: 'rgb(var(--color-success) / <alpha-value>)',
                error: 'rgb(var(--color-error) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                info: 'rgb(var(--color-info) / <alpha-value>)',

                // Border colors
                border: {
                    DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
                    light: 'rgb(var(--color-border-light) / <alpha-value>)',
                },
                // Text colors
                text: {
                    primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
                    muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
                }
            },
        },
    },
    plugins: [],
};
