import { TemporalTransaction, TemporalTransactions } from '../transactions';

export interface TemporalAccount<TxType = TemporalTransaction[]> {
  id: string;
  name: string;
  description: string;
  balance: number;
  transactions: TxType;
}

export class TemporalAccounts {
  private accounts: TemporalAccount<TemporalTransactions>[] = [];

  constructor(accounts: TemporalAccount[] = []) {
    this.accounts = accounts.map((account) => {
      return {
        ...account,
        transactions: new TemporalTransactions(account.transactions),
      };
    });
  }

  public addAccount(account: TemporalAccount): void {
    this.accounts.push({
      ...account,
      transactions: new TemporalTransactions(account.transactions),
    });
  }

  public addTransactionToAccount(accountId: string, transaction: TemporalTransaction): void {
    this.accounts = this.accounts.map((account) => {
      if (account.id === accountId) {
        return {
          ...account,
          transactions: account.transactions.add(transaction),
        };
      }

      return account;
    });
  }

  public getAccountById(id: string): TemporalAccount<TemporalTransactions> | undefined {
    return this.accounts.find((account) => account.id === id);
  }

  public getAccountByName(name: string): TemporalAccount<TemporalTransactions> | undefined {
    return this.accounts.find((account) => account.name === name);
  }

  public getAccounts(): TemporalAccount<TemporalTransactions>[] {
    return this.accounts;
  }

  public getAllTransactions(): TemporalTransactions {
    return new TemporalTransactions(
      this.accounts.reduce((acc, account) => {
        return [...acc, ...account.transactions.getTransactions()];
      }, [] as TemporalTransaction[]),
    );
  }

  public removeAccount(id: string): void {
    this.accounts = this.accounts.filter((account) => account.id !== id);
  }

  public updateAccount(account: TemporalAccount): void {
    this.accounts = this.accounts.map((existingAccount) => {
      if (existingAccount.id === account.id) {
        return {
          ...account,
          transactions: new TemporalTransactions(account.transactions),
        };
      }

      return existingAccount;
    });
  }
}
