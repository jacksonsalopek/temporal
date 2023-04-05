import { Component, createSignal } from "solid-js";
import { Link, useRoutes, useLocation } from "solid-app-router";
import {
	RiSystemDashboardLine,
	RiBusinessCalendar2Line,
	RiBusinessLineChartLine,
	RiSystemSettings3Line,
	RiSystemSearchEyeLine,
} from "solid-icons/ri";
import {
	FaSolidCircle,
	FaSolidCircleMinus,
	FaSolidCirclePlus,
	FaSolidCircleXmark,
	FaSolidTimeline,
} from "solid-icons/fa";
import { OcSidebarcollapse3, OcSidebarexpand3 } from "solid-icons/oc";

import { routes } from "./routes";

const App: Component = () => {
	const [sidebarOpen, setSidebarOpen] = createSignal(false);
	const [hoveringWindowButtons, setHoveringWindowButtons] = createSignal(false);
	const location = useLocation();
	const Route = useRoutes(routes);
	const initialWindowButtons = (
		<>
			<FaSolidCircle size={12} class="window-button" />
			<FaSolidCircle size={12} class="window-button" />
			<FaSolidCircle size={12} class="window-button" />
		</>
	);
	const hoverWindowButtons = (
		<>
			<FaSolidCircleXmark
				size={12}
				class="window-button fill-error"
				onClick={() => {
					window.electron.send("close");
				}}
			/>
			<FaSolidCircleMinus
				size={12}
				class="window-button fill-warning"
				onClick={() => {
					window.electron.send("minimize");
				}}
			/>
			<FaSolidCirclePlus
				size={12}
				class="window-button fill-success"
				onClick={() => {
					window.electron.send("maximize");
				}}
			/>
		</>
	);

	const getNameFromPathname = (pathname: string) => {
		if (pathname === "/") {
			return "Dashboard";
		}
		const name = pathname.split("/")[1];
		return name.charAt(0).toUpperCase() + name.slice(1);
	};

	return (
		<div class="mockup-window bg-neutral">
			<div
				id="window-buttons"
				class="grid gap-2 ml-4 mt-1.5"
				onMouseEnter={(e) => {
					setHoveringWindowButtons(true);
				}}
				onMouseLeave={(e) => {
					setHoveringWindowButtons(false);
				}}
			>
				{hoveringWindowButtons() ? hoverWindowButtons : initialWindowButtons}
			</div>
			<div class="navbar bg-neutral text-primary-content pl-24 -my-5">
				<div class="flex-none">
					<button
						class="btn btn-square btn-ghost drawer-button"
						title="Sidebar Expand/Collapse button"
						type="button"
						onClick={() => {
							document.getElementById("my-drawer")?.click();
							setSidebarOpen(!sidebarOpen());
						}}
					>
						{sidebarOpen() ? (
							<OcSidebarcollapse3 size={24} class="rotate-180" />
						) : (
							<OcSidebarexpand3 size={24} class="rotate-180" />
						)}
					</button>
				</div>
				<div class="flex-none normal-case text-xl ml-2 font-semibold">
					{getNameFromPathname(location.pathname)}
				</div>
				<div class="navbar-center lg:flex flex-1" />
				<div class="flex-none gap-2">
					<div class="form-control">
						<div class="input-group">
							<input type="text" placeholder="Search…" class="input" />
							<button
								class="btn btn-square bg-base-100 border-none"
								title="Search button"
							>
								<RiSystemSearchEyeLine size={24} />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="drawer mt-5">
				<input id="my-drawer" type="checkbox" class="drawer-toggle" />
				<div class="drawer-content">
					<main>
						<Route />
					</main>
				</div>
				<div class="drawer-side">
					<label class="drawer-overlay" />
					<ul class="menu p-4 pb-20 w-60 bg-base-100 text-base-content">
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
						<div class="flex-grow"/>
						<div class="divider" />
							<li class="bottom-0">
								<Link href="/settings">
									<RiSystemSettings3Line /> Settings
								</Link>
							</li>
					</ul>
				</div>
			</div>
			<style jsx global>{`
				/* Add global styles here */
				body {
					overflow: hidden;
				}
				.navbar-center {
					-webkit-app-region: drag;
					height: 32px;
				}
				#root>.mockup-window {
					overflow: hidden;
				}
				#root>.mockup-window:before {
					content: none;
				}
				#window-buttons {
					grid-template-columns: repeat(3, 1fr);
					position: absolute;
					-webkit-app-region: no-drag;
				}
			`}</style>
		</div>
	);
};

export default App;
