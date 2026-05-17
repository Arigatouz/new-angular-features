import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly navItems = signal<NavItem[]>([
    { path: '/home', label: 'Home' },
    // { path: '/about', label: 'About' },
    // { path: '/features', label: 'Features' },
    { path: '/examples', label: 'Examples' },
    // { path: '/contact', label: 'Contact' },
  ]);
}
