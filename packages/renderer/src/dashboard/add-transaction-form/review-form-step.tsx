import { DashboardSlice } from "@/store/dashboard";
import { useSSD } from "@shared/ssd";
import { TemporalTransactionType } from "@shared/transactions";
import { styled } from "solid-styled-components";

export const AmountInput = styled("input")`
  color: hsl(
    var(
      ${(props: { ttype?: string }) =>
        props.ttype === TemporalTransactionType.CREDIT ? "--su" : "--er"}
    )
  );
`;

export default function ReviewFormStep() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;
  const formData = dashboardSlice.getAddTransactionFormData();
  const date = () => {
    const d = dashboardSlice
      .getAddTransactionFormDate()
      ?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    const isRecurring = dashboardSlice.getAddTransactionFormRecurring();
    if (isRecurring) {
      return `${d} (recurring)`;
    }
    return d;
  };

  return (
    <>
      <p class="text-center">
        <b>Step 3:</b> Review
      </p>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Tx Date</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          value={date()}
          disabled
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          value={formData?.description}
          disabled
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Amount</span>
        </label>
        <AmountInput
          type="text"
          ttype={formData?.type}
          class="input input-bordered"
          value={`$${formData?.amount}`}
          disabled
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Tags</span>
        </label>
        <div class="flex flex-wrap gap-2">
          {formData?.tags?.map((tag) => (
            <span class="badge badge-primary gap-2">{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}
