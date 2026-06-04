import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactTab } from './react-tab/react-tab';
import { VueTab } from './vue-tab/vue-tab';
import { SvelteTab } from './svelte-tab/svelte-tab';

type Tab = 'react' | 'vue' | 'svelte';

@Component({
  selector: 'app-foreign-component-wrapper',
  imports: [ReactTab, VueTab, SvelteTab],
  templateUrl: './foreign-component-wrapper.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForeignComponentWrapper {
  readonly activeTab = signal<Tab>('react');

  readonly tabs: { id: Tab; label: string; color: string }[] = [
    { id: 'react', label: 'React 19', color: '#61dafb' },
    { id: 'vue', label: 'Vue 3.5', color: '#42b883' },
    { id: 'svelte', label: 'Svelte 5', color: '#ff3e00' },
  ];

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }
}
