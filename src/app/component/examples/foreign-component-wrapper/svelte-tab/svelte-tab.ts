import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { mount, unmount } from 'svelte';
// Pre-compiled Svelte 5 component (compiled via svelte/compiler at build-prep time)
import SvelteCounter from './svelte-counter.svelte.js';

@Component({
  selector: 'app-svelte-tab',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="space-y-4">
      <div class="bg-[#1a0a00] rounded-lg border border-[#ff3e00]/20 p-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-[#ff3e00]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.242 20.258c-1.035.701-2.56.536-3.412-.371L3.553 18.56c-.855-.908-.963-2.317-.255-3.352l.001-.002 8.37-12.323c.7-1.033 2.116-1.328 3.152-.659 1.036.669 1.333 2.017.664 3.052l-5.243 7.72 2.19 2.33c.853.908.854 2.314-.001 3.223l-4.189-4.174Z"/>
          </svg>
          <span class="text-[#ff3e00] font-semibold text-sm">Svelte 5 — Live Component</span>
        </div>
        <div #svelteHost></div>
      </div>

      <div class="bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] p-4">
        <p class="text-[#a0a0a0] text-xs font-mono mb-2">How Angular v22 <code class="text-[#dd0031]">foreignImports</code> will wire this up:</p>
        <pre class="text-xs text-[#e0e0e0] overflow-x-auto leading-relaxed"><code>// svelte-counter.svelte
&lt;script&gt;
  let count = $state(0);  // Svelte 5 rune
&lt;/script&gt;
&lt;button onclick=&#123;() =&gt; count--&#125;&gt;−&lt;/button&gt;
&lt;span&gt;&#123;count&#125;&lt;/span&gt;
&lt;button onclick=&#123;() =&gt; count++&#125;&gt;+&lt;/button&gt;

// adapter.ts
import SvelteCounter from './svelte-counter.svelte';
import &#123; foreignImport &#125; from '@angular/core';  // not exported yet

export function svelteCounter() &#123;
  return foreignImport((el: HTMLElement) =&gt; &#123;
    const comp = mount(SvelteCounter, &#123; target: el &#125;);
    return () =&gt; unmount(comp);
  &#125;);
&#125;

// my-component.ts
@Component(&#123;
  foreignImports: [svelteCounter()],
  template: &#96;&lt;svelteCounter /&gt;&#96;,
&#125;)</code></pre>
        <p class="text-[#555] text-xs mt-2 italic">
          Note: the <code class="text-[#555]">.svelte.js</code> file here is pre-compiled via
          <code class="text-[#555]">svelte/compiler</code> — the final API will let you import
          <code class="text-[#555]">.svelte</code> files directly once an Angular Vite plugin ships.
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvelteTab implements OnDestroy {
  private readonly svelteHost = viewChild.required<ElementRef<HTMLElement>>('svelteHost');
  private component: Record<string, unknown> | null = null;

  constructor() {
    afterNextRender(() => {
      this.component = mount(SvelteCounter, { target: this.svelteHost().nativeElement });
    });
  }

  ngOnDestroy() {
    if (this.component) {
      unmount(this.component);
    }
  }
}
