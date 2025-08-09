import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    { pattern: /(bg|text|border)-(amber|orange|gray|green|red)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /(grid-cols|col-span)-\d+/ },
    { pattern: /(p|px|py|m|mx|my)-\d+/ },
    { pattern: /(rounded|rounded-[a-z]+)-\w+/ }
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config