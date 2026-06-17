import { ChangeDetectionStrategy, Component, debounced, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { httpResource } from '@angular/common/http';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-examples',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './examples.html',
  styleUrl: './examples.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Examples {
  search = signal<string>('');
  debouncedSearched = debounced(this.search, 2000);


  userData = httpResource(()=> this.debouncedSearched.hasValue() ? `/api/user?search=${this.search}` : undefined)


  
  readonly navItems = signal<NavItem[]>([
    {
      path: '/examples/signals',
      label: 'Signals',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
      path: '/examples/forms',
      label: 'Forms',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      path: '/examples/http',
      label: 'HTTP',
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    },
    {
      path: '/examples/animations',
      label: 'Animations',
      icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/examples/service-decorator-container',
      label: 'Service Decorator',
      icon: 'M12 6.5l5 3v5l-5 3-5-3v-5l5-3z M12 6.5V3 M12 17.5V21 M7 9.5L4 8 M17 9.5l3-1.5 M7 14.5L4 16 M17 14.5l3 1.5 M9.5 10.5h5 M9.5 13.5h5 M8 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2 M18 3l.75 1.5L20.5 5.25l-1.75.75L18 7.5l-.75-1.5-1.75-.75 1.75-.75L18 3z',
    },
    {
      path: '/examples/foreign-component',
      label: 'Foreign Component',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    },
    {
      path: '/examples/web-mcp-form',
      label: 'WebMCP Form',
      icon: 'M9 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3a2 2 0 002 2h2a2 2 0 002-2M9 3a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    },
    {
      path: '/examples/catch-error',
      label: 'catchError',
      icon: 'M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z',
    },
  ]);
}
