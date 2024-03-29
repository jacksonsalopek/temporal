import { TemporalDashboardStats } from '@/dashboard/dashboard.types';
import { TEMPORAL_NINETY_DAYS } from '@shared/constants';
import { Reducer, SSDSlice, Selector, Slice } from '@shared/ssd';
import { TemporalRecurringTransaction, TemporalTransaction, TemporalTransactionType } from '@shared/transactions';
import { v4 } from 'uuid';
import { TransactionsSlice } from '../transactions/transactions.slice';

export enum DashboardActions {
  PUSH_ADD_TRANSACTION_FORM_TAG = 'PUSH_ADD_TRANSACTION_FORM_TAG',
  REMOVE_ADD_TRANSACTION_FORM_TAG = 'REMOVE_ADD_TRANSACTION_FORM_TAG',
  TOGGLE_FAB = 'TOGGLE_FAB',
  TOGGLE_ADD_TRANSACTION_MODAL = 'TOGGLE_ADD_TRANSACTION_MODAL',
  TOGGLE_GET_SUBTOTAL_ON_DATE_MODAL = 'TOGGLE_GET_SUBTOTAL_ON_DATE_MODAL',
  SET_GET_SUBTOTAL_ON_DATE_MODAL_DATE = 'SET_GET_SUBTOTAL_ON_DATE_MODAL_DATE',
  SET_ADD_TRANSACTION_FORM_DATE = 'SET_ADD_TRANSACTION_FORM_DATE',
  SET_ADD_TRANSACTION_FORM_AMOUNT = 'SET_ADD_TRANSACTION_FORM_AMOUNT',
  SET_ADD_TRANSACTION_FORM_DESCRIPTION = 'SET_ADD_TRANSACTION_FORM_DESCRIPTION',
  SET_ADD_TRANSACTION_FORM_TAGS = 'SET_ADD_TRANSACTION_FORM_TAGS',
  SET_ADD_TRANSACTION_FORM_TYPE = 'SET_ADD_TRANSACTION_FORM_TYPE',
  SET_ADD_TRANSACTION_FORM_RECURRING = 'SET_ADD_TRANSACTION_FORM_RECURRING',
  SET_ADD_TRANSACTION_FORM_RECURRING_RULE = 'SET_ADD_TRANSACTION_FORM_RECURRING_RULE',
  SET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_WEEKENDS = 'SET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_WEEKENDS',
  SET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_HOLIDAYS = 'SET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_HOLIDAYS',
  PROGRESS_OR_SUBMIT_ADD_TRANSACTION_FORM = 'PROGRESS_OR_SUBMIT_ADD_TRANSACTION_FORM',
  SUBMIT_GET_SUBTOTAL_ON_DATE_FORM = 'SUBMIT_GET_SUBTOTAL_ON_DATE_FORM',
}

