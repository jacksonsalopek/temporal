import { createSignal } from 'solid-js';
import { ElectronStore } from './electron.store';

export function useElectronStore() {
  const [electronStore, setElectronStore] = createSignal(new ElectronStore());
  return { electronStore };
}
