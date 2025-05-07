
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-2xl font-sora font-bold">
            <span className="text-interview-primary">Interview</span>
            <span className="text-interview-blue">Xpert</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-gray-700 hover:text-interview-primary transition-colors">How it Works</a>
          <a href="#features" className="text-gray-700 hover:text-interview-primary transition-colors">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-interview-primary transition-colors">Pricing</a>
          <a href="#faqs" className="text-gray-700 hover:text-interview-primary transition-colors">FAQs</a>
          <a href="#" className="text-interview-primary font-medium hover:text-interview-violet transition-colors">Login</a>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all shadow-sm">
            Start Your Mock Interview
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 right-0 p-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-interview-primary py-2">How it Works</a>
            <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-interview-primary py-2">Features</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-interview-primary py-2">Pricing</a>
            <a href="#faqs" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-interview-primary py-2">FAQs</a>
            <a href="#" onClick={() => setIsOpen(false)} className="text-interview-primary font-medium py-2">Login</a>
            <Button onClick={() => setIsOpen(false)} className="bg-gradient-primary w-full">
              Start Your Mock Interview
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
