import { TemporalTransactionType } from '../transactions';
import { TemporalAccounts } from './account';

describe('TemporalAccounts', () => {
  let accounts: TemporalAccounts;

  beforeEach(() => {
    accounts = new TemporalAccounts();
  });

  it('should be defined', () => {
    expect(accounts).toBeDefined();
  });

  it('should add an account', () => {
    const account = {
      id: '1',
      name: 'Test',
      description: 'Checking',
      balance: 0,
      transactions: [],
    };

    accounts.addAccount(account);

    expect(accounts.getAccountById('1')?.name).toBe(account.name);
  });

  it('should add a transaction to an account', () => {
    const account = {
      id: '1',
      name: 'Test',
      description: 'Checking',
      balance: 0,
      transactions: [],
    };
    const transaction = {
      id: '1',
      type: TemporalTransactionType.CREDIT,
      amount: 100,
      date: new Date(),
      description: 'Test',
      tags: [],
    };

    accounts.addAccount(account);
    accounts.addTransactionToAccount('1', transaction);

    expect(accounts.getAccountById('1')?.transactions.getById('1')).toBe(transaction);
  });
});
