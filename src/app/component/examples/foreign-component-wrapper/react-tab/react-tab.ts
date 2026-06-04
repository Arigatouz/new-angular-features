import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import React, { createElement, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

function ReactCounter() {
  const [count, setCount] = useState(0);
  return createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' } },
    createElement(
      'p',
      { style: { color: '#a0a0a0', fontSize: '14px', margin: 0 } },
      'React 19 component — mounted via ',
      createElement('code', { style: { color: '#61dafb', backgroundColor: '#1a1a2e', padding: '2px 6px', borderRadius: '4px' } }, 'createRoot'),
      ' inside an Angular host element.'
    ),
    createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
      createElement(
        'button',
        {
          onClick: () => setCount(c => c - 1),
          style: {
            width: '40px', height: '40px', borderRadius: '8px',
            background: '#2d2d2d', border: '1px solid #3d3d3d',
            color: 'white', fontSize: '18px', cursor: 'pointer',
          },
        },
        '−'
      ),
      createElement(
        'span',
        { style: { fontSize: '32px', fontWeight: 700, color: '#61dafb', minWidth: '60px', textAlign: 'center' } },
        count
      ),
      createElement(
        'button',
        {
          onClick: () => setCount(c => c + 1),
          style: {
            width: '40px', height: '40px', borderRadius: '8px',
            background: '#2d2d2d', border: '1px solid #3d3d3d',
            color: 'white', fontSize: '18px', cursor: 'pointer',
          },
        },
        '+'
      )
    ),
    createElement(
      'button',
      {
        onClick: () => setCount(0),
        style: {
          padding: '6px 14px', borderRadius: '6px',
          background: 'transparent', border: '1px solid #3d3d3d',
          color: '#a0a0a0', fontSize: '13px', cursor: 'pointer',
        },
      },
      'Reset'
    )
  );
}

@Component({
  selector: 'app-react-tab',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="space-y-4">
      <div class="bg-[#0d1117] rounded-lg border border-[#61dafb]/20 p-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-[#61dafb]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63C2.08 14.93.25 13.69.25 12c0-1.69 1.83-2.93 4.37-3.68C4 5.74 4.16 3.53 5.62 2.69c1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95z"/>
          </svg>
          <span class="text-[#61dafb] font-semibold text-sm">React 19 — Live Component</span>
        </div>
        <div #reactHost></div>
      </div>

      <div class="bg-[#1a1a1a] rounded-lg border border-[#2d2d2d] p-4">
        <p class="text-[#a0a0a0] text-xs font-mono mb-2">How Angular v22 <code class="text-[#dd0031]">foreignImports</code> will wire this up:</p>
        <pre class="text-xs text-[#e0e0e0] overflow-x-auto leading-relaxed"><code>// react-adapter.ts
import React from 'react';
import &#123; createRoot &#125; from 'react-dom/client';
import &#123; ForeignComponent &#125; from '@angular/core';

export const ReactCounterAdapter: ForeignComponent = &#123;
  // adapter fn: Angular passes a host element, you mount React inside
  render(hostElement: HTMLElement, props: Record&lt;string, unknown&gt;) &#123;
    const root = createRoot(hostElement);
    root.render(React.createElement(ReactCounter, props));
    return () => root.unmount(); // cleanup
  &#125;,
&#125;;

// my-component.ts
@Component(&#123;
  selector: 'app-my',
  foreignImports: [&#123;
    component: ReactCounterAdapter,
    as: 'react-counter',  // used as tag name in template
  &#125;],
  template: &#96;&lt;react-counter [count]="count()" /&gt;&#96;,
&#125;)</code></pre>
        <p class="text-[#555] text-xs mt-2 italic">Note: <code class="text-[#555]">foreignImports</code> is compiler-infrastructure only in build sha-06b004e — rendering will land in a future nightly.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactTab implements OnDestroy {
  private readonly reactHost = viewChild.required<ElementRef<HTMLElement>>('reactHost');
  private root: Root | null = null;

  constructor() {
    afterNextRender(() => {
      this.root = createRoot(this.reactHost().nativeElement);
      this.root.render(createElement(ReactCounter, null));
    });
  }

  ngOnDestroy() {
    this.root?.unmount();
  }
}
