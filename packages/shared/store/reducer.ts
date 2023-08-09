import 'reflect-metadata';

export function Reducer(metadata: {
  action: string;
  description: string;
}) {
  return function (target: Object, context: ClassMethodDecoratorContext) {
    console.log('target', target);
    Reflect.defineMetadata(`@reducer/${metadata.action}`, context, target);
    Reflect.defineMetadata(`@reducer/${metadata.action}/description`, metadata.description, target);
  };
}
