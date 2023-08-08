import { createSignal, onMount } from "solid-js";

/**
 * @TODO - Replace this with the actual transaction type
 */
interface PLACEHOLDERTransaction {
	id: string;
	date: number;
	amount: number;
	type: "income" | "expense" | "calculation";

	/**
	 * The subtype of the transaction. For example, if the transaction is an income, the subtype could be "salary".
	 * If the transaction is an expense, the subtype could be "Transfer", "Investment", etc.
	 */
	subtype: string;

	/**
	 * Calculation callback function. This function will be called with the transactions array pre-filtered by timestamp, using the current date.
	 * @param transactions
	 * @returns
	 */
	calculationFunction?: (transactions: PLACEHOLDERTransaction[]) => number;
}

/**
 * Timeline component options
 */
export interface TimelineOptions {
	layout: "horizontal" | "vertical";
	transactions: PLACEHOLDERTransaction[];
}

/**
 * Timeline component props
 */
export interface TimelineProps {
	options?: TimelineOptions;
}

/**
 * Timeline component
 * @param props
 * @returns
 */
export default function Timeline(props: TimelineProps) {
	const [transactions, setTransactions] = createSignal<
		Record<number, PLACEHOLDERTransaction[]>
	>({});
	// Used for date selection purposes
	const [selectedDate, setSelectedDate] = createSignal<number | undefined>(
		undefined,
	);
	// Used for calculating the moving totals
	const [movingTotals, setMovingTotals] = createSignal<Record<number, number>>(
		{},
	);

	/**
	 * Group transactions by date
	 * @param transactions the transactions to group
	 * @returns {Record<number, PLACEHOLDERTransaction[]>} Record where the key is the date
	 */
	const groupTransactionsByDate = (
		transactions: PLACEHOLDERTransaction[],
	): Record<number, PLACEHOLDERTransaction[]> => {
		const groupedTransactions: Record<number, PLACEHOLDERTransaction[]> = {};
		transactions
			.filter((t) => t.type !== "calculation")
			.forEach((transaction) => {
				if (groupedTransactions[transaction.date]) {
					groupedTransactions[transaction.date].push(transaction);
				} else {
					groupedTransactions[transaction.date] = [transaction];
				}
			});
		return groupedTransactions;
	};

	/**
	 * Convert a timestamp to a date string
	 * @param timestamp UNIX timestamp to convert
	 * @returns timestamp as a date string
	 */
	const timestampToDateString = (timestamp: number) => {
		const date = new Date(timestamp);
		return `${date.getMonth() + 1}/${date.getDate()}`;
	};

	/**
	 * Determine if a timestamp is today
	 * @param timestamp UNIX timestamp to check
	 * @returns if the timestamp is today
	 */
	const isToday = (timestamp: number): boolean => {
		const date = new Date(timestamp);
		const today = new Date();
		return (
			date.getFullYear() === today.getFullYear() &&
			date.getMonth() === today.getMonth() &&
			date.getDate() === today.getDate()
		);
	};

	/**
	 * Adds a new moving total to the moving totals object. Used in the `onMount` hook.
	 * @param timestamp
	 * @param amount
	 */
	const addMovingTotal = (timestamp: number, amount: number) => {
		const newMovingTotals = { ...movingTotals() };
		newMovingTotals[timestamp] = amount;
		setMovingTotals(newMovingTotals);
	};

	onMount(() => {
		// Group transactions by date and set the transactions signal
		setTransactions(groupTransactionsByDate(props.options?.transactions ?? []));

		// Calculate the moving totals
		Object.keys(transactions()).forEach((timestamp) => {
			const timestampNumber = +timestamp;
			const transactionsForDate = transactions()[timestampNumber];
			const total = transactionsForDate.reduce(
				(total, transaction) => total + transaction.amount,
				0,
			);
			addMovingTotal(timestampNumber, total);
		});
	});

	return (
		<>
			<div
				class={`m-20 overflow-${
					props.options?.layout === "vertical" ? "y" : "x"
				}-auto`}
			>
				<ul
					class={`steps ${
						props.options?.layout === "horizontal"
							? "steps-horizontal"
							: "steps-vertical"
					}`}
				>
					{Object.keys(transactions())
						.sort((a, b) => +a - +b)
						.map((transactionTimestamp) => {
							const timestamp = +transactionTimestamp;
							return (
								<li
									class={`step${isToday(timestamp) ? " step-warning" : ""} ${
										selectedDate() === timestamp ? " step-primary" : ""
									}`}
								>
									<div
										class={`step-content rounded-lg ${
											props.options?.layout === "horizontal"
												? " self-start"
												: " self-center"
										}`}
									>
										<h1
											class={`step-date text-xl font-light ${
												isToday(timestamp) ? "text-warning" : "text-secondary"
											}`}
										>
											{isToday(timestamp)
												? "Today"
												: timestampToDateString(timestamp)}
										</h1>
										<div class="divider">
											<span class="font-semibold">transactions</span>
										</div>
										<div class="card step-transactions mx-6">
											<div class="step-transaction">
												<table class="table w-full">
													<thead>
														<tr>
															<th />
															<th>Type</th>
															<th>Amount</th>
														</tr>
													</thead>
													<tbody>
														{transactions()[timestamp].map(
															(transaction, index) => (
																<tr>
																	<td>{index + 1}</td>
																	<td class="capitalize">
																		{transaction.subtype.toLowerCase()}
																	</td>
																	<td
																		class={
																			transaction.type === "expense"
																				? "text-error"
																				: "text-success"
																		}
																	>
																		{transaction.amount < 0
																			? `($${Math.abs(
																					transaction.amount,
																			  ).toFixed(2)})`
																			: `$${transaction.amount.toFixed(2)}`}
																	</td>
																</tr>
															),
														)}
													</tbody>
												</table>
											</div>
										</div>
										<div class="divider">
											<span class="font-semibold">analytics</span>
										</div>
										<div>
											Day's Total:{" $"}
											{transactions()
												[timestamp].reduce(
													(accum, curr) => accum + curr.amount,
													0,
												)
												.toFixed(2)}
										</div>
										<div>
											{/* TODO Better negative number display */}
											Moving Total:{" $"}
											{movingTotals()[timestamp]?.toFixed(2)}
										</div>
									</div>
								</li>
							);
						})}
					<li class="step">
						<button
							class={`btn btn-primary${
								props.options?.layout === "horizontal" ? " self-start" : ""
							}`}
							onClick={() => console.log("TODO functionality")}
						>
							Add Transaction
						</button>
					</li>
				</ul>
			</div>
			<style jsx scoped>
				{`
          .step-content {
            border: 1px solid hsl(var(--b2));
            padding: 1rem;
          }
        `}
			</style>
		</>
	);
}
