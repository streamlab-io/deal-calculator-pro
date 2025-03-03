
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculateCommission } from '@/api/calculator';
import { CalculationFormState } from '@/types';
import { CalculationResult } from '@/types';
import { toast } from 'sonner';
import { CheckCircle2Icon, ZapIcon, ShieldCheckIcon } from 'lucide-react';

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (formData: CalculationFormState) => {
    try {
      setLoading(true);
      // Transform form data to the format expected by the API
      const apiData = {
        deal_id: formData.deal_id,
        unit_price: parseFloat(formData.unit_price.replace(/,/g, '')),
        project_id: formData.project_id,
        developer_id: formData.developer_id,
        agents: formData.agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          account_type: agent.account_type,
          commission: parseFloat(agent.commission)
        }))
      };
      
      const results = await calculateCommission(apiData);
      setCalculationResults(results);
      
      if (results.validation_errors.length > 0) {
        toast.warning('Calculation completed with some validation errors');
      } else if (results.agents.length > 0) {
        toast.success('Commission calculation completed successfully');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('An error occurred during calculation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <Hero />
      
      <section id="calculator" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              Commission Calculator
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Calculate with Precision</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Enter deal and agent details to generate accurate commission calculations 
              and SQL queries for your database.
            </p>
          </div>
          
          <CalculatorForm onCalculate={handleCalculate} loading={loading} />
          
          <ResultsDisplay results={calculationResults} />
        </div>
      </section>
      
      <section id="features" className="py-20 px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Why Choose Our Calculator</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Designed with precision and elegance in mind, our commission calculator 
              delivers accurate results with a beautiful interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Precision Calculations</h3>
              <p className="text-muted-foreground">
                Our calculator handles complex commission structures with absolute precision, 
                ensuring every decimal is accurate.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ZapIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get instant results with our optimized calculation engine, saving you 
                valuable time on commission processing.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">SQL Integration</h3>
              <p className="text-muted-foreground">
                Generate ready-to-use SQL queries for your database, streamlining 
                your workflow with zero manual errors.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 px-6 bg-background border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DealCalc Pro. Precision calculations for modern businesses.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
