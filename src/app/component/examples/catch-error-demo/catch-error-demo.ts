import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, throwError } from 'rxjs';

type Strategy = 'empty' | 'of' | 'throwError' | 'undefined';

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

interface LogEntry {
  kind: 'next' | 'error' | 'complete';
  message: string;
}

interface StrategyResult {
  strategy: Strategy;
  label: string;
  entries: LogEntry[];
}

const JOKES_API = 'https://official-joke-api.appspot.com';
const BAD_URL = `${JOKES_API}/jokes/this-endpoint-does-not-exist`;

const STRATEGY_LABELS: Record<Strategy, string> = {
  empty: "return EMPTY",
  of: "return of(fallbackJoke)",
  throwError: "return throwError(() => err)",
  undefined: "return undefined  ❌",
};

@Component({
  selector: 'app-catch-error-demo',
  imports: [],
  templateUrl: './catch-error-demo.html',
  styleUrl: './catch-error-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatchErrorDemo {
  private readonly http = inject(HttpClient);

  readonly endpoint = BAD_URL;
  readonly STRATEGY_LABELS = STRATEGY_LABELS;
  /** Results keyed by strategy, so every outcome stays visible side-by-side. */
  readonly results = signal<Record<Strategy, StrategyResult | null>>({
    empty: null,
    of: null,
    throwError: null,
    undefined: null,
  });

  /**
   * A REAL HTTP request. We hit a path that does not exist on the joke API,
   * so the server responds 404 and the Observable errors — exactly the case
   * catchError exists to handle. The network request is IDENTICAL for every
   * strategy; only the client-side handling differs.
   */
  private failingRequest(): Observable<Joke> {
    return this.http.get<Joke>(BAD_URL);
  }

  run(strategy: Strategy): void {
    const entries: LogEntry[] = [];
    const label = STRATEGY_LABELS[strategy];

    // Show a pending row immediately.
    this.results.update((r) => ({ ...r, [strategy]: { strategy, label, entries: [] } }));

    const push = (entry: LogEntry) => {
      entries.push(entry);
      // Console output, clearly labelled per strategy so you can tell them apart.
      const tag = `[catchError ${label}]`;
      if (entry.kind === 'error') console.error(tag, entry.message);
      else console.log(tag, entry.message);

      this.results.update((r) => ({ ...r, [strategy]: { strategy, label, entries: [...entries] } }));
    };

    try {
      this.failingRequest()
        .pipe(
          catchError((err: HttpErrorResponse) => {
            const reason = `HTTP ${err.status} ${err.statusText || 'error'}`;
            switch (strategy) {
              // ✅ Swallow the error — stream completes with no value.
              case 'empty':
                return EMPTY;
              // ✅ Recover with a fallback value, then complete.
              case 'of':
                return of<Joke>({
                  id: 0,
                  type: 'fallback',
                  setup: 'Why did the request fail?',
                  punchline: `Because: ${reason}`,
                });
              // ✅ Re-throw (optionally a new error) — error propagates to subscriber.
              case 'throwError':
                return throwError(() => new Error(`Re-thrown: ${reason}`));
              // ❌ Returning undefined is NOT allowed — RxJS throws.
              // The cast only silences the compiler so we can demonstrate the
              // runtime error: "You provided 'undefined' where a stream was expected."
              case 'undefined':
              default:
                return undefined as unknown as Observable<Joke>;
            }
          }),
        )
        .subscribe({
          next: (joke) =>
            push({ kind: 'next', message: `next → ${joke.setup} — ${joke.punchline}` }),
          error: (err: Error) => push({ kind: 'error', message: `error → ${err.message}` }),
          complete: () =>
            push({ kind: 'complete', message: 'complete ✓ (no error reached subscriber)' }),
        });
    } catch (err) {
      push({ kind: 'error', message: `Thrown synchronously → ${(err as Error).message}` });
    }
  }

  runAll(): void {
    (Object.keys(STRATEGY_LABELS) as Strategy[]).forEach((s) => this.run(s));
  }

  /** Stable iteration order for the template. */
  readonly order: Strategy[] = ['empty', 'of', 'throwError', 'undefined'];
}
