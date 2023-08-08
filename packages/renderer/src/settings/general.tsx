import { createSignal, onCleanup } from "solid-js";
import { SettingsWrapper } from "./settings-wrapper";

type UILanguage = "en" | "es" | "de" | "fr";

export interface GeneralSettingsPageOptions {
  lang: UILanguage;
}

export interface GeneralSettingsPageProps {
  options?: GeneralSettingsPageOptions;
}

export default function GeneralSettingsPage(props?: GeneralSettingsPageProps) {
  const [lang, setLang] = createSignal(props?.options?.lang ?? "en");

  onCleanup(() => {
    console.log("GeneralSettingsPage saved.");
  });

  return (
    <SettingsWrapper class="prose">
      <h2>General</h2>
      <div class="divider" />
      <div class="settings-row">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Language</span>
            <span class="input-wrapper">
              <select
                class="select w-full max-w-xs"
                onChange={(val) =>
                  setLang(val.currentTarget.value as UILanguage)
                }
              >
                <option selected={lang() === "en"} value={"en"}>
                  English
                </option>
                <option selected={lang() === "es"} value={"es"}>
                  Español
                </option>
                <option selected={lang() === "de"} value={"de"}>
                  Deutsch
                </option>
                <option selected={lang() === "fr"} value={"fr"}>
                  Français
                </option>
              </select>
            </span>
          </label>
        </div>
      </div>
    </SettingsWrapper>
  );
}
