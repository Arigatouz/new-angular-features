import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpResourceDemo } from './http-resource-demo/http-resource-demo';
import { ResourceDemo } from './resource-demo/resource-demo';
import { RxResourceDemo } from './rx-resource-demo/rx-resource-demo';

type Tab = 'httpResource' | 'resource' | 'rxResource';

@Component({
  selector: 'app-http-demo',
  imports: [HttpResourceDemo, ResourceDemo, RxResourceDemo],
  templateUrl: './http-demo.html',
  styleUrl: './http-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDemo {
  activeTab = signal<Tab>('httpResource');

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}
