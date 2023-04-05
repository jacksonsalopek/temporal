export interface GeneralSettingsPageOptions {
	lang: "en" | "es" | "de" | "fr";
}

export interface GeneralSettingsPageProps {
	options?: GeneralSettingsPageOptions;
}

export default function GeneralSettingsPage(props?: GeneralSettingsPageProps) {
	return (
		<article class="prose">
			<h2>General</h2>
			<div class="divider" />
			<div class="settings-row">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">Language</span>
						<span class="input-wrapper">
							<select class="select w-full max-w-xs">
								<option selected={props?.options?.lang === "en"}>
									English
								</option>
								<option selected={props?.options?.lang === "es"}>
									Español
								</option>
								<option selected={props?.options?.lang === "de"}>
									Deutsch
								</option>
								<option selected={props?.options?.lang === "fr"}>
									Français
								</option>
							</select>
						</span>
					</label>
				</div>
			</div>
		</article>
	);
}
