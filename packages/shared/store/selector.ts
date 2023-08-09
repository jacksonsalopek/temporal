import 'reflect-metadata';

export function Selector(metadata: {
  action: string;
  description: string;
}) {
  return function (target: Object, context: ClassMethodDecoratorContext) {
    Reflect.defineMetadata(`@selector/${metadata.action}`, context, target);
    Reflect.defineMetadata(`@selector/${metadata.action}/description`, metadata.description, target);
  };
}
