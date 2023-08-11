import { TransactionsSlice } from "@/store/transactions";
import { useSSD } from "@shared/ssd";
import { TemporalTransactionType } from "@shared/transactions";
import { styled } from "solid-styled-components";

export const TransactionBadge = styled("div")`
  border: none;
  color: #fff;
`;

export default function TransactionsTable() {
  const store = useSSD();
  const transactionsSlice = store?.refs.transactions as TransactionsSlice;

  const transactions = () =>
    transactionsSlice
      .getInRange({
        startDate: new Date(),
        endDate: new Date(),
      })
      ?.getTransactions();

  return (
    <div class="overflow-x-auto mt-4">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {transactions()?.map((transaction) => (
            <tr>
              <td>
                {transaction.date?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td
                class={
                  transaction.type === TemporalTransactionType.CREDIT
                    ? "text-success"
                    : "text-error"
                }
              >
                {transaction.type}
              </td>
              <td>{transaction.description}</td>
              <td
                class={
                  transaction.type === TemporalTransactionType.CREDIT
                    ? "text-success"
                    : "text-error"
                }
              >
                {`${
                  transaction.type === TemporalTransactionType.CREDIT
                    ? "$"
                    : "-$"
                }${transaction.amount.toFixed(2)}`}
              </td>
              <td>
                {transaction.tags.map((tag) => (
                  <TransactionBadge class="badge bg-primary">
                    {tag}
                  </TransactionBadge>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
