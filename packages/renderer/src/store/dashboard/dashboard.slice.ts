import { SSDSlice, Slice, Reducer, Selector } from '@shared/ssd';
import { TransactionsSlice } from '../transactions/transactions.slice';
import { TemporalDashboardStats } from '@/dashboard/dashboard.types';

export enum DashboardActions {}

export enum DashboardSelectors {
  GET_STATS = 'GET_STATS',
}

export type DashboardState = {
  stats?: TemporalDashboardStats;
};

@Slice({
  name: 'dashboard',
  refs: [TransactionsSlice],
})
export class DashboardSlice extends SSDSlice<DashboardState> {
  public static initialState: DashboardState = {};

  constructor() {
    super(DashboardSlice.initialState);
  }

  @Selector({
    selector: DashboardSelectors.GET_STATS,
    description: 'Get dashboard stats',
  })
  getStats() {
    const transactionsSlice = this.getSlice<TransactionsSlice>('transactions');
    if (!transactionsSlice) return undefined;

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getDate() - 30);
    const numTransactionsInLastThirtyDays =
      transactionsSlice
        .getInRange({
          startDate: thirtyDaysAgo,
          endDate: today,
        })
        ?.getTransactions().length ?? 0;

    const stats: TemporalDashboardStats = {
      numTransactionsInLastThirtyDays,
      income: {
        next: '',
        in: '',
        monthlyAmount: 0,
        prevMonthlyAmount: 0,
      },
      expense: {
        next: '',
        in: '',
        monthlyAmount: 0,
        prevMonthlyAmount: 0,
      },
    };

    return stats;
  }
}
