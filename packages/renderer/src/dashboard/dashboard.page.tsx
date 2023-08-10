import { useSSD } from "@shared/ssd";
import {
  FaSolidFileInvoiceDollar,
  FaSolidMoneyCheckDollar,
  FaSolidCashRegister,
} from "solid-icons/fa";
import {
  RiBusinessCalendarLine,
  RiFinanceShoppingBasket2Fill,
} from "solid-icons/ri";
import { createSignal } from "solid-js";
import { TemporalDashboardStats } from "./dashboard.types";

export default function Dashboard() {
  const store = useSSD();

  const [stats, setStats] = createSignal<TemporalDashboardStats>({
    numTransactionsInLastThirtyDays: 27,
    income: {
      next: "03/28",
      in: "2 days",
      monthlyAmount: 4593.21,
      prevMonthlyAmount: 4593.21 - 404.03,
    },
    expense: {
      next: "03/28",
      in: "2 days",
      monthlyAmount: 1248.24,
      prevMonthlyAmount: 1248.24 + 90.05,
    },
  });

  return (
    <>
      <div class="stats shadow-xl">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <FaSolidCashRegister size={32} fill="currentcolor" />
          </div>
          <div class="stat-title">Transactions</div>
          <div class="stat-value">
            {stats().numTransactionsInLastThirtyDays}
          </div>
          <div class="stat-desc">Last 30 days</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <RiBusinessCalendarLine size={32} />
          </div>
          <div class="stat-title">Next Income</div>
          <div class="stat-value">{stats().income.next}</div>
          <div class="stat-desc">In 2 days</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <FaSolidMoneyCheckDollar size={32} fill="currentcolor" />
          </div>
          <div class="stat-title">Monthly Income</div>
          <div class="stat-value">
            ${stats().income.monthlyAmount.toLocaleString()}
          </div>
          <div
            class={
              stats().income.monthlyAmount > stats().income.prevMonthlyAmount
                ? "stat-desc text-success"
                : "stat-desc text-error"
            }
          >
            {stats().income.monthlyAmount > stats().income.prevMonthlyAmount
              ? "↗︎"
              : "↘︎"}{" "}
            $
            {Math.abs(
              stats().income.monthlyAmount - stats().income.prevMonthlyAmount
            ).toFixed(2)}
            {" ("}
            {(
              ((stats().income.monthlyAmount -
                stats().income.prevMonthlyAmount) /
                stats().income.prevMonthlyAmount) *
              100
            ).toFixed(2)}
            {"%)"}
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <FaSolidFileInvoiceDollar size={32} fill="currentcolor" />
          </div>
          <div class="stat-title">Monthly Expenses</div>
          <div class="stat-value">
            ${stats().expense.monthlyAmount.toLocaleString()}
          </div>
          <div
            class={
              stats().expense.monthlyAmount > stats().expense.prevMonthlyAmount
                ? "stat-desc text-error"
                : "stat-desc text-success"
            }
          >
            {stats().expense.monthlyAmount > stats().expense.prevMonthlyAmount
              ? "↗︎"
              : "↘︎"}{" "}
            $
            {Math.abs(
              stats().expense.monthlyAmount - stats().expense.prevMonthlyAmount
            ).toFixed(2)}
            {" ("}
            {(
              ((stats().expense.monthlyAmount -
                stats().expense.prevMonthlyAmount) /
                stats().expense.prevMonthlyAmount) *
              100
            ).toFixed(2)}
            {"%)"}
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <RiFinanceShoppingBasket2Fill size={32} />
          </div>
          <div class="stat-title">Left to Spend</div>
          <div class="stat-value">
            $
            {(
              stats().income.monthlyAmount - stats().expense.monthlyAmount
            ).toFixed(2)}
          </div>
          <div class="stat-desc">Next Expense: {stats().expense.next}</div>
        </div>
      </div>

      <style jsx dynamic>
        {`
          main {
            height: calc(100% - 64px);
          }

          .stats {
            display: grid;
            margin: 24px;
            border: 1px solid hsl(var(--b3));
          }

          .card {
            margin: 24px;
            border: 1px solid hsl(var(--b3));
            height: calc(100% - 186px);
          }
        `}
      </style>
    </>
  );
}
