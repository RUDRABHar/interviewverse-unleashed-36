
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Check if user is signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleStartInterview = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-sora font-bold">
            <span className="text-interview-primary">Interview</span>
            <span className="text-interview-blue">Xpert</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-gray-700 hover:text-interview-primary transition-colors">How it Works</a>
          <a href="#features" className="text-gray-700 hover:text-interview-primary transition-colors">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-interview-primary transition-colors">Pricing</a>
          <a href="#faqs" className="text-gray-700 hover:text-interview-primary transition-colors">FAQs</a>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-interview-primary font-medium hover:text-interview-violet transition-colors">
                Dashboard
              </Link>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-interview-primary text-interview-primary hover:bg-interview-light"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-interview-primary font-medium hover:text-interview-violet transition-colors">
                Login
              </Link>
              <Button 
                onClick={handleStartInterview} 
                className="bg-gradient-primary hover:shadow-glow transition-all shadow-sm"
              >
                Start Your Mock Interview
              </Button>
            </>
          )}
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
            
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-interview-primary font-medium py-2">
                  Dashboard
                </Link>
                <Button onClick={() => {handleSignOut(); setIsOpen(false);}} variant="outline" className="w-full border-interview-primary text-interview-primary">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsOpen(false)} className="text-interview-primary font-medium py-2">
                  Login
                </Link>
                <Button onClick={() => {handleStartInterview(); setIsOpen(false);}} className="bg-gradient-primary w-full">
                  Start Your Mock Interview
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