export enum DashboardSelectors {
  GET_STATS = 'GET_STATS',
  GET_IS_FAB_TOGGLED = 'GET_IS_FAB_TOGGLED',
  GET_IS_ADD_TRANSACTION_MODAL_OPEN = 'GET_IS_ADD_TRANSACTION_MODAL_OPEN',
  GET_IS_GET_SUBTOTAL_ON_DATE_MODAL_OPEN = 'GET_IS_GET_SUBTOTAL_ON_DATE_MODAL_OPEN',
  GET_GET_SUBTOTAL_ON_DATE_FORM_DATA = 'GET_GET_SUBTOTAL_ON_DATE_FORM_DATA',
  GET_GET_SUBTOTAL_ON_DATE_FORM_DATE = 'GET_GET_SUBTOTAL_ON_DATE_FORM_DATE',
  GET_IS_GET_SUBTOTAL_ON_DATE_FORM_VALID = 'GET_IS_GET_SUBTOTAL_ON_DATE_FORM_VALID',
  GET_IS_GET_SUBTOTAL_ON_DATE_FORM_COMPLETE = 'GET_IS_GET_SUBTOTAL_ON_DATE_FORM_COMPLETE',
  GET_ADD_TRANSACTION_FORM_DATA = 'GET_ADD_TRANSACTION_FORM_DATA',
  GET_ADD_TRANSACTION_FORM_DATE = 'GET_ADD_TRANSACTION_FORM_DATE',
  GET_ADD_TRANSACTION_FORM_AMOUNT = 'GET_ADD_TRANSACTION_FORM_AMOUNT',
  GET_ADD_TRANSACTION_FORM_DESCRIPTION = 'GET_ADD_TRANSACTION_FORM_DESCRIPTION',
  GET_ADD_TRANSACTION_FORM_TAGS = 'GET_ADD_TRANSACTION_FORM_TAGS',
  GET_ADD_TRANSACTION_FORM_TYPE = 'GET_ADD_TRANSACTION_FORM_TYPE',
  GET_ADD_TRANSACTION_FORM_STEP = 'GET_ADD_TRANSACTION_FORM_STEP',
  GET_ADD_TRANSACTION_FORM_RECURRING = 'GET_ADD_TRANSACTION_FORM_RECURRING',
  GET_ADD_TRANSACTION_FORM_RECURRING_RULE = 'GET_ADD_TRANSACTION_FORM_RECURRING_RULE',
  GET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_WEEKENDS = 'GET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_WEEKENDS',
  GET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_HOLIDAYS = 'GET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_HOLIDAYS',
  GET_IS_ADD_TRANSACTION_FORM_VALID = 'GET_IS_ADD_TRANSACTION_FORM_VALID',
  GET_IS_ADD_TRANSACTION_FORM_COMPLETE = 'GET_IS_ADD_TRANSACTION_FORM_COMPLETE',
}

export type AddTransactionFormData = Omit<Partial<TemporalRecurringTransaction>, 'amount'> & {
  amount?: string;
};

export type GetSubtotalOnDateFormData = Partial<{ date: Date }>;

