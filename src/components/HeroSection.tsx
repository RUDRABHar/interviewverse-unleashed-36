
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      direction: number;
    }[] = [];

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.9; // 90vh
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.min(50, window.innerWidth * 0.03);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const radius = Math.random() * 2 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: radius,
          color: i % 3 === 0 ? '#4D47C3' : i % 2 === 0 ? '#3B82F6' : '#8B5CF6',
          speed: Math.random() * 0.5 + 0.1,
          direction: Math.random() * 360
        });
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        
        // Move particles
        const radians = (particle.direction * Math.PI) / 180;
        particle.x += particle.speed * Math.cos(radians);
        particle.y += particle.speed * Math.sin(radians);
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.direction = (180 - particle.direction) % 360;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.direction = (360 - particle.direction) % 360;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    resizeCanvas();
    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 orb orb-violet animate-float" />
      <div className="absolute bottom-[10%] right-[5%] w-40 h-40 orb orb-blue animate-pulse-soft" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-bold mb-6">
              Your AI-Powered <br />
              <span className="gradient-text">Mock Interview Universe</span> <br />
              Awaits
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Practice. Improve. Get Hired — with real-time feedback and personalized scenarios tailored by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="btn-primary">
                Start Free
              </Button>
              <Button variant="outline" className="btn-secondary group">
                See it in Action
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Neural network visualization placeholder */}
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-interview-light to-white border border-white/50 shadow-xl flex items-center justify-center animate-spin-slow">
                <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-dashed border-interview-blue/30 flex items-center justify-center animate-spin-slow" style={{ animationDirection: 'reverse' }}>
                  <div className="absolute w-1/2 h-1/2 rounded-full border-2 border-dashed border-interview-violet/50" />
                </div>
                
                {/* Core orb */}
                <div className="absolute w-24 h-24 bg-gradient-primary rounded-full shadow-glow flex items-center justify-center animate-pulse-soft">
                  <span className="text-white font-bold">AI</span>
                </div>
                
                {/* Orbiting nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <div 
                    key={i}
                    className="absolute w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
                    style={{ 
                      transform: `rotate(${angle}deg) translateX(150px) rotate(-${angle}deg)`,
                      animation: `floating ${5 + i}s infinite ease-in-out ${i * 0.5}s`
                    }}
                  >
                    <span className="text-xs font-medium text-interview-primary">
                      {['Tech', 'HR', 'Soft', 'Logic', 'Comm', 'Skills'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
