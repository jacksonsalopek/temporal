export interface ShortcutsSettingsPageOptions {}

export interface ShortcutsSettingsPageProps {}

export default function ShortcutsSettingsPage(
	props?: ShortcutsSettingsPageProps,
) {
	return (
		<article class="prose">
			<h2>Shortcuts</h2>
			<div class="divider" />
			<div class="settings-row">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">Command Overlay</span>
						<span class="input-wrapper">
							<button class="btn btn-neutral">
								{/* TODO: switch between ctrl and cmd on windows */}
								<kbd class="kbd">⌘</kbd>
								<span class="mx-1">+</span>
								<kbd class="kbd">k</kbd>
							</button>
						</span>
					</label>
					<label class="label cursor-pointer">
						<span class="label-text">Search</span>
						<span class="input-wrapper">
							<button class="btn btn-neutral">
								{/* TODO: switch between ctrl and cmd on windows */}
								<kbd class="kbd">⌘</kbd>
								<span class="mx-1">+</span>
								<kbd class="kbd">f</kbd>
							</button>
						</span>
					</label>
					<label class="label cursor-pointer">
						<span class="label-text">Toggle Dark Mode</span>
						<span class="input-wrapper">
							<button class="btn btn-neutral">
								{/* TODO: switch between ctrl and cmd on windows */}
								<kbd class="kbd">⌘</kbd>
								<span class="mx-1">+</span>
								<kbd class="kbd">⌥</kbd>
								<span class="mx-1">+</span>
								<kbd class="kbd">d</kbd>
							</button>
						</span>
					</label>
				</div>
			</div>
		</article>
	);
}
