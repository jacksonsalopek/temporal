import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/web-component/global";
import type { FullCalendarElement } from "@fullcalendar/web-component";
import { createSignal, onMount } from "solid-js";

interface CalendarProps {
	options?: CalendarOptions;
}

export default function Calendar(props: CalendarProps) {
	const [calendarEl, setCalendarEl] = createSignal<
		FullCalendarElement | undefined
	>(undefined);
	const [rect, setRect] = createSignal({
		height: window.innerHeight,
		width: window.innerWidth,
	});

	const windowResizeHandler = (event: Event) => {
		console.info("resize", event);
		setRect({ height: window.innerHeight, width: window.innerWidth });
	};

	const calendarResizeHandler: CalendarOptions["windowResize"] = (instance) => {
		console.info("windowResize");
		instance.view.calendar.updateSize();
	};

	const defaultOptions: CalendarOptions = {
		initialView: "dayGridMonth",
		plugins: [dayGridPlugin, interactionPlugin],
		headerToolbar: {
			left: "prev,next",
			center: "title",
			right: "today",
		},
		height: "80vh",
		editable: true,
		selectable: true,
		customButtons: {},
		select: (date) => {
			console.info("select", date);
		},
		windowResize: calendarResizeHandler,
	};

	onMount(() => {
		window.addEventListener("resize", windowResizeHandler);
		const element = document.querySelector("full-calendar");
		const buttonGroups = document.getElementsByClassName("fc-button-group");
		const buttons = document.getElementsByClassName("fc-button");
		if (element) {
			// If element exists, pass options to it and update component state with element
			element.options = props.options || defaultOptions;
			setCalendarEl(element);

			// Add DaisyUI classes to calendar buttons
			for (const buttonGroup of buttonGroups) {
				buttonGroup.classList.add("btn-group");
			}

			for (const button of buttons) {
				button.classList.add("btn");
				button.classList.remove("fc-button", "fc-button-primary");
			}

			// Necessary since next button doesn't seem to render
			const nextButton = document.getElementsByClassName(
				"fc-next-button",
			)[0] as HTMLButtonElement;
			nextButton.classList.add("btn");
			nextButton.classList.remove("fc-button", "fc-button-primary");

			const todayButton = document.getElementsByClassName(
				"fc-today-button",
			)[0] as HTMLButtonElement;
			todayButton.classList.add("btn");

			console.info("Loaded calendar");
		}
	});

	return (
		<>
			<full-calendar
				options={props.options || defaultOptions}
				class="grid w-[80vw]"
			/>
			<style jsx dynamic>
				{`
					full-calendar {
						--fc-border-color: hsl(var(--b2));
						margin: 24px auto;
					}

					.fc-day {
						background-color: hsl(var(--b1)) !important;
					}

					.fc-day.fc-day-other {
						background-color: hsl(var(--b3)) !important;
					}

					.fc-day.fc-col-header-cell {
						background-color: hsl(var(--b2)) !important;
					}

					.fc-day.fc-day-today {
						background-color: hsl(var(--p)) !important;
					}

					.fc-daygrid-day-number {
						font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
						font-size: 0.75rem;
					}
				`}
			</style>
		</>
	);
}
