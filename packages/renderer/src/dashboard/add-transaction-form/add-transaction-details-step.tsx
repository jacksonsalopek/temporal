import { DashboardSlice } from '@/store/dashboard';
import { useSSD } from '@shared/ssd';

export default function AddTransactionDetailsStep() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;

  return (
    <>
      <p class="text-center">
        <b>Step 2:</b> Add some details about the transaction
      </p>
      <br />
      <div class="form-control">
        <label class="label">
          <span class="label-text">Amount</span>
        </label>
        <div class="join">
          <span class="join-item mr-1">$</span>
          <input
            type="text"
            class="input input-bordered join-item"
            pattern="^d*.?d{0,2}$" // simple regex to allow numbers with up to two decimal places
            placeholder="e.g. 10.00"
            value={dashboardSlice.getAddTransactionFormAmount() ?? ''}
            onInput={(e) => {
              const value = e.currentTarget.value;
              const regex = /^\d*\.?\d{0,2}$/;

              if (value === '') {
                dashboardSlice.setAddTransactionFormAmount('0');
              } else if (regex.test(value)) {
                dashboardSlice.setAddTransactionFormAmount(value);
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
    </>
  );
}
