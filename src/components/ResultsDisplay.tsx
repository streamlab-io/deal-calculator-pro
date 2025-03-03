
import { useState } from 'react';
import { CalculationResult, AgentCalculation } from '@/types';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCopyIcon, CheckIcon, DatabaseIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ResultsDisplayProps {
  results: CalculationResult | null;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!results) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast.success('SQL query copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="animate-fade-in mt-8">
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
          <TabsTrigger value="agents">Agent Calculations</TabsTrigger>
          <TabsTrigger value="sql">SQL Queries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="mt-2 space-y-6">
          {results.validation_errors.length > 0 && (
            <Card className="p-4 border-destructive/50 bg-destructive/5">
              <h3 className="text-lg font-medium text-destructive mb-2">Validation Errors</h3>
              <ul className="list-disc pl-5 space-y-1">
                {results.validation_errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.agents.map((agent, index) => (
              <AgentCard key={index} agent={agent} index={index} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sql" className="mt-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DatabaseIcon className="mr-2 h-5 w-5 text-primary" />
              SQL Queries
            </h3>
            
            <div className="space-y-4">
              {results.sql_queries.map((query, index) => (
                <div key={index} className="relative">
                  <pre className="text-xs md:text-sm bg-secondary p-4 rounded-lg overflow-x-auto">
                    <code>{query}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(query, index)}
                    className="absolute top-2 right-2 p-2 rounded-md hover:bg-background/50"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardCopyIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AgentCard = ({ agent, index }: { agent: AgentCalculation; index: number }) => {
  return (
    <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="bg-primary/10 p-4">
        <h3 className="font-medium">{agent.agent_info.name}</h3>
        <p className="text-sm text-muted-foreground">ID: {agent.agent_info.id}</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Unit Price</p>
            <p className="font-medium">{formatCurrency(agent.unit_price)}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Account Type</p>
            <p className="font-medium capitalize">{agent.agent_info.account_type}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">CRM Commission</p>
            <p className="font-medium">{formatPercentage(agent.crm_percentage)}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Policy Percentage</p>
            <p className="font-medium">{formatPercentage(agent.policy_percentage)}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Policy Amount</p>
              <p className="font-medium">{formatCurrency(agent.policy_amount)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="font-medium text-primary">{formatCurrency(agent.net_profit)}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="text-xs space-y-1">
            <p><span className="text-muted-foreground">Schema ID:</span> {agent.matched_schema.id}</p>
            <p><span className="text-muted-foreground">Policy ID:</span> {agent.matched_policy.id}</p>
            <p><span className="text-muted-foreground">Factor:</span> {agent.factor.toFixed(6)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
