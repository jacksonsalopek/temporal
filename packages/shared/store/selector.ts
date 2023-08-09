import 'reflect-metadata';
import { StateSliceConstructor } from './slice';

export function Selector(metadata: {
  action: string;
  description: string;
}) {
  return function (target: Object, propertyKey: string) {
    const ctor = target.constructor as StateSliceConstructor;
    if (!ctor._selectors) {
      ctor._selectors = {};
    }
    ctor._selectors[metadata.action] = propertyKey;
    Reflect.defineMetadata(`@selector/${metadata.action}/description`, metadata.description, target);
  };
}
