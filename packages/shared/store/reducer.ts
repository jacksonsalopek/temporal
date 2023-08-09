import 'reflect-metadata';
import { StateSliceConstructor } from './slice';

export function Reducer(metadata: {
  action: string;
  description: string;
}) {
  return function (target: Object, propertyKey: string) {
    const ctor = target.constructor as StateSliceConstructor;
    if (!ctor._reducers) {
      ctor._reducers = {};
    }
    ctor._reducers[metadata.action] = propertyKey;
    Reflect.defineMetadata(`@reducer/${metadata.action}/description`, metadata.description, target);
  };
}
