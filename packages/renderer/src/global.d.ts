export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import("fs");
    ipcRenderer: import("electron").IpcRenderer;
    removeLoading: () => void;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    readonly VITE_DEV_SERVER_HOST: string;
    readonly VITE_DEV_SERVER_PORT: string;
    APP_NAME: string;
  }
}
