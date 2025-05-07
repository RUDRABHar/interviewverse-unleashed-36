import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				interview: {
					primary: '#9b87f5', // Purple
					blue: '#0EA5E9',
					violet: '#805AD5',
					indigo: '#6366F1',
					light: '#EEF2FF',
					dark: '#1C1C1E',
					orange: '#FF6B00', // Additional orange color for accents
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(-15px) rotate(1deg)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-500% 0' },
					'100%': { backgroundPosition: '500% 0' }
				},
				'aurora': {
					'0%, 100%': { 
						backgroundPosition: '0% 50%',
						backgroundSize: '200% 200%'
					},
					'50%': { 
						backgroundPosition: '100% 50%',
						backgroundSize: '200% 200%'
					}
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'gradient-flow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					from: {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'scale-up': {
					from: {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'blob': {
					'0%': {
						transform: 'translate(0px, 0px) scale(1)'
					},
					'33%': {
						transform: 'translate(30px, -50px) scale(1.1)'
					},
					'66%': {
						transform: 'translate(-20px, 20px) scale(0.9)'
					},
					'100%': {
						transform: 'translate(0px, 0px) scale(1)'
					}
				},
				'ping-slow': {
					'75%, 100%': {
						transform: 'scale(2)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'shimmer': 'shimmer 8s ease-in-out infinite',
				'aurora': 'aurora 15s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'gradient-flow': 'gradient-flow 6s ease infinite',
				'spin-slow': 'spin-slow 10s linear infinite',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'slide-in-right': 'slide-in-right 0.4s ease-in-out',
				'scale-up': 'scale-up 0.3s ease-in-out',
				'blob': 'blob 7s infinite',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite'
			},
			backgroundImage: {
				'hero-pattern': 'url("/hero-pattern.svg")',
				'gradient-primary': 'linear-gradient(90deg, #9b87f5 0%, #a89af7 100%)',
				'gradient-blue': 'linear-gradient(90deg, #3B82F6 0%, #6366F1 100%)',
				'gradient-violet': 'linear-gradient(90deg, #805AD5 0%, #9F7AEA 100%)',
				'gradient-purple-blue': 'linear-gradient(135deg, #9b87f5 0%, #0EA5E9 100%)',
				'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
				'gradient-luxury': 'linear-gradient(135deg, rgba(249, 249, 255, 0.8) 0%, rgba(241, 241, 254, 0.8) 100%)',
				'gradient-premium': 'linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)'
			},
			boxShadow: {
				'glow': '0 0 15px rgba(155, 135, 245, 0.5)',
				'card': '0 10px 30px rgba(0, 0, 0, 0.1)',
				'button': '0 4px 14px rgba(155, 135, 245, 0.25)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
				'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
				'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -5px rgba(0, 0, 0, 0.05)',
				'luxury-lg': '0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.01)'
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'sora': ['Sora', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
