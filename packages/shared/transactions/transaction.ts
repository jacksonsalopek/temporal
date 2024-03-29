import { EventInput } from '@fullcalendar/core';
import Holidays from '@18f/us-federal-holidays';
import { RRule, RRuleSet } from 'rrule';

export enum TemporalTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface TemporalTransaction {
  id: string;
  type: TemporalTransactionType;
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
  /** Date (as unix timestamp) to boolean map */
  exclusions?: Map<number, boolean>;
  /** Date (as unix timestamp) to partial object, used to override properties */
  overrides?: Map<number, Partial<TemporalTransaction>>;
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
    // Have to double unwrap for some reason
    const data = JSON.parse(JSON.parse(json));
    return new TemporalTransactions(data.transactions);
  }

  toJSON() {
    return JSON.stringify({ transactions: this.transactions });
  }

  add(transaction: TemporalTransaction) {
    this.transactions = [...this.transactions, transaction];
    return this;
  }

  remove(id: string, allInstances = true, date?: Date) {
    if (allInstances) {
      this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
    } else {
      // To remove a particular instance of a recurring transaction, we first need to ensure that the transaction is a recurring transaction
      // Then, we want to add an exception to the rule for the date of the transaction
      const transaction = this.getById(id);
      if (transaction && date && isRecurringTransaction(transaction)) {
        transaction.exclusions = transaction.exclusions ?? new Map();
        transaction.exclusions.set(+date, true);
        this.edit(id, transaction);
      }
    }
    return this;
  }

  edit(id: string, transaction: Partial<TemporalTransaction>, allInstances = true, date?: Date) {
    if (allInstances) {
      const index = this.transactions.findIndex((transaction) => transaction.id === id);
      this.transactions[index] = {
        ...this.transactions[index],
        ...transaction,
      };
    } else {
      // To edit a particular instance of a recurring transaction, we first need to ensure that the transaction is a recurring transaction
      // Then, we want to add an override to the rule for the date of the transaction
      const tx = this.getById(id);
      if (tx && date && isRecurringTransaction(tx)) {
        tx.overrides = tx.overrides ?? new Map();
        tx.overrides.set(+date, {
          ...tx.overrides.get(+date),
          ...transaction,
        });
        this.edit(id, tx);
      }
    }
    return this;
  }

  getById(id: string) {
    return this.transactions.find((transaction) => transaction.id === id);
  }

  getInDateRange(startDate: Date, endDate: Date): TemporalTransactions {
    const inRangeTransactions: TemporalTransaction[] = this.getTransactions().flatMap((transaction) => {
      if (isRecurringTransaction(transaction)) {
        const ruleSet = new RRuleSet();
        const rule = RRule.fromString(transaction.rule);
        ruleSet.rrule(rule);

        let dates = ruleSet.between(startDate, endDate);

        // If we have exclusions, remove them from the dates
        if (transaction.exclusions) {
          dates = dates.filter((date) => !transaction.exclusions?.has(+date));
        }

        // Adjust for weekends and holidays
        if (!transaction.canOccurOnWeekends || !transaction.canOccurOnHolidays) {
          dates = dates.map((date) =>
            this.adjustForWeekendsAndHolidays(date, transaction.canOccurOnWeekends, transaction.canOccurOnHolidays),
          );
        }

        // For each adjusted date within the range, return a separate transaction
        return dates.map((date) => {
          // If we have overrides, use them
          if (transaction.overrides?.has(+date)) {
            return {
              ...transaction,
              ...transaction.overrides.get(+date),
              date,
            };
          }
          return {
            ...transaction,
            date,
          };
        });
      } else {
        return transaction.date >= startDate && transaction.date <= endDate ? [transaction] : [];
      }
    });

    return new TemporalTransactions(inRangeTransactions);
  }

  getSubtotalInRange(startDate: Date, endDate: Date) {
    return this.getInDateRange(startDate, endDate)
      .toCalendarEvents()
      .reduce((acc, event) => {
        const parts = event.title?.split('$');
        // rome-ignore lint/style/noNonNullAssertion: this is guaranteed to have a $ in it since we generated it
        const amount = Number(parts![parts!.length - 1].slice(0, -1));

        if (event.title?.charAt(event.title.lastIndexOf('$') - 1) === '-') {
          return acc - amount;
        }
        return acc + amount;
      }, 0);
  }

  getTransactions() {
    return this.transactions;
  }

  toCalendarEvents(): EventInput[] {
    return this.transactions.map((transaction) => {
      const amount = `${transaction.type === TemporalTransactionType.DEBIT ? '-$' : '$'}${transaction.amount.toFixed(
        2,
      )}`;

      return {
        id: transaction.id,
        title: `${transaction.description} (${amount})`,
        start: transaction.date,
        allDay: true,
        color: transaction.type === TemporalTransactionType.DEBIT ? 'hsl(var(--er))' : 'hsl(var(--su))',
      };
    });
  }

  filterBy(key: string, value: unknown) {
    return new TemporalTransactions(
      this.transactions.filter((transaction) => transaction[key as keyof TemporalTransaction] === value),
    );
  }

  adjustForWeekendsAndHolidays(date: Date, canOccurOnWeekends?: boolean, canOccurOnHolidays?: boolean): Date {
    const bankHolidays = Holidays.allForYear(new Date().getFullYear()).map((holiday) => holiday.date.toISOString());

    while (
      (!canOccurOnWeekends && (date.getDay() === 6 || date.getDay() === 0)) ||
      (!canOccurOnHolidays && bankHolidays.includes(date.toISOString()))
    ) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  }
}
