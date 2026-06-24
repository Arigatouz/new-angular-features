import { debounced, inject, Injector, resource, Service, Signal, signal } from '@angular/core';
import { Joke } from './jokes';
import { JOKES_API } from './http-demo-service';
import { number } from 'valibot';

@Service({
  autoProvided: false,
})
export class ResourceDemoService {
  readonly #injector = inject(Injector);

  pureJokeDataResource = resource({
    loader: () => fetch(`${JOKES_API.JOKE_API_10_JOKES}`).then((response) => response.json()),
  });

  asyncAwaitJokeDataResourceWithParameter = (jokeCount: Signal<number | null>) => {
    return resource<Joke[], { count: number | null }>({
      params: () => ({ count: jokeCount() }),
      loader: async ({ params }) => {
        if (params.count === null) return [];

        const response = await fetch(`${JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count)}`);
        return await response.json();
      },
    });
  };

  #manualAbortController = new AbortController();

  abortJokeRequest(reason?: string) {
    this.#manualAbortController.abort(reason ?? 'User cancelled');
    this.#manualAbortController = new AbortController();
  }

  jokeResourceWithAbortSignal = (jokeCount: Signal<number | null>) => {
    return resource<Joke[], { count: number | null } | undefined>({
      params: () => ({ count: jokeCount() }),
      loader: async ({ params, abortSignal }) => {
        if (params.count === null) return [];

        const manualSignal = this.#manualAbortController.signal;
        const combined = AbortSignal.any([abortSignal, manualSignal]);

        abortSignal.addEventListener('abort', () => {
          console.log('🛑 aborted! reason:', abortSignal.reason);
        });

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 2000);
          combined.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(combined.reason);
          });
        });

        const response = await fetch(
          `${JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(params.count)}`,
          { signal: combined },
        );
        return await response.json();
      },
    });
  };

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
