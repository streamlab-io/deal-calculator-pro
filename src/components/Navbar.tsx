
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "glass shadow-sm backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-medium tracking-tight">DealCalc Pro</span>
        </div>
        
        <ul className="hidden md:flex space-x-8">
          <li>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Overview
            </a>
          </li>
          <li>
            <a href="#calculator" className="text-sm font-medium hover:text-primary transition-colors">
              Calculator
            </a>
          </li>
          <li>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
          </li>
        </ul>
        
        <div>
          <button className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
