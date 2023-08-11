import { EventInput } from '@fullcalendar/core';
import {
  TemporalRecurringTransaction,
  TemporalTransaction,
  TemporalTransactionType,
  TemporalTransactions,
} from './transaction';

describe('TemporalTransactions', () => {
  let transactions: TemporalTransactions;

  beforeEach(() => {
    transactions = new TemporalTransactions();
  });

  it('should be defined', () => {
    expect(transactions).toBeDefined();
  });

  it('should add a transaction', () => {
    const transaction: TemporalTransaction = {
      id: '1',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
    };

    transactions.add(transaction);

    expect(transactions.getById('1')).toBe(transaction);
  });

  it('should add a recurring transaction', () => {
    const recurring: TemporalRecurringTransaction = {
      id: '1',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
      rule: 'RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYMONTHDAY=15,-1',
    };

    transactions.add(recurring);

    expect(transactions.getById('1')).toBe(recurring);
  });

  it('should get transactions in date range', () => {
    const oldTransaction: TemporalTransaction = {
      id: '0',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(1000),
      description: 'Test',
      tags: [],
    };
    const transaction: TemporalTransaction = {
      id: '1',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
    };

    transactions.add(oldTransaction);
    transactions.add(transaction);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1);

    expect(transactions.getInDateRange(startDate, endDate).toCalendarEvents()).toEqual([
      {
        id: '1',
        title: 'Test ($100.00)',
        start: transaction.date,
        allDay: true,
      },
    ]);
  });

  it('should get recurring transactions in date range', () => {
    const recurring: TemporalRecurringTransaction = {
      id: '1',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
      rule: 'RRULE:FREQ=MONTHLY;BYMONTHDAY=15,-1',
      canOccurOnHolidays: false,
      canOccurOnWeekends: false,
    };

    transactions.add(recurring);

    const startDate = new Date();
    const endDate = new Date(+startDate + 1000 * 60 * 60 * 24 * 365);

    const events = transactions.getInDateRange(startDate, endDate).toCalendarEvents() as EventInput[];
    expect(events.length).toBe(24);
    // expect no weekends
    expect(events.every((event) => (event.start as Date).getDay() !== 6 && (event.start as Date).getDay() !== 0)).toBe(
      true,
    );
  });

  it('should get subtotal in date range', () => {
    const oldTransaction: TemporalTransaction = {
      id: '0',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
    };
    const transaction: TemporalTransaction = {
      id: '1',
      type: TemporalTransactionType.DEBIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
    };

    transactions.add(oldTransaction);
    transactions.add(transaction);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1);

    expect(transactions.getSubtotalInRange(startDate, endDate)).toBe(0);
  });
});
