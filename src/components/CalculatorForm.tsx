
import { useState } from 'react';
import { PlusIcon, Trash2Icon, ArrowRightIcon } from 'lucide-react';
import { CalculationFormState } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface CalculatorFormProps {
  onCalculate: (data: CalculationFormState) => void;
  loading: boolean;
}

const CalculatorForm = ({ onCalculate, loading }: CalculatorFormProps) => {
  const [formState, setFormState] = useState<CalculationFormState>({
    deal_id: '',
    unit_price: '',
    project_id: '',
    developer_id: '',
    agents: [
      { id: '', name: '', account_type: 'standard', commission: '' }
    ],
    schemas: [],
    policies: []
  });

  const addAgent = () => {
    setFormState(prev => ({
      ...prev,
      agents: [
        ...prev.agents,
        { id: '', name: '', account_type: 'standard', commission: '' }
      ]
    }));
  };

  const removeAgent = (index: number) => {
    if (formState.agents.length === 1) {
      toast.error('You need at least one agent');
      return;
    }
    
    setFormState(prev => ({
      ...prev,
      agents: prev.agents.filter((_, i) => i !== index)
    }));
  };

  const updateAgentField = (index: number, field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      agents: prev.agents.map((agent, i) => 
        i === index ? { ...agent, [field]: value } : agent
      )
    }));
  };

  const updateFormField = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.deal_id || !formState.unit_price || !formState.project_id || !formState.developer_id) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const numericUnitPrice = parseFloat(formState.unit_price.replace(/,/g, ''));
    if (isNaN(numericUnitPrice) || numericUnitPrice <= 0) {
      toast.error('Unit price must be a positive number');
      return;
    }

    // Validate agents
    for (const agent of formState.agents) {
      if (!agent.id || !agent.name || !agent.commission) {
        toast.error('Please fill in all agent information');
        return;
      }
      
      const commission = parseFloat(agent.commission);
      if (isNaN(commission) || commission <= 0 || commission > 100) {
        toast.error('Agent commission must be between 0 and 100');
        return;
      }
    }

    onCalculate({
      ...formState,
      unit_price: numericUnitPrice.toString()
    });
  };

  // Format number with commas for display
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue === '') return '';
    
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <Card className="p-6 shadow-sm animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Deal ID <span className="text-destructive">*</span>
            </label>
            <Input
              value={formState.deal_id}
              onChange={(e) => updateFormField('deal_id', e.target.value)}
              placeholder="Enter deal ID"
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Unit Price <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                value={formState.unit_price}
                onChange={(e) => updateFormField('unit_price', formatNumber(e.target.value))}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Project ID <span className="text-destructive">*</span>
            </label>
            <Input
              value={formState.project_id}
              onChange={(e) => updateFormField('project_id', e.target.value)}
              placeholder="Enter project ID"
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Developer ID <span className="text-destructive">*</span>
            </label>
            <Input
              value={formState.developer_id}
              onChange={(e) => updateFormField('developer_id', e.target.value)}
              placeholder="Enter developer ID"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Agents</h3>
            <Button 
              type="button"
              onClick={addAgent}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Agent</span>
            </Button>
          </div>

          {formState.agents.map((agent, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg animate-fade-in"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Agent ID <span className="text-destructive">*</span>
                </label>
                <Input
                  value={agent.id}
                  onChange={(e) => updateAgentField(index, 'id', e.target.value)}
                  placeholder="Agent ID"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={agent.name}
                  onChange={(e) => updateAgentField(index, 'name', e.target.value)}
                  placeholder="Agent name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Account Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={agent.account_type}
                  onChange={(e) => updateAgentField(index, 'account_type', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              
              <div className="space-y-2 md:flex md:justify-between md:items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">
                    Commission % <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={agent.commission}
                    onChange={(e) => updateAgentField(index, 'commission', e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0-100"
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={() => removeAgent(index)}
                  variant="ghost"
                  size="icon"
                  className="mt-2 md:mt-0 md:ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
            ) : (
              <>
                Calculate Commission <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CalculatorForm;
