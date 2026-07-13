import {
  ChangeDetectionStrategy,
  Component,
  computed,
  debounced,
  effect,
  inject,
  linkedSignal,
  Resource,
  resourceFromSnapshots,
  ResourceSnapshot,
  Signal,
  signal,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HttpDemoService } from '../../../../service/http-demo-service';
import { JsonPipe } from '@angular/common';

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

@Component({
  selector: 'app-http-resource-demo',
  templateUrl: './http-resource-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class HttpResourceDemo {
  protected readonly Math = Math;
  jokesService = inject(HttpDemoService);

  numberOfJokes = signal<number | null>(null);
  limit = signal<number>(3);

  jokes = this.jokesService.httpResourceGetJokesWithParams(this.limit);

  jokeSnapshot = withPreviousValue(this.jokes);

  // jokes = this.jokesService.httpResourceGetJokesWithoutParams;
  // jokes2 = this.jokesService.httpResourceGetJokesWithParams(signal(2));
  // jokes4 = this.jokesService.httpResourceGetJokesWithOtherOverloadAndQueryParams(signal(4));
  loggingEffect = effect(() => {
    console.log(this.numberOfJokes());
  });

  computedJokesValue = computed<Joke[] | undefined>(() => this.jokes.value());

  reload(): void {
    this.jokes.reload();
  }
  searchQuery = signal<string>('');
  chuckNorrisResource = this.jokesService.httpResourceGetChuckNorrisWithSearch(this.searchQuery);

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }
}

export const withPreviousValue = <T>(input: Resource<T>): Resource<T> => {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        return { status: 'loading' as const, value: previous.value.value };
      }
      return snap;
    },
  });
  return resourceFromSnapshots(derived);
};
