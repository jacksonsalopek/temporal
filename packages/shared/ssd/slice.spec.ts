import { Reducer } from './reducer';
import { Selector } from './selector';
import { Slice, SSDSlice } from './slice';

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

@Slice({
  name: 'root',
  description: 'Root slice of state',
  refs: [ExampleSlice],
})
export class RootSlice extends SSDSlice {
  public static initialState = {};

  constructor() {
    super(RootSlice.initialState);
  }
}

describe('Slice', () => {
  let slice: ExampleSlice;
  let rootSlice: RootSlice;

  beforeEach(() => {
    slice = new ExampleSlice();
    rootSlice = new RootSlice();
  });

  it('should be defined', () => {
    expect(slice).toBeDefined();
  });

  it('should set the example value', () => {
    slice.setExample({ example: 'test' });

    expect(slice.getExample()).toBe('test');
  });

  it('should get the example value', () => {
    slice.setExample({ example: 'test' });

    expect(slice.getExample()).toBe('test');
  });

  it('should get the reducer and use it', () => {
    const reducer = slice.getReducer(ExampleSliceActions.SET_EXAMPLE);

    expect(reducer).toBeDefined();
    reducer({ example: 'test2' });
    expect(slice.getExample()).toBe('test2');
  });

  it('should get the reducer description', () => {
    const description = slice.getReducerDescription(ExampleSliceActions.SET_EXAMPLE);

    expect(description).toBe('Sets the example value');
  });

  it('should get the selector and use it', () => {
    const selector = slice.getSelector(ExampleSliceSelectors.GET_EXAMPLE);

    expect(selector).toBeDefined();
    expect(selector()).toBe('test2');
  });

  it('should get the subslice reducer and use it', () => {
    if (!rootSlice) {
      throw new Error('RootSlice not found');
    }
    const exampleSlice = rootSlice.getSlice('example');
    if (!exampleSlice) {
      throw new Error('ExampleSlice not found');
    }
    const reducer = exampleSlice.getReducer(ExampleSliceActions.SET_EXAMPLE);

    if (!reducer) {
      throw new Error('Reducer not found');
    }
    reducer({ example: 'test2' });
    slice.getReducer(ExampleSliceActions.SET_EXAMPLE)({ example: 'test1' });
    expect(rootSlice.getSlice('example')?.getExample()).toBe('test1');
  });
});
