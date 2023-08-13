import { DashboardSlice } from "@/store/dashboard";
import { TransactionsSlice } from "@/store/transactions";
import { useSSD } from "@shared/ssd";

export default function Result() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;
  const transactionsSlice = store?.refs.transactions as TransactionsSlice;

  return (
    <div class="form-control w-full">
      <label class="label label-text">
        Subtotal on{" "}
        {dashboardSlice.getGetSubtotalOnDateFormDate()?.toLocaleDateString()}
      </label>
      <div class="input-group">
        <span>$</span>
        <input
          type="text"
          class="input"
          disabled
          value={transactionsSlice
            .getSubtotalInRange({
              startDate: new Date(),
              // rome-ignore lint/style/noNonNullAssertion: will be defined at this point
              endDate: dashboardSlice.getGetSubtotalOnDateFormDate()!,
            })
            ?.toFixed(2)}
        />
      </div>
    </div>
  );
}
