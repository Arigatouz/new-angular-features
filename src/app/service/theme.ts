import { inject, InjectionToken, Service } from '@angular/core';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Define the types
// ─────────────────────────────────────────────────────────────────────────────

// The only two themes the app supports
export type Theme = 'light' | 'dark';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Create a configuration token
//
// This token lets any part of the app (or tests) override the starting theme
// without changing this file.
//
// The factory inside InjectionToken sets the DEFAULT value ('light').
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_THEME = new InjectionToken<Theme>('DEFAULT_THEME', {
  providedIn: 'root',
  factory: () => 'light', // ← default starting theme for the whole app
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
@Service({
  autoProvided: true, // available everywhere — no need to add to providers[]

  factory: () => {
    // ── Read configuration ──────────────────────────────────────────────────
    // inject() works here because factory() runs inside Angular's DI context
    const startingTheme = inject(DEFAULT_THEME); // e.g. 'light'

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
    };
  },
})
export class ThemeService {
  // ── Type declarations ─────────────────────────────────────────────────────
  // These lines exist ONLY for TypeScript.
  // At runtime Angular never uses them — the factory return value is used instead.
  // The "!" tells TypeScript: "this will definitely exist, trust me."
  getTheme!: () => Theme;
  toggle!:   () => void;
  setTheme!: (theme: Theme) => void;
  isDark!:   () => boolean;
}
