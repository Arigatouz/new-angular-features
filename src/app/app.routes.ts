import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { About } from './component/about/about';
import { Features } from './component/features/features';
import { Contact } from './component/contact/contact';
import { Examples } from './component/examples/examples/examples';
import { SignalsDemo } from './component/examples/signals-demo/signals-demo';
import { FormsDemo } from './component/examples/forms-demo/forms-demo';
import { HttpDemo } from './component/examples/http-demo/http-demo';
import { AnimationsDemo } from './component/examples/animations-demo/animations-demo';
import { ServiceDecoratorContainer } from './component/examples/service-decorator-container/service-decorator-container';
import { ForeignComponentWrapper } from './component/examples/foreign-component-wrapper/foreign-component-wrapper';
import { WebMcpForm } from './component/examples/web-mcp-form/web-mcp-form';
import { CatchErrorDemo } from './component/examples/catch-error-demo/catch-error-demo';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'features', component: Features },
  { path: 'contact', component: Contact },
  {
    path: 'examples',
    component: Examples,
    children: [
      { path: '', redirectTo: 'signals', pathMatch: 'full' },
      { path: 'signals', component: SignalsDemo },
      { path: 'forms', component: FormsDemo },
      { path: 'http', component: HttpDemo },
      { path: 'animations', component: AnimationsDemo },
      { path: 'service-decorator-container', component: ServiceDecoratorContainer },
      { path: 'foreign-component', component: ForeignComponentWrapper },
      { path: 'web-mcp-form', component: WebMcpForm },
      { path: 'catch-error', component: CatchErrorDemo },
    ],
  },
];
