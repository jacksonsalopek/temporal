import { DashboardSlice } from '@/store/dashboard';
import { useSSD } from '@shared/ssd';
import { TemporalTransactionType } from '@shared/transactions';

export default function AddTransactionDetailsStep() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;

  const recurringSection = () => {
    return (
      <>
        {/* <div class="divider" /> */}
        <textarea
          class="textarea textarea-bordered"
          placeholder="Recurrance Rule"
          onInput={(e) => dashboardSlice.setAddTransactionFormRecurringRule(e.currentTarget.value)}
          value={dashboardSlice.getAddTransactionFormRecurringRule() ?? ''}
        />
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Can Occur on Weekends</span>
            <input
              type="checkbox"
              class="toggle toggle-accent"
              onChange={(e) => dashboardSlice.setAddTransactionFormCanOccurOnWeekends(e.currentTarget.checked)}
              checked={dashboardSlice.getAddTransactionFormCanOccurOnWeekends() ?? false}
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Can Occur on Bank Holidays</span>
            <input
              type="checkbox"
              class="toggle toggle-accent"
              onChange={(e) => dashboardSlice.setAddTransactionFormCanOccurOnHolidays(e.currentTarget.checked)}
              checked={dashboardSlice.getAddTransactionFormCanOccurOnHolidays() ?? false}
            />
          </label>
        </div>
      </>
    );
  };

  return (
    <>
      <p class="text-center">
        <b>Step 2:</b> Add some details about the transaction
      </p>
      <br />
      <div class="form-control">
        <label class="label">
          <span class="label-text">Type</span>
        </label>
        <div class="btn-group">
          <input
            type="radio"
            name="options"
            data-title="Credit"
            class="btn"
            onClick={() => dashboardSlice.setAddTransactionFormType(TemporalTransactionType.CREDIT)}
          />
          <input
            type="radio"
            name="options"
            data-title="Debit"
            class="btn"
            onClick={() => dashboardSlice.setAddTransactionFormType(TemporalTransactionType.DEBIT)}
          />
        </div>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Amount</span>
        </label>
        <div class="input-group">
          <span>$</span>
          <input
            type="text"
            class="input input-bordered"
            placeholder="e.g. 10.00"
            value={dashboardSlice.getAddTransactionFormAmount() ?? ''}
            onInput={(e) => {
              const value = e.currentTarget.value;
              const regex = /^\d*\.?\d{0,2}$/;

              // if (value === '') {
              //   dashboardSlice.setAddTransactionFormAmount('0');
              if (regex.test(value)) {
                dashboardSlice.setAddTransactionFormAmount(value);
              } else {
                // If it doesn't match the regex, reset the input's value to the last valid state value
                e.currentTarget.value = dashboardSlice.getAddTransactionFormAmount() ?? '';
              }
            }}
          />
        </div>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="e.g. Groceries"
          value={dashboardSlice.getAddTransactionFormDescription() ?? ''}
          onInput={(e) => dashboardSlice.setAddTransactionFormDescription(e.currentTarget.value)}
        />
      </div>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Recurring</span>
          <input
            type="checkbox"
            class="toggle toggle-secondary"
            onChange={(e) => dashboardSlice.setAddTransactionFormRecurring(e.currentTarget.checked)}
          />
        </label>
      </div>
      {dashboardSlice.getAddTransactionFormRecurring() && recurringSection()}
    </>
  );
}
