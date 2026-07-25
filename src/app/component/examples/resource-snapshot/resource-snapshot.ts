import {
  ChangeDetectionStrategy,
  Component,
  linkedSignal,
  Resource,
  resourceFromSnapshots,
  ResourceSnapshot,
  signal,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

export interface DemoUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface DemoPost {
  id: number;
  userId: number;
  title: string;
}

const BASE = 'https://jsonplaceholder.typicode.com';

@Component({
  selector: 'app-resource-snapshot',
  templateUrl: './resource-snapshot.html',
  styleUrl: './resource-snapshot.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
})
export class ResourceSnapshotDemo {
  // Reactive request key. undefined -> the resource stays `idle` (no request made).
  protected readonly userId = signal<number | undefined>(1);
  // When on, the URL points at a guaranteed-404 path so the resource lands in `error`.
  protected readonly forceError = signal(false);

  // A single httpResource. Its `.snapshot` signal is the whole point of this demo:
  // one atomic, type-narrowed read of the resource's state.
  protected readonly userRes = httpResource<DemoUser>(() => {
    const id = this.userId();
    if (id === undefined) {
      return undefined; // -> status 'idle'
    }
    return this.forceError()
      ? `${BASE}/users/${id}/does-not-exist` // 404 -> status 'error'
      : `${BASE}/users/${id}`;
  });

  // ── Composition with resourceFromSnapshots ─────────────────────────────
  // Take userRes's snapshots, and while a *new* request is loading, keep showing
  // the previous value instead of blanking out. resourceFromSnapshots turns the
  // transformed snapshot stream back into a Resource.
  readonly #stickySnapshot = linkedSignal<
    ResourceSnapshot<DemoUser | undefined>,
    ResourceSnapshot<DemoUser | undefined>
  >({
    source: this.userRes.snapshot,
    computation: (snap, previous) => {
      // Inline guards so TS narrows `previous.value` past the non-error check
      // (the error snapshot member has no `.value`).
      if (
        (snap.status === 'loading' || snap.status === 'reloading') &&
        previous !== undefined &&
        previous.value.status !== 'error'
      ) {
        // Report 'reloading' so consumers know it is stale, but keep the old value visible.
        return { status: 'reloading' as const, value: previous.value.value };
      }
      return snap;
    },
  });

  protected readonly stickyRes: Resource<DemoUser | undefined> = resourceFromSnapshots(
    this.#stickySnapshot,
  );

  // ── Chaining with ctx.chain ────────────────────────────────────────────
  // postsRes depends on userRes. `ctx.chain` returns the upstream value only when
  // userRes is resolved/local; otherwise it throws the upstream status, which
  // propagates into postsRes's own snapshot (idle / loading / error).
  protected readonly postsRes = httpResource<DemoPost[]>(
    (ctx) => {
      const user = ctx.chain(this.userRes);
      return user ? `${BASE}/posts?userId=${user.id}` : undefined;
    },
    { defaultValue: [] },
  );

  protected reload(): void {
    this.forceError.set(false);
    this.userRes.reload();
  }

  protected loadUser(id: number): void {
    this.forceError.set(false);
    this.userId.set(id);
  }

  protected setIdle(): void {
    this.forceError.set(false);
    this.userId.set(undefined);
  }

  protected toggleError(): void {
    this.userId.update((id) => id ?? 1); // guarantee there is an id to error on
    this.forceError.update((v) => !v);
  }

  protected setLocal(): void {
    // Overwriting the value with `.set()` moves the resource into `local` status.
    this.userRes.set({
      id: 0,
      name: 'Ada Lovelace (local)',
      username: 'ada',
      email: 'ada@local.dev',
      phone: '000-0000',
      website: 'local.dev',
    });
  }
}


const tempC = signal(0);
const tempF = linkedSignal(() => (tempC() * 9) / 5 + 32, {
  set: (valF) => tempC.set(((valF - 32) * 5) / 9),
});

console.log(tempF()); // 32

// Setting Fahrenheit updates Celsius, which reactively updates Fahrenheit
tempF.set(212);
console.log(tempC()); // 100
console.log(tempF()); // 212
