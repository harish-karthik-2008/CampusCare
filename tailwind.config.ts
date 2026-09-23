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
        campus: {
          bg: "#E9ECF3",
          surface: "#EEF2F7",
          card: "#FFFFFF",
          input: "#F0F3F8",
          purple: "#7C52F6",
          purpleHover: "#6E4AF2",
          purpleLight: "#F1EDFD",
          text: "#1E1E1E",
          muted: "#717D96",
          border: "#E2E8F0",
        },
        status: {
          pending: "#F59E0B",
          pendingBg: "#FEF3C7",
          progress: "#3B82F6",
          progressBg: "#DBEAFE",
          resolved: "#10B981",
          resolvedBg: "#D1FAE5",
          closed: "#64748B",
          closedBg: "#F1F5F9",
          critical: "#EF4444",
          criticalBg: "#FEE2E2",
        },
      },
      borderRadius: {
        'card': '16px',
        'subtle': '12px',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'purple-glow': '0 4px 14px rgba(124, 82, 246, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
