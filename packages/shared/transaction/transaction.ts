import { EventSourceInput } from '@fullcalendar/core';
import Holidays from '@18f/us-federal-holidays';
import { RRule, RRuleSet } from 'rrule';

export interface TemporalTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  date: Date;
  description: string;
  tags: string[];
}

export interface TemporalRecurringTransaction extends TemporalTransaction {
  /**
   * RRule string for recurring transactions, see https://jakubroztocil.github.io/rrule/#/text/every%20month%20on%20Monday,%20Tuesday,%20Wednesday,%20Thursday%20or%20Friday%20the%2015th%20or%2030th
   */
  rule: string;
  canOccurOnWeekends?: boolean;
  canOccurOnHolidays?: boolean;
}

export function isRecurringTransaction(transaction: TemporalTransaction): transaction is TemporalRecurringTransaction {
  return 'rule' in transaction;
}

export class TemporalTransactions {
  private transactions: TemporalTransaction[] = [];

  constructor(transactions?: TemporalTransaction[]) {
    if (transactions) {
      this.transactions = transactions;
    }
  }

  static fromString(json: string) {
    const transactions = JSON.parse(json);
    return new TemporalTransactions(transactions);
  }

  add(transaction: TemporalTransaction) {
    this.transactions.push(transaction);
  }

  getById(id: string) {
    return this.transactions.find((transaction) => transaction.id === id);
  }

  getInDateRange(startDate: Date, endDate: Date) {
    return new TemporalTransactions(
      this.transactions.filter((transaction) => {
        return transaction.date >= startDate && transaction.date <= endDate;
      }),
    );
  }

  toCalendarEvents(): EventSourceInput {
    const bankHolidays = Holidays.allForYear(new Date().getFullYear()).map((holiday) => holiday.date.toISOString());

    function adjustForWeekendsAndHolidays(
      date: Date,
      canOccurOnWeekends?: boolean,
      canOccurOnHolidays?: boolean,
    ): Date {
      while (
        (!canOccurOnWeekends && (date.getDay() === 6 || date.getDay() === 0)) ||
        (!canOccurOnHolidays && bankHolidays.includes(date.toISOString()))
      ) {
        date.setDate(date.getDate() - 1);
      }
      return date;
    }

    return this.transactions.flatMap((transaction) => {
      const amountDivCents = transaction.amount / 100;
      const amount = `${amountDivCents >= 0 ? '$' : '-$'}${amountDivCents.toFixed(2)}`;

      if (isRecurringTransaction(transaction)) {
        const ruleSet = new RRuleSet();
        const rule = RRule.fromString(transaction.rule);
        ruleSet.rrule(rule);

        // Adjust dates for bank holidays and weekends
        const dates = ruleSet.all((date, i) => i < 24);
        const adjustedDates = dates.map((date) =>
          adjustForWeekendsAndHolidays(date, transaction.canOccurOnWeekends, transaction.canOccurOnHolidays),
        );

        // map adjusted dates to event and return
        return adjustedDates.map((date) => {
          return {
            id: transaction.id,
            title: `${transaction.description} (${amount})`,
            start: date,
            allDay: true,
          };
        });
      }

      return {
        id: transaction.id,
        title: `${transaction.description} (${amount})`,
        start: transaction.date,
        allDay: true,
      };
    });
  }

  filterBy(key: string, value: unknown) {
    return new TemporalTransactions(
      this.transactions.filter((transaction) => transaction[key as keyof TemporalTransaction] === value),
    );
  }
}
