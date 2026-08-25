import { inject, Injector, resource, Service, Signal, signal } from '@angular/core';
import { Joke } from './jokes';
import { JOKES_API } from './http-demo-service';
import { parse } from 'valibot';

export interface WikiRecentChange {
  title: string;
  user: string;
  comment: string;
  wiki: string;
  type: 'edit' | 'new' | 'categorize' | 'log';
  timestamp: number;
  server_url: string;
  namespace: number;
  length?: { old: number; new: number };
}

export const WIKI_STREAM_URL = 'https://stream.wikimedia.org/v2/stream/recentchange';

@Service({
  autoProvided: false,
})
export class ResourceDemoService {
  readonly #injector = inject(Injector);

  #manualAbortController = new AbortController();

  abortJokeRequest(reason?: string) {
    this.#manualAbortController.abort(reason ?? 'User cancelled');
    this.#manualAbortController = new AbortController();
  }

  pureJokeDataResource = resource({
    loader: (): Promise<Joke[]> =>
      fetch(`${JOKES_API.JOKE_API_10_JOKES}`).then((response) => response.json()),
  });

  asyncAwaitJokeDataResourceWithParameter = (jokeCount: Signal<number | undefined>) => {
    return resource<Joke[], { count: number } | undefined>({
      params: () => (jokeCount() !== undefined ? { count: jokeCount()! } : undefined),
      defaultValue: [],
      loader: async ({ params }) => {
        const response = await fetch(`${JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count)}`);
        return await response.json();
      },
    })
  };

  jokeResourceWithAbortSignal = (jokeCount: Signal<number | undefined>) => {
    return resource<Joke[], { count: number } | undefined>({
      params: () => (jokeCount() !== undefined ? { count: jokeCount()! } : undefined),
      defaultValue: [],
      loader: async ({ params, abortSignal }) => {
        abortSignal.addEventListener(
          'abort',
          () => {
            console.log(`Request aborted: ${abortSignal.reason}`);
          },
          { once: true },
        );

        const manualSignal = this.#manualAbortController.signal;
        const combinedAbortSignals = AbortSignal.any([abortSignal, manualSignal]);

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 2000);
          combinedAbortSignals.addEventListener(
            'abort',
            () => {
              clearTimeout(timer);
              reject(combinedAbortSignals.reason);
            },
            { once: true },
          );
        });

        const response = await fetch(`${JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count)}`, {
          signal: combinedAbortSignals,
        });
        return await response.json();
      },
    });
  };

  // Async generator — yields one joke at a time with a 2s gap between each.
  async *#jokeGenerator(count: number, abortSignal: AbortSignal): AsyncGenerator<Joke> {
    for (let i = 0; i < count; i++) {
      if (abortSignal.aborted) return;

      if (i > 0) {
        // Delay between jokes so the streaming effect is visible.
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 2000);
          abortSignal.addEventListener(
            'abort',
            () => {
              clearTimeout(timer);
              reject(abortSignal.reason);
            },
            { once: true },
          );
        });
        if (abortSignal.aborted) return;
      }

      const res = await fetch(JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(1), { signal: abortSignal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const [joke] = await res.json();
      yield joke;
    }
  }

  jokeStreamResource = (jokeCount: Signal<number | undefined>) => {
    return resource<Joke[], { count: number } | undefined>({
      params: () => {
        const count = jokeCount();
        return count !== undefined && count > 0 ? { count } : undefined;
      },
      defaultValue: [],
      debugName: 'JokeStreamResource',
      stream: async ({ params, abortSignal }) => {
        const generator = this.#jokeGenerator(params.count, abortSignal);

        // Pull the first joke before returning — keeps resource in 'loading' until real data arrives.
        const { value: firstJoke, done } = await generator.next();
        if (done || !firstJoke) throw new Error('No jokes returned');

        const accumulated = signal<{ value: Joke[] } | { error: Error }>({ value: [firstJoke] });

        // Consume the rest with for await...of in a fire-and-forget IIFE.
        (async () => {
          try {
            for await (const joke of generator) {
              accumulated.update((prev) => ({
                value: [...('value' in prev ? prev.value : []), joke],
              }));
            }
          } catch (err) {
            if (!abortSignal.aborted) {
              accumulated.set({ error: err instanceof Error ? err : new Error(String(err)) });
            }
          }
        })().then(r => console.log('Joke stream finished', r));

        return accumulated;
      },
    });
  };

  // ── Real SSE stream: Wikimedia EventStreams ──────────────────────────
  // Connects to live Wikipedia edits via Server-Sent Events.
  // No params → stream starts once and runs until the resource is destroyed.
  // EventSource is closed via abortSignal when the component is destroyed.
  wikiEditStreamResource = resource<WikiRecentChange[], Record<never, never>>({
    params: () => ({}),
    defaultValue: [],
    debugName: 'WikiEditStream',
    stream: ({ abortSignal }) => {
      const editsSignal = signal<{ value: WikiRecentChange[] } | { error: Error }>({ value: [] });

      const source = new EventSource(WIKI_STREAM_URL);

      // Angular fires abortSignal when the resource is destroyed or reloaded.
      // EventSource has no native AbortSignal support — close it manually.
      abortSignal.addEventListener('abort', () => source.close(), { once: true });

      source.onmessage = (event: MessageEvent) => {
        if (abortSignal.aborted) {
          source.close();
          return;
        }
        try {
          const edit = JSON.parse(event.data as string) as WikiRecentChange;
          // Filter to main namespace (0) articles only for a cleaner feed.
          if (edit.namespace !== 0) return;
          editsSignal.update((prev) => ({
            value: [edit, ...('value' in prev ? prev.value : [])].slice(0, 20),
          }));
        } catch {
          /* ignore malformed events */
        }
      };

      source.onerror = () => {
        if (!abortSignal.aborted) {
          editsSignal.set({
            error: new Error('EventSource connection lost — reload to reconnect'),
          });
        }
        source.close();
      };

      return editsSignal;
    },
  });

  // jokeDataResource = resource<Joke[], { count: number }>({
  //   // ── BaseResourceOptions ──────────────────────────────────────────────
  //
  //   // Reactive params: re-triggers the loader whenever these change.
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
  //   id: 'jokes-resource',
  //
  //   // Normally omitted; useful when creating a resource outside an injection context.
  //   injector: inject(Injector),
  //
  //   // ── PromiseResourceOptions ───────────────────────────────────────────
  //
  //   // loader receives { params, abortSignal, previous } and must return a Promise.
  //   loader: async ({ params, abortSignal }) => {
  //     const response = await fetch(
  //       JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count),
  //       { signal: abortSignal },
  //     );
  //
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch jokes: ${response.status}`);
  //     }
  //
  //     return (await response.json()) as Joke[];
  //   },
  //
  //   // debugName is on ResourceOptions (the union wrapper), not PromiseResourceOptions itself,
  //   // but it ships as part of the same options object.
  //   debugName: 'JokeResourceDemo',
  // });
}
