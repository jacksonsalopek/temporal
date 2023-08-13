import {
  TemporalTransaction,
  TemporalTransactionType,
} from "@shared/transactions";
import { createSignal, onMount } from "solid-js";
import { styled } from "solid-styled-components";

export const TransactionBadge = styled("div")`
  border: none;
  color: #fff;
`;

export default function TransactionsTable(props: {
  transactions: TemporalTransaction[];
}) {
  const [currentPage, setCurrentPage] = createSignal(0);
  const [itemsPerPage, setItemsPerPage] = createSignal(10);
  const calculateItemsPerPage = () => {
    // 248 is the height of the navbar + the height of the stats container + table header + table footer, including the padding
    const remainingHeight = window.innerHeight - 370.5;
    const rowHeight = 56.5;
    return Math.floor(remainingHeight / rowHeight);
  };
  const totalPages = () => {
    return Math.ceil(props.transactions.length / itemsPerPage());
  };

  // resize the table when the window is resized
  onMount(() => {
    setItemsPerPage(calculateItemsPerPage());
    window.addEventListener("resize", () => {
      setItemsPerPage(calculateItemsPerPage());
    });
  });

  return (
    <div class="overflow-x-auto mt-4">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {props.transactions.length === 0 && (
            <tr>
              <td colspan="4" class="text-center">
                <i>No transactions yet!</i>
              </td>
            </tr>
          )}
          {props.transactions
            .slice(
              itemsPerPage() * currentPage(),
              itemsPerPage() * currentPage() + itemsPerPage()
            )
            .map((transaction) => (
              <tr>
                <td class="font-bold">
                  {transaction.date?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
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
          {props.transactions.length > itemsPerPage() && (
            <tr>
              <td colspan="4" class="text-center">
                <div class="btn-group">
                  {Array.from(Array(totalPages()).keys()).map((page) => (
                    <button
                      class={`btn${
                        page === currentPage() ? " btn-active" : ""
                      }`}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
