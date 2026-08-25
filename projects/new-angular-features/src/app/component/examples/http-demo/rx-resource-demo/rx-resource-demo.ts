import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RxResourceDemoService } from '../../../../service/rx-resource-demo';
import type { WikiRecentChange } from '../../../../service/resource-demo';

@Component({
  selector: 'app-rx-resource-demo',
  templateUrl: './rx-resource-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxResourceDemoService],
})
export class RxResourceDemo {
  readonly #jokesService = inject(RxResourceDemoService);
  protected readonly Math = Math;

  // ── basic rxResource — no params ──────────────────────────────────────
  readonly jokes = this.#jokesService.pureJokeDataResource;

  reload(): void {
    this.jokes.reload();
  }

  // ── params + abort/cancel ──────────────────────────────────────────────
  readonly count = signal<number | undefined>(1);
  readonly jokesWithAbort = this.#jokesService.jokeResourceWithAbortSignal(this.count);

  increment(): void {
    this.count.update((v) => (v !== undefined ? v + 1 : 1));
  }

  setSignalWithUndefined(): void {
    this.count.set(undefined);
  }

  cancel(): void {
    this.#jokesService.cancelJokeRequest('User cancelled');
  }

  reloadWithAbort(): void {
    this.jokesWithAbort.reload();
  }

  // ── streaming resource (multi-emission) ────────────────────────────────
  readonly streamCount = signal<number | undefined>(1);
  readonly jokeStream = this.#jokesService.jokeStreamResource(this.streamCount);

  incrementStream(): void {
    this.streamCount.update((v) => (v !== undefined ? v + 1 : 1));
  }

  setStreamUndefined(): void {
    this.streamCount.set(undefined);
  }

  reloadStream(): void {
    this.jokeStream.reload();
  }

  // ── real SSE stream: Wikimedia EventStreams ────────────────────────────
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
