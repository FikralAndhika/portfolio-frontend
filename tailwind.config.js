/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#020408',
          dark: '#060d14',
          navy: '#0a1628',
          blue: '#0f2744',
          cyan: '#00d4ff',
          'cyan-dim': '#0099bb',
          neon: '#00ff88',
          'neon-dim': '#00cc6a',
          magenta: '#ff006e',
          'magenta-dim': '#cc0055',
          yellow: '#ffbe00',
          purple: '#7c3aed',
          'purple-bright': '#a855f7',
          grid: '#0d2137',
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        display: ['"Rajdhani"', '"Orbitron"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 3s linear infinite',
        'scan': 'scan 4s linear infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'border-run': 'borderRun 2s linear infinite',
        'typing': 'typing 3s steps(30) infinite',
        'blink': 'blink 1s step-end infinite',
        'radar': 'radar 3s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 22%, 24%, 55%': { opacity: '0.4' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88' },
          '50%': { boxShadow: '0 0 10px #00ff88, 0 0 25px #00ff88, 0 0 50px #00ff88' },
        },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 20px #00d4ff' },
          '50%': { boxShadow: '0 0 10px #00d4ff, 0 0 30px #00d4ff, 0 0 60px #00d4ff' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        borderRun: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        typing: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        'cyber-grid-lg': "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
        'neon-gradient': 'linear-gradient(135deg, #00d4ff, #00ff88)',
        'cyber-gradient': 'linear-gradient(135deg, #060d14, #0a1628)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
        'glow-neon': 'radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid-sm': '30px 30px',
        'grid-lg': '60px 60px',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00d4ff, 0 0 20px #00d4ff, 0 0 40px rgba(0,212,255,0.3)',
        'neon-green': '0 0 5px #00ff88, 0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.3)',
        'neon-magenta': '0 0 5px #ff006e, 0 0 20px #ff006e, 0 0 40px rgba(255,0,110,0.3)',
        'inner-cyan': 'inset 0 0 30px rgba(0,212,255,0.05)',
        'cyber-card': '0 0 0 1px rgba(0,212,255,0.1), 0 4px 24px rgba(0,0,0,0.5)',
      },
      dropShadow: {
        'neon-cyan': ['0 0 6px #00d4ff', '0 0 12px #00d4ff'],
        'neon-green': ['0 0 6px #00ff88', '0 0 12px #00ff88'],
      },
      borderColor: {
        'cyber-cyan': 'rgba(0,212,255,0.3)',
        'cyber-green': 'rgba(0,255,136,0.3)',
      }
    },
  },
  plugins: [],
}