export type DashboardState = {
  isFABToggled: boolean;
  isAddTransactionModalOpen: boolean;
  isGetSubtotalOnDateModalOpen: boolean;
  addTransactionFormState?: 'notstarted' | 'incomplete' | 'valid' | 'complete';
  addTransactionForm?: {
    step: number;
    recurring?: boolean;
    data: AddTransactionFormData;
  };
  getSubtotalOnDateForm?: {
    data: GetSubtotalOnDateFormData;
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
    isGetSubtotalOnDateModalOpen: false,
    addTransactionFormState: 'notstarted',
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
      throw new Error('TransactionsSlice not found! (DashboardSlice.getStats() -> transactionsSlice)');

    const today = new Date();
    const ninetyDays = new Date(+today + TEMPORAL_NINETY_DAYS);
    const numTransactionsInNextNinetyDays =
      transactionsSlice
        .getInRange({
          startDate: today,
          endDate: ninetyDays,
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
      numTransactionsInNextNinetyDays,
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
  isFABToggled(): boolean {
    return this.get('isFABToggled');
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_ADD_TRANSACTION_MODAL_OPEN,
    description: 'Get whether the Add Transaction modal is open',
  })
  isAddTransactionModalOpen(): boolean {
    return this.get('isAddTransactionModalOpen');
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_GET_SUBTOTAL_ON_DATE_MODAL_OPEN,
    description: 'Get whether the Get Subtotal On Date modal is open',
  })
  isGetSubtotalOnDateModalOpen(): boolean {
    return this.get('isGetSubtotalOnDateModalOpen');
  }

  @Reducer({
    action: DashboardActions.TOGGLE_FAB,
    description: 'Toggle the Floating Action Button menu visibility',
  })
  toggleFAB(): void {
    this.set('isFABToggled', !this.isFABToggled());
  }

  @Reducer({
    action: DashboardActions.TOGGLE_ADD_TRANSACTION_MODAL,
    description: 'Toggle the Add Transaction modal visibility',
  })
  toggleAddTransactionModal(): void {
    const isOpen = this.isAddTransactionModalOpen();
    const modal = document.getElementById('dashboard-add-transaction-modal') as HTMLDialogElement;
    if (!isOpen) {
      modal.showModal();
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      const set = this.set.bind(this);
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          modal.style.visibility = 'hidden';
          modal.style.opacity = '0';
          modal.style.pointerEvents = 'none';
          set('isAddTransactionModalOpen', false);
        }
      });
      this.set('addTransactionForm', {
        step: 0,
        data: {},
      });
    } else {
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      this.set('addTransactionForm', undefined);
      modal.close();
    }
    this.set('isAddTransactionModalOpen', !isOpen);
  }

  @Reducer({
    action: DashboardActions.TOGGLE_GET_SUBTOTAL_ON_DATE_MODAL,
    description: 'Toggle the Get Subtotal On Date modal visibility',
  })
  toggleGetSubtotalOnDateModal(): void {
    const isOpen = this.isGetSubtotalOnDateModalOpen();
    const modal = document.getElementById('dashboard-get-subtotal-modal') as HTMLDialogElement;
    if (!isOpen) {
      modal.showModal();
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      const set = this.set.bind(this);
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          modal.style.visibility = 'hidden';
          modal.style.opacity = '0';
          modal.style.pointerEvents = 'none';
          set('isGetSubtotalOnDateModalOpen', false);
        }
      });
      this.set('getSubtotalOnDateForm', {
        data: {},
      });
    } else {
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      this.set('getSubtotalOnDateForm', undefined);
      modal.close();
    }
    this.set('isGetSubtotalOnDateModalOpen', !isOpen);
  }

  @Selector({
    selector: DashboardSelectors.GET_GET_SUBTOTAL_ON_DATE_FORM_DATA,
    description: 'Get the Get Subtotal On Date form data',
  })
  getGetSubtotalOnDateFormData(): GetSubtotalOnDateFormData | undefined {
    return this.get('getSubtotalOnDateForm')?.data;
  }

  @Selector({
    selector: DashboardSelectors.GET_GET_SUBTOTAL_ON_DATE_FORM_DATE,
    description: 'Get the Get Subtotal On Date form date',
  })
  getGetSubtotalOnDateFormDate(): Date | undefined {
    return this.get('getSubtotalOnDateForm')?.data?.date;
  }

  @Reducer({
    action: DashboardActions.SET_GET_SUBTOTAL_ON_DATE_MODAL_DATE,
    description: 'Set the Get Subtotal On Date form date',
  })
  setGetSubtotalOnDateFormDate(date: Date | undefined): void {
    const form = this.get('getSubtotalOnDateForm');
    if (!form) return;
    this.set('getSubtotalOnDateForm', {
      ...form,
      data: {
        ...form.data,
        date,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_GET_SUBTOTAL_ON_DATE_FORM_VALID,
    description: 'Validate the Get Subtotal On Date form',
  })
  isGetSubtotalOnDateFormValid(): boolean {
    const form = this.get('getSubtotalOnDateForm');
    return !!form?.data?.date;
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_GET_SUBTOTAL_ON_DATE_FORM_COMPLETE,
    description: 'Check if the Get Subtotal On Date form is complete',
  })
  isGetSubtotalOnDateFormComplete(): boolean {
    const form = this.get('getSubtotalOnDateForm');
    return !!form?.data?.date;
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_DATA,
    description: 'Get the Add Transaction form data',
  })
  getAddTransactionFormData(): AddTransactionFormData | undefined {
    return this.get('addTransactionForm')?.data;
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_STEP,
    description: 'Get the Add Transaction form step',
  })
  getAddTransactionFormStep(): number | undefined {
    return this.get('addTransactionForm')?.step;
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_DATE,
    description: 'Get the Add Transaction form date',
  })
  getAddTransactionFormDate(): Date | undefined {
    return this.get('addTransactionForm')?.data?.date;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_DATE,
    description: 'Set the Add Transaction form date',
  })
  setAddTransactionFormDate(date: Date): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        date,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_RECURRING,
    description: 'Get the Add Transaction form recurring',
  })
  getAddTransactionFormRecurring(): boolean | undefined {
    return this.get('addTransactionForm')?.recurring;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_RECURRING,
    description: 'Set the Add Transaction form recurring',
  })
  setAddTransactionFormRecurring(recurring: boolean): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      recurring,
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_RECURRING_RULE,
    description: 'Get the Add Transaction form recurring rule',
  })
  getAddTransactionFormRecurringRule(): string | undefined {
    return this.get('addTransactionForm')?.data?.rule;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_RECURRING_RULE,
    description: 'Set the Add Transaction form recurring rule',
  })
  setAddTransactionFormRecurringRule(rule: string): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        rule,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_WEEKENDS,
    description: 'Get the Add Transaction form recurring can occur on weekends',
  })
  getAddTransactionFormCanOccurOnWeekends(): boolean | undefined {
    return this.get('addTransactionForm')?.data?.canOccurOnWeekends;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_WEEKENDS,
    description: 'Set the Add Transaction form recurring can occur on weekends',
  })
  setAddTransactionFormCanOccurOnWeekends(canOccurOnWeekends: boolean): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        canOccurOnWeekends,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_HOLIDAYS,
    description: 'Get the Add Transaction form recurring can occur on holidays',
  })
  getAddTransactionFormCanOccurOnHolidays(): boolean | undefined {
    return this.get('addTransactionForm')?.data?.canOccurOnHolidays;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_RECURRING_CAN_OCCUR_ON_HOLIDAYS,
    description: 'Set the Add Transaction form recurring can occur on holidays',
  })
  setAddTransactionFormCanOccurOnHolidays(canOccurOnHolidays: boolean): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        canOccurOnHolidays,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_ADD_TRANSACTION_FORM_VALID,
    description: 'Validate the Add Transaction form',
  })
  isAddTransactionFormValid(): boolean {
    const form = this.get('addTransactionForm');
    const step = form?.step ?? 0;

    switch (step) {
      // Step 1: When was the transaction?
      case 0:
        return !!form?.data?.date;
      // Step 2: Transaction details
      case 1:
        if (form?.recurring)
          return !!form?.data?.amount && !!form?.data?.type && !!form?.data?.description && !!form?.data?.rule;
        return !!form?.data?.amount && !!form?.data?.type && !!form?.data?.description;
      // Step 3: Transaction tags
      case 2:
        return !!form?.data?.tags;
      // Step 4: Review
      case 3:
        return true;
      default:
        return false;
    }
  }

  @Selector({
    selector: DashboardSelectors.GET_IS_ADD_TRANSACTION_FORM_COMPLETE,
    description: 'Check if the Add Transaction form is complete',
  })
  isAddTransactionFormComplete(): boolean {
    const form = this.get('addTransactionForm');
    return (
      !!form?.data?.date &&
      !!form?.data?.amount &&
      !!form?.data?.type &&
      !!form?.data?.description &&
      !!form?.data?.tags &&
      form?.step === 3
    );
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_AMOUNT,
    description: 'Get the Add Transaction form amount',
  })
  getAddTransactionFormAmount(): string | undefined {
    return this.get('addTransactionForm')?.data?.amount;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_AMOUNT,
    description: 'Set the Add Transaction form amount',
  })
  setAddTransactionFormAmount(amount: string): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        amount,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_DESCRIPTION,
    description: 'Get the Add Transaction form description',
  })
  getAddTransactionFormDescription(): string | undefined {
    return this.get('addTransactionForm')?.data?.description;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_DESCRIPTION,
    description: 'Set the Add Transaction form description',
  })
  setAddTransactionFormDescription(description: string): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        description,
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_TAGS,
    description: 'Get the Add Transaction form tags',
  })
  getAddTransactionFormTags(): string[] | undefined {
    return this.get('addTransactionForm')?.data?.tags;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_TAGS,
    description: 'Set the Add Transaction form tags',
  })
  setAddTransactionFormTags(tags: string[]): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        tags,
      },
    });
  }

  @Reducer({
    action: DashboardActions.PUSH_ADD_TRANSACTION_FORM_TAG,
    description: 'Push a tag to the Add Transaction form tags',
  })
  pushAddTransactionFormTag(tag: string): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        tags: [...(form.data.tags ?? []), tag],
      },
    });
  }

  @Reducer({
    action: DashboardActions.REMOVE_ADD_TRANSACTION_FORM_TAG,
    description: 'Remove a tag from the Add Transaction form tags',
  })
  removeAddTransactionFormTag(tag: string): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        tags: form.data.tags?.filter((t) => t !== tag),
      },
    });
  }

  @Selector({
    selector: DashboardSelectors.GET_ADD_TRANSACTION_FORM_TYPE,
    description: 'Get the Add Transaction form type',
  })
  getAddTransactionFormType(): TemporalTransactionType | undefined {
    return this.get('addTransactionForm')?.data?.type;
  }

  @Reducer({
    action: DashboardActions.SET_ADD_TRANSACTION_FORM_TYPE,
    description: 'Set the Add Transaction form type',
  })
  setAddTransactionFormType(type: TemporalTransactionType): void {
    const form = this.get('addTransactionForm');
    if (!form) return;
    this.set('addTransactionForm', {
      ...form,
      data: {
        ...form.data,
        type,
      },
    });
  }

  @Reducer({
    action: DashboardActions.PROGRESS_OR_SUBMIT_ADD_TRANSACTION_FORM,
    description: 'Progress or submit the Add Transaction form. Returns whether the form was submitted.',
  })
  progressOrSubmitAddTransactionForm(): boolean {
    const form = this.get('addTransactionForm');
    if (!form) return false;

    const step = form.step;
    if (this.isAddTransactionFormComplete()) {
      let formData: TemporalRecurringTransaction | TemporalTransaction = {
        id: v4(),
        // rome-ignore lint/style/noNonNullAssertion: we have already checked that the form is complete
        type: form.data.type!,
        // rome-ignore lint/style/noNonNullAssertion: see above
        amount: parseFloat(form.data.amount!),
        // rome-ignore lint/style/noNonNullAssertion: see above
        description: form.data.description!,
        // rome-ignore lint/style/noNonNullAssertion: see above
        date: form.data.date!,
        // rome-ignore lint/style/noNonNullAssertion: see above
        tags: form.data.tags!,
      };
      if (form.recurring) {
        formData = {
          ...formData,
          // rome-ignore lint/style/noNonNullAssertion: see above
          rule: form.data.rule!,
          // rome-ignore lint/style/noNonNullAssertion: see above
          canOccurOnWeekends: form.data.canOccurOnWeekends!,
          // rome-ignore lint/style/noNonNullAssertion: see above
          canOccurOnHolidays: form.data.canOccurOnHolidays!,
        };
      }

      const transactionsSlice = this.getSlice<TransactionsSlice>('transactions');
      if (!transactionsSlice) throw new Error('TransactionsSlice not found!');
      transactionsSlice.add(formData);
      this.set('addTransactionForm', undefined);
      this.set('addTransactionFormState', 'complete');
      this.toggleAddTransactionModal();
      return true;
    }

    if (this.isAddTransactionFormValid()) {
      this.set('addTransactionForm', {
        ...form,
        step: step + 1,
      });
    }
    return false;
  }
}
