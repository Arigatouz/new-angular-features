import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { createApp, defineComponent, ref, h, App } from 'vue';

const VueCounter = defineComponent({
  setup() {
    const count = ref(0);
    const btnStyle = {
      width: '40px', height: '40px', borderRadius: '8px',
      background: '#2d2d2d', border: '1px solid #3d3d3d',
      color: 'white', fontSize: '18px', cursor: 'pointer',
    };
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' } }, [
        h('p', { style: { color: '#a0a0a0', fontSize: '14px', margin: 0 } }, [
          'Vue 3.5 component — mounted via ',
          h('code', { style: { color: '#42b883', background: '#0d1a12', padding: '2px 6px', borderRadius: '4px' } }, 'createApp'),
          ' inside an Angular host element.',
        ]),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, [
          h('button', { style: btnStyle, onClick: () => count.value-- }, '−'),
          h('span', { style: { fontSize: '32px', fontWeight: 700, color: '#42b883', minWidth: '60px', textAlign: 'center' } }, count.value),
          h('button', { style: btnStyle, onClick: () => count.value++ }, '+'),
        ]),
        h('button', {
          style: { padding: '6px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid #3d3d3d', color: '#a0a0a0', fontSize: '13px', cursor: 'pointer' },
          onClick: () => (count.value = 0),
        }, 'Reset'),
      ]);
  },
});

@Component({
  selector: 'app-vue-tab',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="space-y-4">
      <div class="bg-[#0d1a12] rounded-lg border border-[#42b883]/20 p-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-[#42b883]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 3h3.5L12 15l6.5-12H22L12 21 2 3m4.5 0h3L12 7.58 14.5 3h3L12 13.08 6.5 3z"/>
          </svg>
          <span class="text-[#42b883] font-semibold text-sm">Vue 3.5 — Live Component</span>
        </div>
        <div #vueHost></div>
      </div>

      <div class="bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] p-4">
        <p class="text-[#a0a0a0] text-xs font-mono mb-2">How Angular v22 <code class="text-[#dd0031]">foreignImports</code> will wire this up:</p>
        <pre class="text-xs text-[#e0e0e0] overflow-x-auto leading-relaxed"><code>// vue-adapter.ts
import &#123; createApp, defineComponent &#125; from 'vue';
import &#123; ForeignComponent &#125; from '@angular/core';

export const VueCounterAdapter: ForeignComponent = &#123;
  render(hostElement: HTMLElement, props: Record&lt;string, unknown&gt;) &#123;
    const app = createApp(VueCounter, props);
    app.mount(hostElement);
    return () => app.unmount(); // cleanup
  &#125;,
&#125;;

// my-component.ts
@Component(&#123;
  selector: 'app-my',
  foreignImports: [&#123;
    component: VueCounterAdapter,
    as: 'vue-counter',
  &#125;],
  template: &#96;&lt;vue-counter [count]="count()" /&gt;&#96;,
&#125;)</code></pre>
        <p class="text-[#555] text-xs mt-2 italic">Note: <code class="text-[#555]">foreignImports</code> is compiler-infrastructure only in build sha-06b004e — rendering will land in a future nightly.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VueTab implements OnDestroy {
  private readonly vueHost = viewChild.required<ElementRef<HTMLElement>>('vueHost');
  private app: App | null = null;

  constructor() {
    afterNextRender(() => {
      this.app = createApp(VueCounter);
      this.app.mount(this.vueHost().nativeElement);
    });
  }

  ngOnDestroy() {
    this.app?.unmount();
  }
}
