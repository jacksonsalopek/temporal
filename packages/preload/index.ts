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
  on(eventName, callback) {
    ipcRenderer.on(eventName, callback);
  },

  async invoke(eventName, ...params) {
    return await ipcRenderer.invoke(eventName, ...params);
  },

  send(eventName, ...params) {
    ipcRenderer.send(eventName, ...params);
  },
});

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
