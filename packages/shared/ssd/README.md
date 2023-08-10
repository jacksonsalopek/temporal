# SSD - SolidJS State Director

SSD, or Solid State Director, is a lightweight, opinionated framework for managing state in SolidJS.

## Rationale

One of the shortcomings of SolidJS is bloated components with tons of references to reactive elements, through `createSignal` or `createStore`. This makes code
legibility and parsability quite low for more complex components. Additionally, the state management tools in Solid lack opinionation (and for good reason, as we
all have unique writing styles as developers) and allow for bad practice, such as managing state on a component rather than managing state centrally.

SSD introduces opinionation and style similar to that of Redux and the use of decorators, a la Nest.JS or Angular.

## Getting Started

**Basic Configuration**

```tsx
import { SSDStore, Store } from "@shared/ssd";

@Store({
  name: "root",
})
export class RootStore extends SSDStore {}
```

**Utilizing Slices**

```tsx
import {
  SSDStore,
  SSDSlice,
  Store,
  Slice,
  Reducer,
  Selector,
} from "@shared/ssd";

export enum RootSliceActions {
  TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR",
}

export enum RootSliceSelectors {
  IS_SIDEBAR_VISIBLE = "IS_SIDEBAR_VISIBLE",
}

export type RootSliceState = {
  isSidebarVisible: boolean;
};

@Slice({
  name: "root",
  description: "Root state slice, containing data related to root state",
  actions: RootSliceActions,
  selectors: RootSliceSelectors,
})
export class RootSlice extends SSDSlice<RootSliceState> {
  public static initialState: RootSliceState = {
    isSidebarVisible: false,
  };

  constructor() {
    super(RootSlice.initialState);
  }

  @Selector({
    selector: ExampleSliceSelector.IS_SIDEBAR_VISIBLE,
    description: "Gets the visibility of the sidebar",
  })
  isSidebarVisible() {
    return this.get("isSidebarVisible");
  }

  @Reducer({
    action: RootSliceActions.TOGGLE_SIDEBAR,
    description: "Toggles the visibility of the sidebar",
  })
  toggleSidebar() {
    const currentValue = this.isSidebarVisible();
    this.set("isSidebarVisible", !currentValue);
  }
}

@Store({
  name: "root",
  refs: [RootSlice],
})
export class RootStore extends SSDStore {}

// in main.tsx
import { StoreProvider } from "@shared/ssd";
import App from "./app";

render(() => {
  return (
    <StoreProvider store={RootStore}>
      <App />
    </StoreProvider>
  );
}, document.getElementById("root") as HTMLElement);

// in app.tsx
import { useSSD } from "@shared/ssd";

const App: Component = () => {
  const store = useSSD();

  const isSidebarVisible = () =>
    (store.refs.root as RootSlice).isSidebarVisible();

  return (
    <Sidebar visible={isSidebarVisible}>
      <p>Content</p>
    </Sidebar>
  );
};
```
