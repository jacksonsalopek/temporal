import 'reflect-metadata';
import { SSDSliceConstructor } from './slice';

export function Selector(metadata: {
  selector: string;
  description: string;
}) {
  return function (target: Object, propertyKey: string) {
    const ctor = target.constructor as SSDSliceConstructor;
    if (!ctor._selectors) {
      ctor._selectors = {};
    }
    ctor._selectors[metadata.selector] = propertyKey;
    Reflect.defineMetadata(`@selector/${metadata.selector}/description`, metadata.description, target);
  };
}
