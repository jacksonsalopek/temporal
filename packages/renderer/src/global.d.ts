export {};
import type { ComponentProps } from "solid-js";
import type { CalendarOptions } from "@fullcalendar/core";

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import("fs");
    ipcRenderer: import("electron").IpcRenderer;
    removeLoading: () => void;
    electron: {
      send: (eventName: string) => void;
    };
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

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "full-calendar": ComponentProps<"div"> & {
        shadow?: boolean;
        options: CalendarOptions;
      };
    }
  }
}
