/* @refresh reload */
import { StoreProvider } from "@shared/ssd";
import { Router, createIntegration } from "@solidjs/router";
import { onMount } from "solid-js";
import { render } from "solid-js/web";
import type {} from "solid-styled-jsx";
import "tailwindcss/tailwind.css";
import App from "./app";
import "./samples/electron-store";
import { RootStore } from "./store/root.store";

function bindEvent(target: EventTarget, type: string, handler: EventListener) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

function electronIntegration() {
  return createIntegration(
    () => window.location.hash.slice(1),
    ({ value, scroll }) => {
      if (value.includes("index.html#")) {
        value = new URL(`file://${value}`).hash;
      }
      window.location.hash = value.startsWith("/#/") ? value.slice(2) : value;
      if (scroll) {
        window.scrollTo(0, 0);
      }
    },
    (notify) => bindEvent(window, "hashchange", () => notify()),
    {
      go: (delta) => window.history.go(delta),
      renderPath: (path) => `#${path}`,
    }
  );
}

render(() => {
  onMount(() => {
    try {
      window.removeLoading();
    } catch (e) {}
  });

  return (
    <Router source={electronIntegration()}>
      <StoreProvider store={RootStore}>
        <App />
      </StoreProvider>
    </Router>
  );
}, document.getElementById("root") as HTMLElement);

console.log("fs", window.fs);
console.log("ipcRenderer", window.ipcRenderer);

// Usage of ipcRenderer.on
window.ipcRenderer.on("main-process-message", (_event, ...args) => {
  console.log("[Receive Main-process message]:", ...args);
});
