import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourceDemoService } from '../../../../service/resource-demo';

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

@Component({
  selector: 'app-resource-demo',
  templateUrl: './resource-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [ResourceDemoService],
})
export class ResourceDemo {
  readonly #jokesService = inject(ResourceDemoService);

  readonly count = signal<number>(1);

  readonly jokesResource = this.#jokesService.jokeResourceWithAbortSignal(this.count);

  increment(): void {
    this.count.update((v) => v + 1);
  }

  reload(): void {
    this.jokesResource.reload();
  }

  abort(): void {
    this.#jokesService.abortJokeRequest('user stopped the request');
  }

  destroy() {
    this.jokesResource.destroy();
  }
}
