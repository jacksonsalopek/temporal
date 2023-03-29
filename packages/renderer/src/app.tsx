import { Component } from "solid-js";
import { Link, useRoutes, useLocation } from "solid-app-router";
import {
	RiSystemDashboardLine,
	RiBusinessCalendar2Line,
	RiBusinessLineChartLine,
	RiSystemSettings3Line,
} from "solid-icons/ri";
import { FaSolidTimeline } from "solid-icons/fa";
import { BiRegularPieChartAlt2 } from "solid-icons/bi";

import { routes } from "./routes";

const App: Component = () => {
	const location = useLocation();
	const Route = useRoutes(routes);
	const URL =
		process.env.NODE_ENV === "development" ? (
			<div class="navbar-center lg:flex flex-1">
				URL:&nbsp;<pre>{location.pathname}</pre>
			</div>
		) : (
			<div />
		);

	return (
		<>
			<div class="navbar bg-base-100">
				<div class="flex-none">
					<button
						class="btn btn-square btn-ghost drawer-button"
						title="Sidebar Expand/Collapse button"
						type="button"
						onClick={() => {
							document.getElementById("my-drawer")?.click();
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-5 h-5 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
				<div class="flex-1">
					<Link href="/" class="btn btn-ghost normal-case text-xl">
						Temporal
					</Link>
				</div>
				{URL}
				<div class="flex-none gap-2">
					<div class="form-control">
						<input
							type="text"
							placeholder="Search"
							class="input input-bordered"
						/>
					</div>
				</div>
			</div>

			<div class="drawer">
				<input id="my-drawer" type="checkbox" class="drawer-toggle" />
				<div class="drawer-content">
					<main>
						<Route />
					</main>
				</div>
				<div class="drawer-side">
					<label htmlFor="my-drawer" class="drawer-overlay" />
					<ul class="menu p-4 w-80 bg-base-100 text-base-content">
						<li>
							<Link href="/">
								<RiSystemDashboardLine /> Dashboard
							</Link>
						</li>
						<li>
							<Link href="/calendar">
								<RiBusinessCalendar2Line />
								Calendar
							</Link>
						</li>
						<li>
							<Link href="/timeline">
								<FaSolidTimeline />
								Timeline
							</Link>
						</li>
						<li>
							<Link href="/investments">
								<RiBusinessLineChartLine />
								Investments
							</Link>
						</li>
						<div class="bottom-0">
							<div class="divider" />
							<li>
								<Link href="/">
									<RiSystemSettings3Line /> Settings
								</Link>
							</li>
						</div>
					</ul>
				</div>
			</div>
		</>
	);
};

export default App;
