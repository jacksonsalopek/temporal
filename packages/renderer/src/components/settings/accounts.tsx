export interface AccountsSettingsPageOptions {}

export interface AccountsSettingsPageProps {
	options?: AccountsSettingsPageOptions;
}

export default function AccountsSettingsPage(
	props?: AccountsSettingsPageProps,
) {
	return (
		<article class="prose">
			<h2>Accounts</h2>
			<div class="divider" />
		</article>
	);
}
