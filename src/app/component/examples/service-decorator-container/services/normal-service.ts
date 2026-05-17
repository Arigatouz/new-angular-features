import { computed, Service, signal } from '@angular/core';

@Service()
export class NormalService {
  readonly #count = signal(0);

  readonly count = this.#count.asReadonly();
  readonly doubled = computed(() => this.#count() * 2);

  increment(): void {
    this.#count.update((n) => n + 1);
  }

  reset(): void {
    this.#count.set(0);
  }
}
