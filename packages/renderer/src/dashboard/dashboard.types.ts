export interface TemporalDashboardStats {
  numTransactionsInLastThirtyDays: number;
  income: {
    next: string;
    in: string;
    monthlyAmount: number;
    prevMonthlyAmount: number;
  };
  expense: {
    next: string;
    in: string;
    monthlyAmount: number;
    prevMonthlyAmount: number;
  };
}

export interface TemporalAssistantMessage {
  content: string;
  type: 'success' | 'error';
  sender: 'user' | 'assistant';
  timestamp: number;
}
