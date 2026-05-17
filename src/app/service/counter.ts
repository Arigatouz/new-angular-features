/*  ─────────────────────────────────────────────────────────────────────────
    COUNTER SERVICE — A beginner-friendly @Service + factory example
    ─────────────────────────────────────────────────────────────────────────

    What this file teaches you:

    1.  Why the new @Service({ factory }) decorator exists
    2.  How to use inject() inside factory()
    3.  How to wire reactive state with signals
    4.  Why the class body looks the way it does (TypeScript-only fields)

    Read this file top-to-bottom — it builds up step by step.
    ─────────────────────────────────────────────────────────────────────── */

import {
  computed,
  inject,
  InjectionToken,
  Service,
  signal,
  type Signal,
} from '@angular/core';


/*  ─────────────────────────────────────────────────────────────────────────
    PART 1 — A configuration token (optional but recommended)
    ─────────────────────────────────────────────────────────────────────────

    An InjectionToken lets the outside world configure this service WITHOUT
    editing it. We give it a default of `0`.

    A component can override it like this:

        providers: [{ provide: COUNTER_START, useValue: 10 }]

    ...and that component (and its children) will get a counter starting at 10.
    ─────────────────────────────────────────────────────────────────────── */

export const COUNTER_START = new InjectionToken<number>('COUNTER_START', {
  providedIn: 'root',
  factory: () => 0,        // the default starting value
});


/*  ─────────────────────────────────────────────────────────────────────────
    PART 2 — The service itself
    ─────────────────────────────────────────────────────────────────────────

    The @Service decorator has FOUR forms. We use the one with a `factory`:

        @Service({
          autoProvided: true,        // available everywhere (the default)
          factory: () => { ... }     // builds and returns the actual instance
        })

    🔑 KEY MENTAL MODEL:

        ┌────────────────────────────────────────────────────────────────┐
        │  The CLASS below is only a DI lookup key (the "token").        │
        │  The OBJECT returned by factory() is what gets injected.       │
        │  Angular NEVER calls `new CounterService()`.                   │
        └────────────────────────────────────────────────────────────────┘
    ─────────────────────────────────────────────────────────────────────── */

@Service({
  autoProvided: true,

  factory: () => {

    // ┌─────────────────────────────────────────────────────────────────┐
    // │ STEP 1 — Read configuration with inject()                       │
    // ├─────────────────────────────────────────────────────────────────┤
    // │ inject() works here because factory() runs inside Angular's     │
    // │ injection context — the same context constructors use.          │
    // └─────────────────────────────────────────────────────────────────┘
    const start = inject(COUNTER_START); // e.g. 0


    // ┌─────────────────────────────────────────────────────────────────┐
    // │ STEP 2 — Create reactive state with a signal                    │
    // ├─────────────────────────────────────────────────────────────────┤
    // │ signal(start) is a WritableSignal — readable AND writable.      │
    // │ Calling count() reads it; count.set() / count.update() write.   │
    // │ Angular tracks who reads it and re-runs them on change.         │
    // └─────────────────────────────────────────────────────────────────┘
    const count = signal(start);


    // ┌─────────────────────────────────────────────────────────────────┐
    // │ STEP 3 — Build derived state with computed()                    │
    // ├─────────────────────────────────────────────────────────────────┤
    // │ A computed signal re-evaluates ONLY when its sources change.    │
    // │ They are read-only — perfect for exposing safely.               │
    // └─────────────────────────────────────────────────────────────────┘
    const doubled    = computed(() => count() * 2);
    const isPositive = computed(() => count() > 0);
    const isZero     = computed(() => count() === 0);


    // ┌─────────────────────────────────────────────────────────────────┐
    // │ STEP 4 — Return the public API                                  │
    // ├─────────────────────────────────────────────────────────────────┤
    // │ Notice we expose `count.asReadonly()` — outside code can read   │
    // │ the value but cannot call .set() directly. The only way to      │
    // │ mutate state is through the action methods below.               │
    // └─────────────────────────────────────────────────────────────────┘
    return {
      // ── Reactive reads ────────────────────────────────────────────
      count: count.asReadonly(),  // Signal<number>
      doubled,                    // Signal<number>
      isPositive,                 // Signal<boolean>
      isZero,                     // Signal<boolean>

      // ── Actions ───────────────────────────────────────────────────
      increment: () => count.update(n => n + 1),
      decrement: () => count.update(n => n - 1),
      add:       (amount: number) => count.update(n => n + amount),
      reset:     () => count.set(start),
      setTo:     (value: number) => count.set(value),
    };
  },
})
export class CounterService {

  /*  ─────────────────────────────────────────────────────────────────────
      Below are TYPE-ONLY declarations.

      They look like normal class fields but:
        - They are NEVER assigned (no initializer, no constructor).
        - The "!" tells TypeScript: "this WILL exist, trust me."
        - At runtime the factory's return object replaces all of these.

      Their only job: make `inject(CounterService).doubled()` type-check.
      ───────────────────────────────────────────────────────────────────── */

  count!:      Signal<number>;
  doubled!:    Signal<number>;
  isPositive!: Signal<boolean>;
  isZero!:     Signal<boolean>;

  increment!:  () => void;
  decrement!:  () => void;
  add!:        (amount: number) => void;
  reset!:      () => void;
  setTo!:      (value: number) => void;
}


/*  ─────────────────────────────────────────────────────────────────────────
    USAGE EXAMPLE — in any component
    ─────────────────────────────────────────────────────────────────────────

    import { CounterService } from './service/counter';

    @Component({
      template: `
        <p>Count:   {{ counter.count() }}</p>      <!-- reactive read -->
        <p>Doubled: {{ counter.doubled() }}</p>    <!-- updates automatically -->

        <button (click)="counter.increment()">+</button>
        <button (click)="counter.decrement()">-</button>
        <button (click)="counter.reset()">Reset</button>
      `,
    })
    export class CounterDemo {
      readonly counter = inject(CounterService);
    }

    Because count is a signal, the template re-renders ONLY the parts that
    read it — no manual change detection, no zone tricks.
    ─────────────────────────────────────────────────────────────────────── */


/*  ─────────────────────────────────────────────────────────────────────────
    OVERRIDE EXAMPLE — change the starting value for one feature
    ─────────────────────────────────────────────────────────────────────────

    @Component({
      selector:  'score-board',
      providers: [{ provide: COUNTER_START, useValue: 100 }],
      template:  `<p>{{ counter.count() }}</p>`,
    })
    export class ScoreBoard {
      readonly counter = inject(CounterService);
      // This counter starts at 100, separate from any other CounterService
      // instance in the app.
    }
    ─────────────────────────────────────────────────────────────────────── */
