import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourceDemoService, WikiRecentChange } from '../../../../service/resource-demo';

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
  protected readonly Math = Math;

  // ── loader resource ──────────────────────────────────────────────────
  readonly count = signal<number | undefined>(1);
  readonly jokesResource = this.#jokesService.jokeResourceWithAbortSignal(this.count);

  increment(): void {
    this.count.update((v) => (v !== undefined ? v + 1 : 1));
  }

  setSignalWithUndefined(): void {
    this.count.set(undefined);
    this.#jokesService.abortJokeRequest('user stopped the request');
  }
  reload(): void {
    this.jokesResource.reload();
  }
  abort(): void {
    this.#jokesService.abortJokeRequest('user stopped the request');
  }
  destroy(): void {
    this.jokesResource.destroy();
  }

  // ── simulated stream (joke API, one-at-a-time) ──────────────────────
  readonly streamCount = signal<number | undefined>(1);
  readonly jokeStreamResource = this.#jokesService.jokeStreamResource(this.streamCount);

  incrementStream(): void {
    this.streamCount.update((v) => (v !== undefined ? v + 1 : 1));
  }
  setStreamUndefined(): void {
    this.streamCount.set(undefined);
  }
  reloadStream(): void {
    this.jokeStreamResource.reload();
  }

  // ── real SSE stream: Wikimedia EventStreams ──────────────────────────
  readonly wikiEditStream = this.#jokesService.wikiEditStreamResource;

  wikiEdits(): WikiRecentChange[] {
    return this.wikiEditStream.hasValue() ? this.wikiEditStream.value() : [];
  }

  reloadWiki(): void {
    this.wikiEditStream.reload();
  }

  destroyWiki(): void {
    this.wikiEditStream.destroy();
  }
}
