import { contextBridge, ipcRenderer } from 'electron';
import { domReady } from './utils';
import { useLoading } from './loading';

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();

  appendLoading();
})();

// --------- Expose some API to the Renderer process. ---------
// contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));
contextBridge.exposeInMainWorld('electron', {
  on(eventName: string, callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) {
    ipcRenderer.on(eventName, callback);
  },

  async invoke(eventName: string, ...params: unknown[]) {
    return await ipcRenderer.invoke(eventName, ...params);
  },

  send(eventName: string, ...params: unknown[]) {
    ipcRenderer.send(eventName, ...params);
  },
});

async function loadState() {
  const transactions = await ipcRenderer.invoke('electron-store', 'get', 'transactions');
  contextBridge.exposeInMainWorld('loadedState', {
    transactions: transactions,
  });
}

loadState();

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Object) {
  const protos = Object.getPrototypeOf(obj);

  Object.entries(protos).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return;

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = (...args: unknown[]) => {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  });
  return obj;
}
