
// In a real application, this would be an API call to our Go backend
// For now, we'll simulate the calculation logic

import { 
  DealInput, 
  CalculationResult, 
  CommissionSchema, 
  CommissionPolicy 
} from '@/types';

// Mock data for commission schemas and policies
const MOCK_SCHEMAS: CommissionSchema[] = [
  {
    id: "schema1",
    name: "Standard Schema 2023",
    account_type: "standard",
    effective_from: "2023-01-01",
    effective_to: "2023-12-31",
    is_active: true
  },
  {
    id: "schema2",
    name: "Premium Schema 2023",
    account_type: "premium",
    effective_from: "2023-01-01",
    effective_to: "2023-12-31",
    is_active: true
  },
  {
    id: "schema3",
    name: "Enterprise Schema 2023",
    account_type: "enterprise",
    effective_from: "2023-01-01",
    effective_to: "2023-12-31",
    is_active: true
  }
];

const MOCK_POLICIES: CommissionPolicy[] = [
  {
    id: "policy1",
    commission_schema_id: "schema1",
    min_price: 0,
    max_price: 500000,
    policy_type: "quarter",
    commission: 2.5
  },
  {
    id: "policy2",
    commission_schema_id: "schema1",
    min_price: 500001,
    max_price: 1000000,
    policy_type: "quarter",
    commission: 3.0
  },
  {
    id: "policy3",
    commission_schema_id: "schema2",
    min_price: 0,
    max_price: 1000000,
    policy_type: "quarter",
    commission: 3.5
  },
  {
    id: "policy4",
    commission_schema_id: "schema3",
    min_price: 0,
    max_price: 2000000,
    policy_type: "quarter",
    commission: 4.0
  }
];

// Format numbers with underscores for readability in SQL
const formatWithUnderscores = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
};

// Get current date info
const getCurrentDateInfo = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const quarter = Math.floor((month - 1) / 3) + 1;
  
  return {
    month,
    year,
    quarter,
    timestamp: now.toISOString()
  };
};

export const calculateCommission = async (data: DealInput): Promise<CalculationResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const result: CalculationResult = {
    agents: [],
    sql_queries: [],
    validation_errors: []
  };
  
  const dateInfo = getCurrentDateInfo();
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Process each agent
  for (const agent of data.agents) {
    // 1. Find matching schema
    const matchedSchema = MOCK_SCHEMAS.find(schema => 
      schema.account_type === agent.account_type &&
      schema.is_active &&
      currentDate >= schema.effective_from &&
      currentDate <= schema.effective_to
    );
    
    if (!matchedSchema) {
      result.validation_errors.push(`No active schema found for agent ${agent.name} (${agent.id}) with account type ${agent.account_type}`);
      continue;
    }
    
    // 2. Find matching policy
    const matchedPolicy = MOCK_POLICIES.find(policy => 
      policy.commission_schema_id === matchedSchema.id &&
      policy.policy_type === "quarter" &&
      data.unit_price >= policy.min_price &&
      data.unit_price <= policy.max_price
    );
    
    if (!matchedPolicy) {
      result.validation_errors.push(`No matching policy found for agent ${agent.name} (${agent.id}) with unit price ${data.unit_price}`);
      continue;
    }
    
    // 3. Calculate amounts
    const policy_factor = (matchedPolicy.commission * agent.commission) / 100;
    const factor = data.unit_price / 1000000;
    const policy_amount = policy_factor * factor;
    const net_profit = data.unit_price * (agent.commission / 100);
    
    // 4. Generate transaction SQL
    const transactionSql = `
INSERT INTO deals_transactions (
  agent_id, deal_id, unit_price, commission_schema_id, policy_id, 
  policy_percentage, crm_percentage, policy_amount, account_type, 
  status, action, created_at, updated_at, deleted_at, net_profit, 
  project_id, developer_id
) VALUES (
  '${agent.id}', '${data.deal_id}', ${formatWithUnderscores(data.unit_price)}, 
  '${matchedSchema.id}', '${matchedPolicy.id}', ${matchedPolicy.commission}, 
  ${agent.commission}, ${policy_amount.toFixed(2)}, '${agent.account_type}', 
  'pending', 'commission_calculated', '${dateInfo.timestamp}', 
  '${dateInfo.timestamp}', NULL, ${net_profit.toFixed(2)}, 
  '${data.project_id}', '${data.developer_id}'
);`.trim();
    
    // 5. Generate wallet SQL
    const walletSql = `
INSERT INTO agent_wallets (
  agent_id, month, year, quarter_number, total, amount, policy_id, 
  commission_schema_id, unit_prices, net_profit, latest, paid, 
  remaining, created_at, updated_at, deleted_at
) VALUES (
  '${agent.id}', ${dateInfo.month}, ${dateInfo.year}, ${dateInfo.quarter}, 
  ${formatWithUnderscores(data.unit_price)}, ${policy_amount.toFixed(2)}, 
  '${matchedPolicy.id}', '${matchedSchema.id}', ${formatWithUnderscores(data.unit_price)}, 
  ${net_profit.toFixed(2)}, true, 0, 0, '${dateInfo.timestamp}', 
  '${dateInfo.timestamp}', NULL
) ON CONFLICT (agent_id, month, year) DO UPDATE SET
  total = agent_wallets.total + ${formatWithUnderscores(data.unit_price)},
  amount = agent_wallets.amount + ${policy_amount.toFixed(2)},
  unit_prices = agent_wallets.unit_prices + ${formatWithUnderscores(data.unit_price)},
  net_profit = agent_wallets.net_profit + ${net_profit.toFixed(2)},
  updated_at = '${dateInfo.timestamp}';
`.trim();
    
    // Add to result
    result.agents.push({
      agent_info: agent,
      matched_schema: matchedSchema,
      matched_policy: matchedPolicy,
      policy_percentage: matchedPolicy.commission,
      policy_amount,
      crm_percentage: agent.commission,
      net_profit,
      unit_price: data.unit_price,
      commission_percentage: agent.commission / 100,
      policy_factor,
      factor
    });
    
    result.sql_queries.push(transactionSql);
    result.sql_queries.push(walletSql);
  }
  
  return result;
};
