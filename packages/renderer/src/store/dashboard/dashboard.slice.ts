import { SSDSlice, Slice, Reducer, Selector } from '@shared/ssd';
import { TransactionsSlice } from '../transactions/transactions.slice';
import { TemporalDashboardStats } from '@/dashboard/dashboard.types';

export enum DashboardActions {
  TOGGLE_FAB = 'TOGGLE_FAB',
  TOGGLE_ADD_TRANSACTION_MODAL = 'TOGGLE_ADD_TRANSACTION_MODAL',
}

export enum DashboardSelectors {
  GET_STATS = 'GET_STATS',
  GET_IS_FAB_TOGGLED = 'GET_IS_FAB_TOGGLED',
  GET_IS_ADD_TRANSACTION_MODAL_OPEN = 'GET_IS_ADD_TRANSACTION_MODAL_OPEN',
}

export type DashboardState = {
  isFABToggled: boolean;
  isAddTransactionModalOpen: boolean;
  addTransactionForm?: {
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    date: Date;
    description: string;
    tags: string[];
  };
};

@Slice({
  name: 'dashboard',
  refs: [TransactionsSlice],
  actions: DashboardActions,
  selectors: DashboardSelectors,
})
export class DashboardSlice extends SSDSlice<DashboardState> {
  public static initialState: DashboardState = {
    isFABToggled: false,
    isAddTransactionModalOpen: false,
  };

  constructor() {
    super(DashboardSlice.initialState);
  }

  @Selector({
    selector: DashboardSelectors.GET_STATS,
    description: 'Get dashboard stats',
  })
  getStats(): TemporalDashboardStats {
    const transactionsSlice = this.getSlice<TransactionsSlice>('transactions');
    if (!transactionsSlice)
      return {
        numTransactionsInLastThirtyDays: 0,
        income: {
          next: 'N/A',
          in: NaN,
          monthlyAmount: NaN,
          prevMonthlyAmount: NaN,
        },
        expense: {
          next: 'N/A',
          in: NaN,
          monthlyAmount: NaN,
          prevMonthlyAmount: NaN,
        },
      };

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getDate() - 30);
    const numTransactionsInLastThirtyDays =
      transactionsSlice
        .getInRange({
          startDate: thirtyDaysAgo,
          endDate: today,
        })
        ?.getTransactions().length ?? 0;

    const twoDaysAhead = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    const formattedNextIncomeDate = twoDaysAhead.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });

    const threeDaysAhead = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const formattedNextExpenseDate = threeDaysAhead.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });

    const stats: TemporalDashboardStats = {
      numTransactionsInLastThirtyDays,
      income: {
        next: formattedNextIncomeDate,
        in: 2,
        monthlyAmount: 4593.21,
        prevMonthlyAmount: 4593.21 - 404.03,
      },
      expense: {
        next: formattedNextExpenseDate,
        in: 3,
        monthlyAmount: 1248.24,
        prevMonthlyAmount: 1248.24 + 90.05,
      },
    };

    return stats;
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_FAB_TOGGLED,
    description: 'Get whether the FAB is toggled',
  })
  getIsFABToggled(): boolean {
    return this.get('isFABToggled');
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_ADD_TRANSACTION_MODAL_OPEN,
    description: 'Get whether the Add Transaction modal is open',
  })
  getIsAddTransactionModalOpen(): boolean {
    return this.get('isAddTransactionModalOpen');
  }

  @Reducer({
    action: DashboardActions.TOGGLE_FAB,
    description: 'Toggle the Floating Action Button menu visibility',
  })
  toggleFAB(): void {
    this.set('isFABToggled', !this.getIsFABToggled());
  }

  @Reducer({
    action: DashboardActions.TOGGLE_ADD_TRANSACTION_MODAL,
    description: 'Toggle the Add Transaction modal visibility',
  })
  toggleAddTransactionModal(): void {
    const isOpen = this.getIsAddTransactionModalOpen();
    const modal = document.getElementById('dashboard-add-transaction-modal') as HTMLDialogElement;
    if (!isOpen) {
      modal.showModal();
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      const s = this.set.bind(this);
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          modal.style.visibility = 'hidden';
          modal.style.opacity = '0';
          modal.style.pointerEvents = 'none';
          s('isAddTransactionModalOpen', false);
        }
      });
    } else {
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.close();
    }
    this.set('isAddTransactionModalOpen', !this.getIsAddTransactionModalOpen());
  }
}
