import { DashboardSlice } from "@/store/dashboard";
import { useSSD } from "@shared/ssd";
import { TEMPORAL_NINETY_DAYS } from "@shared/constants";
import {
  FaSolidCalendarPlus,
  FaSolidCashRegister,
  FaSolidFileInvoiceDollar,
  FaSolidMinus,
  FaSolidMoneyCheckDollar,
  FaSolidPlus,
} from "solid-icons/fa";
import {
  RiBusinessCalendarLine,
  RiBusinessLineChartLine,
  RiFinanceShoppingBasket2Fill,
} from "solid-icons/ri";
import { styled } from "solid-styled-components";
import AddTransactionForm from "./add-transaction-form/add-transaction-form";
import TransactionsTable from "./transactions-table";
import { createSignal } from "solid-js";
import { TransactionsSlice } from "@/store/transactions";
import { get } from "http";

export const StatsContainer = styled("div")`
  display: grid;
  border: 1px solid hsl(var(--b3));
  border-radius: var(--rounded-btn);
`;

export const FloatingActionBtn = styled("button")`
  position: absolute;
  right: 24px;
  bottom: 88px;
  ${(props: { isToggled: boolean }) =>
    props.isToggled
      ? "border-top-right-radius: 0; border-top-left-radius: 0;"
      : ""}
`;

export const FloatingActionMenu = styled("ul")`
  opacity: 1;
  transition: opacity 2s ease-in-out;
  position: absolute;
  right: 24px;
  bottom: 136px;
  ${(props: { isToggled: boolean }) =>
    props.isToggled ? "border-bottom-right-radius: 0;" : ""}
`;

export const AddTransactionDialog = styled("dialog")`
  width: 100%;
  height: 100%;
  margin: 0;
  max-width: 100%;
  max-height: 100%;
`;

export const CreditRadioBtn = styled("input")`
  background-color: hsl(var(--su));
  border: none;

  &:hover,
  &:checked {
    background-color: #2ba97a;
    color: #fff;
  }
`;

export const DebitRadioBtn = styled("input")`
  background-color: hsl(var(--er));
  border: none;

  &:hover,
  &:checked {
    background-color: #c65b5b;
    color: #fff;
  }
`;

export default function Dashboard() {
  const store = useSSD();

  const dashboardSlice = store?.refs.dashboard as DashboardSlice;
  const transactionsSlice = store?.refs.transactions as TransactionsSlice;
  const isFABToggled = () => dashboardSlice.isFABToggled();

  const handleFormCompletion = (complete: boolean) => {
    if (complete) {
      setStats(dashboardSlice.getStats());
      setTransactions(getTransactions());
    }
  };

  const [stats, setStats] = createSignal(dashboardSlice.getStats());

  const today = new Date();
  const getTransactions = () =>
    transactionsSlice
      .getInRange({
        startDate: today,
        endDate: new Date(+today + TEMPORAL_NINETY_DAYS),
      })
      ?.getTransactions()
      .sort((a, b) => +a.date - +b.date) ?? [];
  const [transactions, setTransactions] = createSignal(getTransactions());

  return (
    <>
      <StatsContainer class="stats shadow-xl">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <FaSolidCashRegister size={32} fill="currentcolor" />
          </div>
          <div class="stat-title">Transactions</div>
          <div class="stat-value">
            {stats()?.numTransactionsInNextNinetyDays}
          </div>
          <div class="stat-desc">In next 90 days</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <RiBusinessCalendarLine size={32} />
          </div>
          <div class="stat-title">Next Income</div>
          <div class="stat-value">{stats().income.next}</div>
          <div class="stat-desc">In {stats().income.in} days</div>
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
      </StatsContainer>

      <TransactionsTable transactions={transactions()} />

      <FloatingActionMenu
        isToggled={isFABToggled()}
        class={`menu bg-base-200 w-56 rounded-btn${
          isFABToggled() ? "" : " hidden"
        }`}
      >
        <li>
          <a
            // rome-ignore lint/a11y/useValidAnchor: state handles this, not href
            onClick={() => {
              dashboardSlice.toggleAddTransactionModal();
              dashboardSlice.toggleFAB();
            }}
          >
            <FaSolidCalendarPlus size={24} fill="currentcolor" /> Add
            Transaction
          </a>
        </li>
        <li>
          {/* rome-ignore lint/a11y/useValidAnchor: this doesn't redirect (necessarily) */}
          <a>
            <RiBusinessLineChartLine size={24} fill="currentcolor" /> Track
            Investment
          </a>
        </li>
      </FloatingActionMenu>

      <FloatingActionBtn
        class="btn btn-primary btn-square"
        type="button"
        title="Floating Action Button"
        isToggled={isFABToggled()}
        onClick={() => dashboardSlice.toggleFAB()}
      >
        {isFABToggled() ? (
          <FaSolidMinus size={24} fill="currentcolor" />
        ) : (
          <FaSolidPlus size={24} fill="currentcolor" />
        )}
      </FloatingActionBtn>

      <AddTransactionDialog id="dashboard-add-transaction-modal" class="modal">
        <form method="dialog" class="modal-box">
          <h3 class="font-bold text-lg">Add New Transaction</h3>
          <div class="divider" />
          <AddTransactionForm />
          <div class="modal-action">
            <button
              type="button"
              class="btn btn-primary"
              onClick={() =>
                handleFormCompletion(
                  dashboardSlice.progressOrSubmitAddTransactionForm()
                )
              }
              disabled={!dashboardSlice.isAddTransactionFormValid()}
            >
              {dashboardSlice.isAddTransactionFormComplete()
                ? "Add Tx"
                : "Next"}
            </button>
            <button
              type="button"
              class="btn"
              onClick={() => dashboardSlice.toggleAddTransactionModal()}
            >
              Close
            </button>
          </div>
        </form>
      </AddTransactionDialog>

      <style jsx dynamic>
        {`
          .hidden {
            pointer-events: none;
            opacity: 0;
          }

          ::backdrop(dashboard-add-transaction-modal) {
            background: rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
    </>
  );
}
