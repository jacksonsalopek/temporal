import { TemporalTransaction, TemporalTransactions } from '../transaction';

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

  public getAccountById(id: string): TemporalAccount<TemporalTransactions> | undefined {
    return this.accounts.find((account) => account.id === id);
  }

  public getAccountByName(name: string): TemporalAccount<TemporalTransactions> | undefined {
    return this.accounts.find((account) => account.name === name);
  }

  public getAccounts(): TemporalAccount<TemporalTransactions>[] {
    return this.accounts;
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
