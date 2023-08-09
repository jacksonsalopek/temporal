import { StateSlice } from './slice';
import { Constructor } from './types';

type StateStoreRefs = {
  [sliceName: string]: StateSlice;
};

export class StateStore {
  public _name = '';
  public _description?: string;
  public refs: StateStoreRefs = {};
  public actions: string[] = [];

  dispatch(sliceName: string, action: string, payload?: unknown) {
    const slice = this.refs[sliceName];
    if (!slice) {
      throw new Error(`Slice "${sliceName}" not found.`);
    }
    const reducer = slice.getReducer(action);
    if (!reducer) {
      throw new Error(`Reducer for action "${action}" not found.`);
    }
    reducer(payload);
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
export function Store(metadata: {
  name: string;
  actions?: Object;
  description?: string;
  refs?: Constructor<StateSlice>[];
}) {
  // rome-ignore lint/suspicious/noExplicitAny: allow any for now
  // rome-ignore lint/suspicious/noShadowRestrictedNames: allow shadowing of metadata
  return function <T extends Constructor<StateStore>>(constructor: T, ...rootArgs: any[]) {
    return class extends constructor {
      // rome-ignore lint/suspicious/noExplicitAny: constructor is a generic type
      constructor(...args: any[]) {
        super(...args);
        this._name = metadata.name;
        this._description = metadata.description;
        this.refs =
          metadata.refs?.reduce((accum, slice) => {
            const s = new slice();
            return {
              ...accum,
              [s._name]: s,
            };
          }, {} as StateStoreRefs) || {};
        if (metadata.actions) {
          // Retrieve all values from the enum
          const enumValues = Object.keys(metadata.actions)
            .filter((key) => isNaN(Number(key))) // Filter out numeric keys
            // rome-ignore lint/suspicious/noExplicitAny: get rid of Object type error
            .map((key) => (metadata.actions as any)[key]);

          this.actions = enumValues; // This will log all values from the enum
        }
      }
    };
  };
}
