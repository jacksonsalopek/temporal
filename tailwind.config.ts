import defaultConfig from "tailwindcss/defaultConfig";
import { Config } from "tailwindcss/types/config";
import TYPOGRAPHY_PLUGIN from "@tailwindcss/typography";
import DAISY_UI_PLUGIN from "daisyui";

export const config: Config = {
  ...defaultConfig,
  content: [
    "./packages/renderer/index.html",
    "./packages/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [TYPOGRAPHY_PLUGIN, DAISY_UI_PLUGIN],
};

export default config;
