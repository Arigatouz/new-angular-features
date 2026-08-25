import { debounced, inject, InjectionToken, linkedSignal, Service, signal, Signal } from '@angular/core';
import { CounterService } from './counter';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Define the types
// ─────────────────────────────────────────────────────────────────────────────

// The only two themes the app supports
export type Theme = 'light' | 'dark';
export type ThemeApi = {
  theme: () => Theme; // Returns the current theme
  number: () => number;
  toggle: () => void; // Switches from light → dark or dark → light
  setTheme: (theme: Theme) => void; // Lets you set a specific theme directly
  isDark: () => boolean; // Convenience: true when the active theme is dark
};
// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Create a configuration token
//
// This token lets any part of the app (or tests) override the starting theme
// without changing this file.
//
// The factory inside InjectionToken sets the DEFAULT value ('light').
// ─────────────────────────────────────────────────────────────────────────────
@Service({ autoProvided: false })
export class CounterX {
  count = signal(0);
  increment(): void {
    this.count.update((n) => n + 1);
  }
}

@Service()
export class PaymentGateWay {}

export const DEFAULT_THEME = new InjectionToken<ThemeApi>('DEFAULT_THEME', {
  providedIn: 'root',
  factory: () => {
    let current: Theme = 'light';
    let numberService = inject(CounterX);
    return {
      theme: () => current,
      number: () => numberService.count(),
      toggle: () => {
        current = numberService.count() % 7 === 0 ? 'light' : 'dark';
      },
      setTheme: (t) => {
        current = t;
      },
      isDark: () => current === 'dark',
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Build the service using @Service + factory
//
// Why factory?
//   We read DEFAULT_THEME with inject() to decide the starting value.
//   The factory runs once (when Angular first needs this service), reads that
//   token, sets up the state, and returns a plain object with methods.
//
// The class below is NEVER instantiated by Angular.
// It is only used as the DI lookup key (the "token").
// What actually gets injected is the object returned by factory().
// ─────────────────────────────────────────────────────────────────────────────

class SingletonClassExporter {
  check = false;
  constructor(check: boolean) {
    console.log('SingletonClassExporter created');
    this.check = check;
  }
  value = this.check ? ' yes' : 'no';
}

const singleton = (check: boolean) => new SingletonClassExporter(check);

@Service({
  autoProvided: true, // available everywhere — no need to add to providers[]

  factory: () => {
    // ── Read configuration ──────────────────────────────────────────────────
    // inject() works here because factory() runs inside Angular's DI context
    const startingTheme = inject(DEFAULT_THEME).theme(); // e.g. 'light'

    const s = singleton(true);

    // ── Private state ───────────────────────────────────────────────────────
    // This variable lives inside the closure.
    // Nothing outside this factory can touch it directly.
    let current: Theme = startingTheme;

    // ── Return the public API ───────────────────────────────────────────────
    // This plain object is what you get when you call inject(ThemeService)
    return {
      // Returns the current theme ('light' or 'dark')
      getTheme(): Theme {
        return current;
      },

      // Switches from light → dark or dark → light
      toggle(): void {
        current = current === 'light' ? 'dark' : 'light';
      },

      // Lets you set a specific theme directly
      setTheme(theme: Theme): void {
        current = theme;
      },

      // Convenience: true when the active theme is dark
      isDark(): boolean {
        return current === 'dark';
      },
      s,
    };
  },
})
export class ThemeService {
  // ── Type declarations ─────────────────────────────────────────────────────
  // These lines exist ONLY for TypeScript.
  // At runtime Angular never uses them — the factory return value is used instead.
  // The "!" tells TypeScript: "this will definitely exist, trust me."
  getTheme!: () => Theme;
  toggle!: () => void;
  setTheme!: (theme: Theme) => void;
  isDark!: () => boolean;
  s!: SingletonClassExporter;
}

@Service()
export class whatever {
  theme = inject(ThemeService); //  will not do this coz the themeService is a factory !== new themeService()


  // check the diff between AsyncSubject and Subject
  sub = new AsyncSubject();
  sub2 = new Subject()
  sub3 = new BehaviorSubject("")
  replay = new ReplaySubject()


}
