
export interface Agent {
  id: string;
  name: string;
  account_type: string;
  commission: number;
}

export interface CommissionSchema {
  id: string;
  name: string;
  account_type: string;
  effective_from: string;
  effective_to: string;
  is_active: boolean;
}

export interface CommissionPolicy {
  id: string;
  commission_schema_id: string;
  min_price: number;
  max_price: number;
  policy_type: string;
  commission: number;
}

export interface DealInput {
  deal_id: string;
  unit_price: number;
  agents: Agent[];
  project_id: string;
  developer_id: string;
}

export interface CalculationResult {
  agents: AgentCalculation[];
  sql_queries: string[];
  validation_errors: string[];
}

export interface AgentCalculation {
  agent_info: Agent;
  matched_schema: CommissionSchema;
  matched_policy: CommissionPolicy;
  policy_percentage: number;
  policy_amount: number;
  crm_percentage: number;
  net_profit: number;
  unit_price: number;
  commission_percentage: number;
  policy_factor: number;
  factor: number;
}

export interface CalculationFormState {
  deal_id: string;
  unit_price: string;
  project_id: string;
  developer_id: string;
  agents: {
    id: string;
    name: string;
    account_type: string;
    commission: string;
  }[];
  schemas: CommissionSchema[];
  policies: CommissionPolicy[];
}
