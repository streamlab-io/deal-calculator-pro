
import { ArrowDownIcon } from 'lucide-react';

const Hero = () => {
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative px-6 py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center z-10">
        <span className="inline-block animate-fade-in px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6">
          Precision Deal Calculations
        </span>
        
        <h1 className="animate-slide-up text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance mb-6">
          <span className="block">Elegant Commission</span>
          <span className="block mt-2">Calculations Made Simple</span>
        </h1>
        
        <p className="animate-slide-up delay-100 max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
          Process complex deal commissions with precision and elegance. 
          Our calculator handles all the factors with absolute accuracy.
        </p>
        
        <div className="animate-slide-up delay-200 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={scrollToCalculator}
            className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Try Calculator
          </button>
          
          <button className="bg-secondary hover:bg-secondary/80 text-foreground px-8 py-3 rounded-full text-base font-medium transition-all">
            How It Works
          </button>
        </div>
        
        <button 
          onClick={scrollToCalculator}
          className="animate-fade-in delay-300 flex items-center justify-center mx-auto animate-float"
        >
          <ArrowDownIcon className="w-10 h-10 text-primary/50" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
