import {debounce, fromEvent, interval} from 'rxjs';

export function DebounceMethod(
  target: Object,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any) {
    if (Reflect.get(target, 'subscription')) return;
    Reflect.set(
      target,
      'subscription',
      fromEvent(window, 'resize')
        .pipe(
          debounce((_) => interval(200))
        )
        .subscribe(() => {
          Reflect.get(target, 'subscription')?.unsubscribe();
          Reflect.set(target, 'subscription', undefined);
          originalMethod.apply(this, args);
        })
    );
  };
  return descriptor;
}
