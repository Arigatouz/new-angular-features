import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signals-demo',
  imports: [],
  templateUrl: './signals-demo.html',
  styleUrl: './signals-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsDemo {
  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);
  readonly isEven = computed(() => this.count() % 2 === 0);

  increment(): void {
    this.count.update((v) => v + 1);
  }

  decrement(): void {
    this.count.update((v) => v - 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
