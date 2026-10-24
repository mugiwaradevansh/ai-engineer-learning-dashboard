/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF8F5',
        surface: {
          DEFAULT: '#FFFEFC',
          warm: '#FFFEFC',
          subtle: '#F3EFEF',
          border: '#EAE3EA',
          'border-strong': '#D8CDE0',
          dark: '#302D3D',
        },
        ink: {
          primary: '#302D3D',
          secondary: '#716C7D',
          muted: '#857F90',
        },
        brand: {
          DEFAULT: '#8072B8',
          primary: '#665397',
          hover: '#544280',
          light: '#EEE6FA',
        },
        bloom: {
          canvas: '#FAF8F5',
          surface: '#FFFEFC',
          text: '#302D3D',
          muted: '#716C7D',
          subtle: '#857F90',
          border: '#EAE3EA',
          'border-strong': '#D8CDE0',
          violet: '#665397',
          'violet-accent': '#8072B8',
          'violet-light': '#EEE6FA',
          blue: '#DDEBFA',
          'blue-ink': '#2B537D',
          'blue-border': '#C5DBF3',
          lavender: '#E9E1FA',
          'lavender-ink': '#54467A',
          'lavender-border': '#D7CBEB',
          mint: '#DDF1E7',
          'mint-ink': '#275A41',
          'mint-border': '#BEDDCB',
          peach: '#FCE3D7',
          'peach-ink': '#7A4226',
          'peach-border': '#F1C4AF',
          butter: '#FFF1CB',
          'butter-ink': '#785A10',
          'butter-border': '#F2DE98',
          rose: '#F3DFE8',
          'rose-ink': '#6F3A55',
          'rose-border': '#E4C6D6',
          sage: '#E4EBDD',
          'sage-ink': '#3D5C2E',
          'sage-border': '#CAD7C0',
        },
        // Phase 1 — Foundation
        phase1: {
          bg: '#E5EFFB',
          accent: '#3B689B',
          highlight: '#D5E5FA',
          border: '#C5DAF5',
        },
        // Phase 2 — Core AI Stack
        phase2: {
          bg: '#EEE6FA',
          accent: '#6D56A6',
          highlight: '#E2D5F6',
          border: '#D7C7F2',
        },
        // Phase 3 — Agents
        phase3: {
          bg: '#E1F1E6',
          accent: '#31785C',
          highlight: '#CBE7D4',
          border: '#BDDFC6',
        },
        // Phase 4 — Production
        phase4: {
          bg: '#FBE7DB',
          accent: '#A85E37',
          highlight: '#F6D5C0',
          border: '#F4CEB8',
        },
        // Distinct Pastel Palettes for Metric Cards
        pastel: {
          powder: '#DDEBFA',
          'powder-border': '#C5DBF3',
          'powder-text': '#2B537D',

          lavender: '#E9E1FA',
          'lavender-border': '#D7CBEB',
          'lavender-text': '#54467A',

          mint: '#DDF1E7',
          'mint-border': '#BEDDCB',
          'mint-text': '#275A41',

          peach: '#FCE3D7',
          'peach-border': '#F1C4AF',
          'peach-text': '#7A4226',

          butter: '#FFF1CB',
          'butter-border': '#F2DE98',
          'butter-text': '#785A10',

          rose: '#F3DFE8',
          'rose-border': '#E4C6D6',
          'rose-text': '#6F3A55',

          sage: '#E4EBDD',
          'sage-border': '#CAD7C0',
          'sage-text': '#3D5C2E',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          'Fraunces',
          'Georgia',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        bloom: '0 2px 8px -2px rgba(48, 45, 61, 0.05), 0 1px 4px -1px rgba(48, 45, 61, 0.03)',
        'bloom-card': '0 4px 16px -2px rgba(48, 45, 61, 0.07), 0 2px 6px -1px rgba(48, 45, 61, 0.04)',
        'bloom-elevated': '0 12px 28px -4px rgba(48, 45, 61, 0.1), 0 4px 12px -2px rgba(48, 45, 61, 0.05)',
        'bloom-modal': '0 24px 44px -6px rgba(48, 45, 61, 0.14), 0 12px 20px -4px rgba(48, 45, 61, 0.08)',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
