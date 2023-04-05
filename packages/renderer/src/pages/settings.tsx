import { JSX, createEffect, createSignal, lazy } from "solid-js";
import type { AccountsSettingsPageOptions } from "../components/settings/accounts";
import type { AppearanceSettingsPageOptions } from "../components/settings/appearance";
import type { GeneralSettingsPageOptions } from "../components/settings/general";
import type { ShortcutsSettingsPageOptions } from "../components/settings/shortcuts";

// Subroute components
import GeneralSettingsPage from "../components/settings/general";
const AccountsSettingsPage = lazy(
	() => import("../components/settings/accounts"),
);
const AppearancePage = lazy(() => import("../components/settings/appearance"));
const ShortcutsPage = lazy(() => import("../components/settings/shortcuts"));

interface SettingsPageOptions {
	accountSettings: AccountsSettingsPageOptions;
	appearanceSettings: AppearanceSettingsPageOptions;
	generalSettings: GeneralSettingsPageOptions;
	shortcutsSettings: ShortcutsSettingsPageOptions;
}

interface SettingsPageProps {
	options?: SettingsPageOptions;
}

interface SettingsPageSubroute<
	OptionsType = unknown,
	Component = (props?: { options: OptionsType }) => JSX.Element,
> {
	name: string;
	tab: number;
	component: Component;
	options?: OptionsType;
}

type SettingsPageSubroutes<OptionsType = unknown> = Array<
	SettingsPageSubroute<
		OptionsType,
		(props?: { options: OptionsType }) => JSX.Element
	>
>;

export default function SettingsPage(props?: SettingsPageProps) {
	const [activeTab, setActiveTab] = createSignal(0);
	const [activeComponent, setActiveComponent] = createSignal<JSX.Element>(
		GeneralSettingsPage(),
	);

	const subroutes: SettingsPageSubroutes = [
		{
			name: "General",
			component: GeneralSettingsPage,
			tab: 0,
			options: {
				lang: props?.options?.generalSettings.lang ?? "en",
			} as GeneralSettingsPageOptions,
		},
		{
			name: "Accounts",
			component: AccountsSettingsPage,
			tab: 1,
			options: {} as AccountsSettingsPageOptions,
		},
		{
			name: "Appearance",
			component: AppearancePage,
			tab: 2,
			options: {
				theme: props?.options?.appearanceSettings.theme ?? "dark",
				fontSize: props?.options?.appearanceSettings.fontSize ?? "medium",
			} as AppearanceSettingsPageOptions,
		},
		{
			name: "Shortcuts",
			component: ShortcutsPage,
			tab: 3,
			options: {} as ShortcutsSettingsPageOptions,
		},
	];

	createEffect(() => {
		const route = subroutes.find((route) => route.tab === activeTab());
		if (route) {
			setActiveComponent(route.component({ options: route.options }));
		}
	}, activeTab);

	return (
		<div class="card grid grid-rows-[40px_1fr] mx-2">
			<div class="card-body">
				<div class="tabs tabs-boxed">
					{subroutes.map((route) => (
						/* rome-ignore lint/a11y/useValidAnchor: not used */
						<a
							class={`tab${activeTab() === route.tab ? " tab-active" : ""}`}
							onclick={() => {
								setActiveTab(route.tab);
							}}
							aria-label={route.name}
						>
							{route.name}
						</a>
					))}
				</div>
				<div class="card bg-base-100">
					<div class="card-body">{activeComponent()}</div>
				</div>
			</div>
		</div>
	);
}
