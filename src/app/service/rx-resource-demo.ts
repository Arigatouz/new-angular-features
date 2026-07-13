import { inject, Service, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { concatMap, map, Observable, scan, Subject, take, takeUntil, timer } from 'rxjs';
import { Joke } from './jokes';
import { JOKES_API } from './http-demo-service';
import { WikiRecentChange, WIKI_STREAM_URL } from './resource-demo';
import { parse } from 'valibot';
import { JokesSchema } from './schema/jokes.schema';

@Service({
  autoProvided: false,
})
export class RxResourceDemoService {
  readonly #http = inject(HttpClient);

  // Angular unsubscribes the stream Observable on abort/reload/destroy — no
  // AbortController needed. This Subject is only for a *manual* cancel button
  // that doesn't otherwise change params.
  #manualCancel$ = new Subject<string>();

  cancelJokeRequest(reason?: string): void {
    this.#manualCancel$.next(reason ?? 'User cancelled');
  }

  // ── plain rxResource — no params, single emission per load ────────────
  pureJokeDataResource = rxResource<Joke[], Record<never, never>>({
    stream: () => this.#http.get<Joke[]>(JOKES_API.JOKE_API_10_JOKES),
  });

  // ── reactive params, conditional loading (undefined → idle) ───────────
  jokeDataResourceWithParams = (jokeCount: Signal<number | undefined>) => {
    return rxResource<Joke[], { count: number } | undefined>({
      params: () => (jokeCount() !== undefined ? { count: jokeCount()! } : undefined),
      stream: ({ params }) =>
        this.#http.get<Joke[]>(JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count)),
      defaultValue: [],
    });
  };

  // ── abortSignal + manual cancel ────────────────────────────────────────
  // A 2s delay makes the cancel/increment window visible. Unsubscribing the
  // Observable (via abort, param change, or takeUntil) cancels the in-flight
  // HTTP call automatically — no manual AbortController wiring required.
  jokeResourceWithAbortSignal = (jokeCount: Signal<number | undefined>) => {
    return rxResource<Joke[], { count: number } | undefined>({
      params: () => (jokeCount() !== undefined ? { count: jokeCount()! } : undefined),
      defaultValue: [],
      stream: ({ params, abortSignal }) => {
        abortSignal.addEventListener(
          'abort',
          () => {
            console.log(`Request aborted: ${abortSignal.reason}`);
          },
          { once: true },
        );

        return timer(2000).pipe(
          concatMap(() =>
            this.#http.get<Joke[]>(JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count)),
          ),
          // Completing before a value is emitted resolves the resource to an
          // error ("Resource completed before producing a value") — the
          // Observable-based equivalent of the loader's rejected Promise.
          takeUntil(this.#manualCancel$),
        );
      },
    });
  };

  // ── streaming resource — an Observable can just emit repeatedly ───────
  // No manual signal()-push loop needed, unlike resource()'s stream option.
  jokeStreamResource = (jokeCount: Signal<number | undefined>) => {
    return rxResource<Joke[], { count: number } | undefined>({
      params: () => {
        const count = jokeCount();
        return count !== undefined && count > 0 ? { count } : undefined;
      },
      defaultValue: [],
      stream: ({ params }) =>
        timer(0, 2000).pipe(
          take(params.count),
          concatMap(() => this.#http.get<Joke[]>(JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(1))),
          map(([joke]) => joke),
          scan((jokes, joke) => [...jokes, joke], [] as Joke[]),
        ),
    });
  };

  // ── Real SSE stream: Wikimedia EventStreams ──────────────────────────
  // Same feed as ResourceDemoService.wikiEditStreamResource, but the
  // Observable's teardown function replaces the manual
  // abortSignal.addEventListener('abort', ...) cleanup.
  wikiEditStreamResource = rxResource<WikiRecentChange[], Record<never, never>>({
    params: () => ({}),
    defaultValue: [],
    stream: () =>
      new Observable<WikiRecentChange[]>((subscriber) => {
        const source = new EventSource(WIKI_STREAM_URL);
        let edits: WikiRecentChange[] = [];

        source.onmessage = (event: MessageEvent) => {
          try {
            const edit = JSON.parse(event.data as string) as WikiRecentChange;
            // Filter to main namespace (0) articles only for a cleaner feed.
            if (edit.namespace !== 0) return;
            edits = [edit, ...edits].slice(0, 20);
            subscriber.next(edits);
          } catch {
            /* ignore malformed events */
          }
        };

        source.onerror = () => {
          subscriber.error(new Error('EventSource connection lost — reload to reconnect'));
          source.close();
        };

        // Runs on unsubscribe: resource reload/destroy or component destroy.
        return () => source.close();
      }),
  });

  // jokeDataResource = rxResource<Joke[], { count: number }>({
  //   // ── BaseResourceOptions (identical to resource()) ─────────────────────
  //
  //   // Reactive params: re-triggers the stream whenever these change.
  //   // Return undefined to keep the resource idle.
  //   params: () => ({ count: 10 }),
  //
  //   // Returned while the resource is still loading or idle.
  //   defaultValue: [],
  //
  //   // Custom equality — avoids re-renders when the array content didn't change.
  //   equal: (a, b) =>
  //     a.length === b.length && a.every((j, i) => j.id === b[i].id),
  //
  //   // SSR TransferState key — server serialises the result under this key;
  //   // the client reads from it on hydration instead of re-fetching.
  //   id: 'jokes-rx-resource',
  //
  //   // Normally omitted; useful when creating a resource outside an injection context.
  //   injector: inject(Injector),
  //
  //   // ── RxResourceOptions ──────────────────────────────────────────────
  //
  //   // stream receives { params, abortSignal, previous } — same shape as
  //   // resource()'s loader — but must return an Observable, not a Promise.
  //   // Angular subscribes to it and unsubscribes automatically on abort.
  //   stream: ({ params, abortSignal }) => {
  //     abortSignal.addEventListener('abort', () => console.log('cancelled'));
  //     return this.#http.get<Joke[]>(
  //       JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count),
  //     );
  //   },
  //
  //   // Unlike resource(), rxResource()'s type signature does NOT accept
  //   // `debugName` — it's only on the ResourceOptions wrapper that resource()
  //   // uses internally, so passing it here is a type error.
  // });
}
