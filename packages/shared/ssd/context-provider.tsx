import { createContext, JSX, useContext } from "solid-js";
import { SSDStore } from "./store";
import { Constructor } from "./types";

type StoreProviderOptions = {};

interface StoreProviderProps {
  store: Constructor<SSDStore>;
  children: JSX.Element;
  options?: Partial<StoreProviderOptions>;
}

export const StoreContext = createContext<SSDStore | undefined>();

export function StoreProvider(props: StoreProviderProps) {
  const instance = new props.store();

  return (
    <StoreContext.Provider value={instance}>
      {props.children}
    </StoreContext.Provider>
  );
}

export function useSSD() {
  return useContext(StoreContext);
}
