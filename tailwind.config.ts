import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    { pattern: /(bg|text|border)-(amber|orange|slate|white|black|gray|green|blue|red|yellow|emerald)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /(grid-cols|col-span|row-span)-\d+/ },
    { pattern: /gap-(0|1|2|3|4|5|6|8|10|12|16|20|24)/ },
    { pattern: /(p|m|px|py|mx|my|mt|mb|ml|mr)-(0|1|2|3|4|5|6|8|10|12|16|20|24)/ },
    { pattern: /rounded-(none|sm|md|lg|xl|2xl|3xl|full)/ },
    { pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)/ },
    { pattern: /font-(thin|light|normal|medium|semibold|bold|extrabold)/ },
    'container', 'mx-auto', 'prose', 'max-w-6xl', 'max-w-7xl',
    'card', 'btn', 'btn-primary', 'btn-outline', 'btn-secondary',
    'hero', 'hero-content', 'hero-overlay',
    'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
    'hover:shadow-lg', 'hover:opacity-90', 'hover:bg-gray-50',
    'transition', 'duration-300', 'ease-in-out'
  ],
  theme: { 
    extend: {
      colors: {
        primary: '#f59e0b',
        secondary: '#1e293b'
      }
    } 
  },
  plugins: []
}

export default config