import { createSignal, onCleanup } from "solid-js";

export interface AppearanceSettingsPageOptions {
	theme: "light" | "dark";
	fontSize: "small" | "medium" | "large";
}

export interface AppearanceSettingsPageProps {
	options?: AppearanceSettingsPageOptions;
}

export default function AppearanceSettingsPage(
	props?: AppearanceSettingsPageProps,
) {
	const [theme, setTheme] = createSignal(props?.options?.theme ?? "dark");
	const [fontSize, setFontSize] = createSignal(
		props?.options?.fontSize ?? "medium",
	);

	onCleanup(() => {
		console.log("AppearanceSettingsPage saved.");
	});

	return (
		<article class="prose">
			<h2>Appearance</h2>
			<div class="divider" />
			<div class="settings-row">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">Dark Mode</span>
						<span class="input-wrapper">
							<input
								type="checkbox"
								class={`toggle${
									props?.options?.theme === "dark" ? " toggle-accent" : ""
								}`}
								checked={theme() === "dark"}
								onclick={() => setTheme(theme() === "dark" ? "light" : "dark")}
							/>
						</span>
					</label>
					<label class="label cursor-pointer">
						<span class="label-text">Font Size</span>
						<span class="input-wrapper">
							<div class="btn-group">
								<input
									type="radio"
									name="font-size-small"
									data-title="A"
									class="btn"
									checked={fontSize() === "small"}
									onclick={() => setFontSize("small")}
								/>
								<input
									type="radio"
									name="font-size-medium"
									data-title="A"
									class="btn"
									checked={fontSize() === "medium"}
									onclick={() => setFontSize("medium")}
								/>
								<input
									type="radio"
									name="font-size-large"
									data-title="A"
									class="btn"
									checked={fontSize() === "large"}
									onclick={() => setFontSize("large")}
								/>
							</div>
						</span>
					</label>
				</div>
			</div>
			<style jsx scoped>
				{`
					input[name="font-size-small"] {
						font-size: 0.75rem;
					}
					input[name="font-size-medium"] {
						font-size: 1rem;
					}
					input[name="font-size-large"] {
						font-size: 1.25rem;
					}
				`}
			</style>
		</article>
	);
}
