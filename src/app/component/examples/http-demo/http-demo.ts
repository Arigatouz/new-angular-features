import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';

export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

@Component({
  selector: 'app-http-demo',
  imports: [],
  templateUrl: './http-demo.html',
  styleUrl: './http-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDemo {
  readonly jokes = httpResource<Joke[]>(() => 'https://official-joke-api.appspot.com/random_ten', {
    defaultValue: [],
  });

  reload(): void {
    this.jokes.reload();
  }
}
