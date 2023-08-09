import { SetStoreFunction, createStore } from 'solid-js/store';
import { Constructor } from './types';

export interface StateSliceConstructor extends Function {
  _reducers?: { [rAction: string]: string | symbol };
  _selectors?: { [sAction: string]: string | symbol };
}

export class StateSlice<T extends object = {}> {
  // rome-ignore lint/suspicious/noExplicitAny: allow any such that we index by any key
  [key: string]: any;

  public _name = '';
  public _description?: string;
  // rome-ignore lint/suspicious/noExplicitAny: allow any such that we can use any slice as a subslice
  public _refs?: StateSlice<any>[];
  public _actions?: string[];

  private _setState: SetStoreFunction<T>;
  private _state: T;

  constructor(initialState: T) {
    const [state, setState] = createStore<T>(initialState);
    this._state = state;
    this._setState = setState;
    this._reducers = { ...((this.constructor as StateSliceConstructor)._reducers || {}) };
    this._selectors = { ...((this.constructor as StateSliceConstructor)._selectors || {}) };
  }

  get<K extends keyof T>(key: K): T[K] {
    return this._state[key];
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this._setState(key as T[K], value);
  }

  getReducer(action: string): Function {
    const reducerName = this._reducers[action];
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
    const selectorName = this._selectors[action];
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
    return this._refs?.find((slice) => slice._name === name);
  }
}

/**
 * Decorator for a slice of state.
 *
 * @param metadata - Slice metadata, including name, description, and references to other slices.
 * @param metadata.name - Name of the slice.
 * @param metadata.description - Description of the slice.
 * @param metadata.refs - References to other slices. This is used to link slices together. For example, a root slice may have references to all other slices in the store.
 * @returns Decorator function that returns a class that extends the decorated class.
 */
export function Slice(metadata: {
  name: string;
  actions?: Object;
  description?: string;
  refs?: Constructor<StateSlice>[];
}) {
  // rome-ignore lint/suspicious/noExplicitAny: allow any for now
  // rome-ignore lint/suspicious/noShadowRestrictedNames: allow shadowing of metadata
  return function <T extends Constructor<StateSlice>>(constructor: T, ...rootArgs: any[]) {
    return class extends constructor {
      // rome-ignore lint/suspicious/noExplicitAny: constructor is a generic type
      constructor(...args: any[]) {
        super(...args);
        this._name = metadata.name;
        this._description = metadata.description;
        this._refs = metadata.refs?.map((slice) => new slice());
        if (metadata.actions) {
          // Retrieve all values from the enum
          const enumValues = Object.keys(metadata.actions)
            .filter((key) => isNaN(Number(key))) // Filter out numeric keys
            // rome-ignore lint/suspicious/noExplicitAny: get rid of Object type error
            .map((key) => (metadata.actions as any)[key]);

          this._actions = enumValues; // This will log all values from the enum
        }
      }
    };
  };
}
