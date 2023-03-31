import {
	FaSolidFileInvoiceDollar,
	FaSolidMoneyCheckDollar,
	FaSolidCashRegister,
} from "solid-icons/fa";
import {
	RiBusinessCalendarLine,
	RiBusinessSendPlane2Fill,
	RiFinanceShoppingBasket2Fill,
} from "solid-icons/ri";
import { createSignal } from "solid-js";

interface TemporalStats {
	transactions: number;
	income: {
		next: string;
		in: string;
		monthlyAmount: number;
		prevMonthlyAmount: number;
	};
	expense: {
		next: string;
		in: string;
		monthlyAmount: number;
		prevMonthlyAmount: number;
	};
}

interface TemporalAssistantMessage {
	content: string;
	type: "success" | "error";
	sender: "user" | "assistant";
	timestamp: number;
}

export default function Home() {
	const [count, setCount] = createSignal(0);
	const [stats, setStats] = createSignal<TemporalStats>({
		transactions: 27,
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
	const [assistantMessages, setAssistantMessages] = createSignal<
		TemporalAssistantMessage[]
	>([
		{
			content: "Hi! I'm your assistant. How can I help you?",
			type: "success",
			timestamp: Date.now(),
			sender: "assistant",
		},
		{
			content:
				'P.S. You can ask me something like: "Take me to my calendar, viewing May" or "What were my last 3 transactions?"',
			type: "success",
			timestamp: Date.now() + 1,
			sender: "assistant",
		},
	]);

	const sendMessage = () => {
		const element = document.getElementById(
			"assistant-message-input",
		) as HTMLInputElement;
		setAssistantMessages([
			...assistantMessages(),
			{
				content: element?.value,
				type: "success",
				timestamp: Date.now(),
				sender: "user",
			},
		]);
		element.value = "";
	};

	return (
		<>
			<div class="stats shadow-xl">
				<div class="stat">
					<div class="stat-figure text-secondary">
						<FaSolidCashRegister size={32} />
					</div>
					<div class="stat-title">Transactions</div>
					<div class="stat-value">{stats().transactions}</div>
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
						<FaSolidMoneyCheckDollar size={32} />
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
							stats().income.monthlyAmount - stats().income.prevMonthlyAmount,
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
						<FaSolidFileInvoiceDollar size={32} />
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
							stats().expense.monthlyAmount - stats().expense.prevMonthlyAmount,
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

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Ask Assistant</h2>
					<div class="assistant-window h-full">
						{assistantMessages()
							.sort((a, b) => a.timestamp - b.timestamp)
							.map((message) => (
								<div
									class={
										message.sender === "assistant"
											? "chat chat-start"
											: "chat chat-end"
									}
								>
									<div class="chat-bubble chat-bubble-primary">
										{message.content}
									</div>
								</div>
							))}
					</div>
					<div class="card-actions justify-center">
						<div class="form-control w-full">
							<div class="input-group">
								<input
									type="text"
									placeholder="Send a message…"
									class="input input-bordered w-full"
									id="assistant-message-input"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											sendMessage();
										}
									}}
								/>
								<button
									class="btn btn-square"
									aria-label="Send question to assistant button"
									onClick={() => {
										sendMessage();
									}}
								>
									<RiBusinessSendPlane2Fill size={24} />
								</button>
							</div>
						</div>
					</div>
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
