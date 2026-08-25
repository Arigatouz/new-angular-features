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

export type ActiveTab = 'httpResource' | 'blob' | 'text' | 'arrayBuffer';

@Component({
  selector: 'app-http-resource-demo',
  templateUrl: './http-resource-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class HttpResourceDemo {
  protected readonly Math = Math;
  jokesService = inject(HttpDemoService);

  // ── Tab state ────────────────────────────────────────────────────────────
  activeTab = signal<ActiveTab>('httpResource');

  // ── Tab 1: httpResource (JSON jokes) ─────────────────────────────────────
  numberOfJokes = signal<number | null>(null);
  limit = signal<number>(3);

  jokes = this.jokesService.httpResourceGetJokesWithParams(this.limit);

  jokeSnapshot = withPreviousValue(this.jokes);

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

  // ── Tab 2: httpResource.blob ──────────────────────────────────────────────
  blobWidth = signal<number>(300);
  blobHeight = signal<number>(200);
  blobResource = this.jokesService.httpResourceWithBlob(this.blobWidth, this.blobHeight);
  blobUrl = signal<string | null>(null);

  private readonly blobUrlEffect = effect((onCleanup) => {
    const blob = this.blobResource.value();
    if (!blob) {
      this.blobUrl.set(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    this.blobUrl.set(url);
    // Revoke the previous object URL on every re-run (reload) and on destroy,
    // otherwise each reload leaks a URL for the lifetime of the document.
    onCleanup(() => URL.revokeObjectURL(url));
  });

  // ── Tab 3: httpResource.text ──────────────────────────────────────────────
  textType = signal<'meat-and-filler' | 'all-meat'>('meat-and-filler');
  textParagraphs = signal<number>(1);
  textResource = this.jokesService.httpResourceWithText(this.textType, this.textParagraphs);

  // ── Tab 4: httpResource.arrayBuffer ────────────────────────────────────────
  // Real-world case for arrayBuffer over blob: AudioContext.decodeAudioData()
  // takes a BufferSource and refuses a Blob. We fetch a sound as raw bytes,
  // decode it into an AudioBuffer, and play it on demand.
  readonly audioFiles = [
    {
      label: 'T-Rex roar (39 KB)',
      value: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    },
    {
      label: 'Concert crowd (240 KB)',
      value: 'https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg',
    },
    {
      label: 'Outfoxing the fox (1.8 MB)',
      value: 'https://mdn.github.io/webaudio-examples/audio-basics/outfoxing.mp3',
    },
  ];

  audioUrl = signal<string>(this.audioFiles[0].value);

  arrayBufferResource = this.jokesService.httpResourceWithArrayBuffer(this.audioUrl);

  // Size of the raw bytes we fetched, read before decoding detaches nothing here
  // (we decode a copy), purely for display.
  fetchedBytes = computed(() => this.arrayBufferResource.value()?.byteLength ?? null);

  #audioCtx: AudioContext | null = null;
  audio = signal<AudioContext | null>(null);
  decodedAudio = signal<AudioBuffer | null>(null);
  decodeError = signal<string | null>(null);
  isPlaying = signal<boolean>(false);

  audioMeta = computed(() => {
    const b = this.decodedAudio();
    if (!b) return null;
    return {
      duration: b.duration,
      channels: b.numberOfChannels,
      sampleRate: b.sampleRate,
    };
  });

  private readonly decodeEffect = effect(() => {
    const buffer = this.arrayBufferResource.value();
    // Reset on every change (new file selected, reload, or loading state).
    this.decodedAudio.set(null);
    this.decodeError.set(null);
    if (!buffer || typeof AudioContext === 'undefined') return;

    const ctx = (this.#audioCtx ??= new AudioContext());
    // decodeAudioData detaches the ArrayBuffer it receives, so decode a copy
    // and leave the original intact for the "bytes fetched" readout.
    ctx
      .decodeAudioData(buffer.slice(0))
      .then((decoded) => this.decodedAudio.set(decoded))
      .catch((err) => this.decodeError.set(err.message));
  });

  play(): void {
    const decoded = this.decodedAudio();
    if (!decoded || !this.#audioCtx) return;
    // Browsers create an AudioContext suspended until a user gesture; the click
    // that fired this method is that gesture, so resume() unlocks playback.
    void this.#audioCtx.resume();
    const source = this.#audioCtx.createBufferSource();
    source.buffer = decoded;
    source.connect(this.#audioCtx.destination);
    source.onended = () => this.isPlaying.set(false);
    source.start();
    this.isPlaying.set(true);
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
