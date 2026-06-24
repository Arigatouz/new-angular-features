import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

@Component({
  selector: 'app-rx-resource-demo',
  templateUrl: './rx-resource-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxResourceDemo {
  #http = inject(HttpClient);

  jokes = rxResource({
    stream: () => this.#http.get<Joke[]>('https://official-joke-api.appspot.com/random_ten'),
    defaultValue: [] as Joke[],
  });

  reload(): void {
    this.jokes.reload();
  }
}
