import { SetStoreFunction, createStore } from 'solid-js/store';
import { Constructor } from './types';

export class StateSlice<T extends object = {}> {
  // rome-ignore lint/suspicious/noExplicitAny: allow any such that we index by any key
  [key: string]: any;

  public _name = '';
  public _description?: string;
  // rome-ignore lint/suspicious/noExplicitAny: allow any such that we can use any slice as a subslice
  public _slices?: StateSlice<any>[];

  private _setState: SetStoreFunction<T>;
  private _state: T;

  constructor(initialState: T) {
    const [state, setState] = createStore<T>(initialState);
    this._state = state;
    this._setState = setState;
  }

  get<K extends keyof T>(key: K): T[K] {
    return this._state[key];
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this._setState(key as T[K], value);
  }

  getReducer(action: string): Function {
    const reducerName = Reflect.getMetadata(`@reducer/${action}`, this);
    if (!reducerName || typeof this[reducerName] !== 'function') {
      throw new Error(`Reducer for action "${action}" not found.`);
    }
    return this[reducerName].bind(this);
  }

  getReducerDescription(action: string): string | undefined {
    return Reflect.getMetadata(`@reducer/${action}/description`, this);
  }

  getReducers(): Function[] {
    const reducers = Reflect.getMetadataKeys(this).filter((key) => key.startsWith('@reducer'));
    return reducers.map((reducer) => this.getReducer(reducer));
  }

  getSelector(action: string): Function {
    const selectorName = Reflect.getMetadata(`@selector/${action}`, this);
    if (!selectorName || typeof this[selectorName] !== 'function') {
      throw new Error(`Selector for action "${action}" not found.`);
    }
    return this[selectorName].bind(this);
  }

  getSelectorDescription(action: string): string | undefined {
    return Reflect.getMetadata(`@selector/${action}/description`, this);
  }

  getSelectors(): Function[] {
    const selectors = Reflect.getMetadataKeys(this).filter((key) => key.startsWith('@selector'));
    return selectors.map((selector) => this.getSelector(selector));
  }

  getSlice(name: string): StateSlice | undefined {
    return this._slices?.find((slice) => slice._name === name);
  }
}

export function Slice(metadata: { name: string; description?: string; slices?: Constructor<StateSlice>[] }) {
  // rome-ignore lint/suspicious/noExplicitAny: allow any for now
  // rome-ignore lint/suspicious/noShadowRestrictedNames: allow shadowing of metadata
  return function <T extends Constructor<StateSlice>>(constructor: T, ...rootArgs: any[]) {
    return class extends constructor {
      // rome-ignore lint/suspicious/noExplicitAny: constructor is a generic type
      constructor(...args: any[]) {
        super(...args);
        this._name = metadata.name;
        this._description = metadata.description;
        this._slices = metadata.slices?.map((slice) => new slice());
      }
    };
  };
}
