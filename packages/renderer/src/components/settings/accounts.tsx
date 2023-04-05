import { onCleanup } from "solid-js";

export interface AccountsSettingsPageOptions {}

export interface AccountsSettingsPageProps {
	options?: AccountsSettingsPageOptions;
}

export default function AccountsSettingsPage(
	props?: AccountsSettingsPageProps,
) {
	onCleanup(() => {
		console.log("AccountSettingsPage saved.");
	});

	return (
		<article class="prose">
			<h2>Accounts</h2>
			<div class="divider" />
		</article>
	);
}
