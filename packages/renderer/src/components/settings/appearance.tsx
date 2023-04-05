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
								checked={props?.options?.theme === "dark"}
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
									checked={props?.options?.fontSize === "small"}
								/>
								<input
									type="radio"
									name="font-size-medium"
									data-title="A"
									class="btn"
									checked={props?.options?.fontSize === "medium"}
								/>
								<input
									type="radio"
									name="font-size-large"
									data-title="A"
									class="btn"
									checked={props?.options?.fontSize === "large"}
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
