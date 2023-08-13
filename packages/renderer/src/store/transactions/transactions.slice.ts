import { SSDSlice, Slice, Reducer, Selector } from '@shared/ssd';
import { TemporalTransaction, TemporalTransactions } from '@shared/transactions';

export enum TransactionsActions {
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  EDIT_TRANSACTION = 'EDIT_TRANSACTION',
  REMOVE_TRANSACTION = 'REMOVE_TRANSACTION',
}

export enum TransactionsSelectors {
  GET_TRANSACTIONS = 'GET_TRANSACTIONS',
  GET_TRANSACTION_BY_ID = 'GET_TRANSACTION_BY_ID',
  GET_TRANSACTIONS_IN_RANGE = 'GET_TRANSACTIONS_IN_RANGE',
  GET_SUBTOTAL_IN_RANGE = 'GET_SUBTOTAL_IN_RANGE',
  GET_TRANSACTIONS_AS_EVENTS = 'GET_TRANSACTIONS_AS_EVENTS',
  FILTER_TRANSACTIONS = 'FILTER_TRANSACTIONS',
}

export interface TransactionsState {
  transactions?: TemporalTransactions;
}

@Slice({
  name: 'transactions',
  description: 'Holds state related to transactions',
  actions: TransactionsActions,
  selectors: TransactionsSelectors,
})
export class TransactionsSlice extends SSDSlice<TransactionsState> {
  public static initialState: TransactionsState = {
    transactions: new TemporalTransactions(),
  };

  constructor() {
    // @TODO load transactions from disk
    super(TransactionsSlice.initialState);
  }

  @Selector({
    selector: TransactionsSelectors.GET_TRANSACTIONS,
    description: 'Get all transactions',
  })
  getAll() {
    return this.get('transactions')?.getTransactions();
  }

  @Selector({
    selector: TransactionsSelectors.GET_TRANSACTION_BY_ID,
    description: 'Get transaction by id',
  })
  getById(id: string) {
    return this.get('transactions')?.getById(id);
  }

  @Selector({
    selector: TransactionsSelectors.GET_TRANSACTIONS_IN_RANGE,
    description: 'Get transactions in date range',
  })
  getInRange(payload: { startDate: Date; endDate: Date }) {
    return this.get('transactions')?.getInDateRange(payload.startDate, payload.endDate);
  }

  @Selector({
    selector: TransactionsSelectors.GET_SUBTOTAL_IN_RANGE,
    description: 'Get subtotal in date range',
  })
  getSubtotalInRange(payload: { startDate: Date; endDate: Date }) {
    return this.get('transactions')?.getSubtotalInRange(payload.startDate, payload.endDate);
  }

  @Selector({
    selector: TransactionsSelectors.GET_TRANSACTIONS_AS_EVENTS,
    description: 'Get transactions as calendar events',
  })
  asEvents() {
    return this.get('transactions')?.toCalendarEvents();
  }

  @Selector({
    selector: TransactionsSelectors.FILTER_TRANSACTIONS,
    description: 'Filter transactions that match a key/value pair',
  })
  filter(payload: { key: string; value: unknown }) {
    return this.get('transactions')?.filterBy(payload.key, payload.value);
  }

  @Reducer({
    action: TransactionsActions.ADD_TRANSACTION,
    description: 'Add a new transaction',
  })
  add(transaction: TemporalTransaction) {
    this.set('transactions', this.get('transactions')?.add(transaction));
  }

  @Reducer({
    action: TransactionsActions.EDIT_TRANSACTION,
    description: 'Edit an existing transaction',
  })
  edit(payload: { id: string; transaction: Partial<TemporalTransaction> }) {
    this.set('transactions', this.get('transactions')?.edit(payload.id, payload.transaction));
  }

  @Reducer({
    action: TransactionsActions.REMOVE_TRANSACTION,
    description: 'Remove a transaction',
  })
  remove(id: string) {
    this.set('transactions', this.get('transactions')?.remove(id));
  }
}
