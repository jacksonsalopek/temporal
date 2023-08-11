export interface TemporalDashboardStats {
  numTransactionsInLastThirtyDays: number;
  income: {
    /**
     * Date of next income, format MM/DD
     */
    next: string;

    /**
     * Number of days until next income
     */
    in: number;
    monthlyAmount: number;
    prevMonthlyAmount: number;
  };
  expense: {
    /**
     * Date of next expense, format MM/DD
     */
    next: string;

    /**
     * Number of days until next expense
     */
    in: number;
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
