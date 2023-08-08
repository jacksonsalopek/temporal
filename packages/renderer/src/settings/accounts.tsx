import { onCleanup } from "solid-js";
import { SettingsWrapper } from "./settings-wrapper";

export interface AccountsSettingsPageOptions {}

export interface AccountsSettingsPageProps {
  options?: AccountsSettingsPageOptions;
}

export default function AccountsSettingsPage(
  props?: AccountsSettingsPageProps
) {
  onCleanup(() => {
    console.log("AccountSettingsPage saved.");
  });

  return (
    <SettingsWrapper class="prose">
      <h2>Accounts</h2>
      <div class="divider" />
    </SettingsWrapper>
  );
}
