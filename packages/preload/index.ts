import fs from "fs";
import { contextBridge, IpcRenderer, ipcRenderer } from "electron";
import { domReady } from "./utils";
import { useLoading } from "./loading";

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();

  appendLoading();
})();

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("removeLoading", removeLoading);
contextBridge.exposeInMainWorld("ipcRenderer", withPrototype(ipcRenderer));

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(renderer: IpcRenderer) {
  const protos = Object.getPrototypeOf(renderer);

  Object.entries(protos).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(renderer, key)) return;

    if (typeof value === "function") {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      renderer[key] = (...args: unknown[]) => {
        return value.call(renderer, ...args);
      };
    } else {
      renderer[key] = value;
    }
  });
  return renderer;
}
