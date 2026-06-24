import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
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
  jokesService = inject(HttpDemoService);

  numberOfJokes = signal<number | null>(null);
  limit = signal<number>(3);

  // jokes = this.jokesService.httpResourceGetJokesWithoutParams;
  // jokes2 = this.jokesService.httpResourceGetJokesWithParams(signal(2));
  jokes = this.jokesService.httpResourceGetJokesWithParams(this.limit);
  // jokes4 = this.jokesService.httpResourceGetJokesWithOtherOverloadAndQueryParams(signal(4));
  loggingEffect = effect(() => {
    console.log(this.numberOfJokes());
  });

  computedJokesValue = computed<Joke[] | undefined>(() => this.jokes.value());

  reload(): void {
    this.jokes.reload();
  }

  protected readonly Math = Math;
}
