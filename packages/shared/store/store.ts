export class StateStore {
  public slices: StateSlice[] = [];

  dispatch(action: string, payload?: unknown) {}
}

function Store(metadata: { slices: Constructor<StateSlice>[] }) {
  // rome-ignore lint/suspicious/noExplicitAny: allow any for now
  // rome-ignore lint/suspicious/noShadowRestrictedNames: allow shadowing of metadata
  return function <T extends Constructor<StateStore>>(constructor: T, ...rootArgs: any[]) {
    return class extends constructor {
      // rome-ignore lint/suspicious/noExplicitAny: constructor is a generic type
      constructor(...args: any[]) {
        super(...args);
        this.slices = metadata.slices.map((slice) => new slice());
      }
    };
  };
}

@Store({
  slices: [RootSlice],
})
export class RootStore extends StateStore {}

const store = new RootStore();
store.dispatch(ExampleSliceActions.SET_EXAMPLE, { example: 'test' });
store.get(ExampleSlice).getExample();
