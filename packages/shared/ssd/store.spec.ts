import { SSDSlice, Slice } from './slice';
import { Reducer } from './reducer';
import { Selector } from './selector';
import { SSDStore, Store } from './store';

export enum ExampleSliceActions {
  SET_EXAMPLE = 'SET_EXAMPLE',
}

export enum ExampleSliceSelectors {
  GET_EXAMPLE = 'GET_EXAMPLE',
}

export type ExampleSliceState = {
  example: string;
};

@Slice({
  name: 'example',
  description: 'Example slice of state',
  actions: ExampleSliceActions,
})
export class ExampleSlice extends SSDSlice<ExampleSliceState> {
  public static initialState: ExampleSliceState = {
    example: 'example',
  };

  constructor() {
    super(ExampleSlice.initialState);
  }

  @Reducer({
    action: ExampleSliceActions.SET_EXAMPLE,
    description: 'Sets the example value',
  })
  setExample(payload: { example: string }) {
    this.set('example', payload.example);
  }

  @Selector({
    selector: ExampleSliceSelectors.GET_EXAMPLE,
    description: 'Gets the example value',
  })
  getExample() {
    return this.get('example');
  }
}

@Store({
  name: 'root',
  refs: [ExampleSlice],
})
export class RootStore extends SSDStore {}

describe('Store', () => {
  let store: RootStore;

  beforeEach(() => {
    store = new RootStore();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  it('should have a name', () => {
    expect(store._name).toBe('root');
  });

  it('should have a description', () => {
    expect(store._description).toBeUndefined();
  });

  it('should have functional references to slices', () => {
    expect(store.refs.example).toBeDefined();
    const exampleSlice = store.refs.example as ExampleSlice;
    expect(exampleSlice.getExample()).toBe('example');
    exampleSlice.setExample({ example: 'new example' });
    expect(exampleSlice.getExample()).toBe('new example');
  });
});
