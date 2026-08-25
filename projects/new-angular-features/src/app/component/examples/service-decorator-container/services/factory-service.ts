import { computed, Service, signal, Signal } from '@angular/core';

@Service({
  autoProvided: true,
  factory: () => {
    const count = signal(0);
    const doubled = computed(() => count() * 2);

    return {
      count: count.asReadonly(),
      doubled,
      increment: () => count.update((n) => n + 1),
      reset: () => count.set(0),
    };
  },
})
export class FactoryService {
  count!: Signal<number>;
  doubled!: Signal<number>;
  increment!: () => void;
  reset!: () => void;
}
