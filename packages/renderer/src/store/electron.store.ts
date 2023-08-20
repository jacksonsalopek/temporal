export class ElectronStore {
  private invoke = window.ipcRenderer.invoke;

  async get<T = unknown>(key: string): Promise<T> {
    const value = await this.invoke('electron-store', 'get', key);
    return (JSON.parse(value) as T) ?? value;
  }

  async set(key: string, value: unknown) {
    let val = value;
    try {
      if (value && typeof value === 'object') {
        val = JSON.stringify(value);
      }
    } finally {
      await this.invoke('electron-store', 'set', key, val);
    }
  }
}
