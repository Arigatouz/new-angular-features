import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SignalForms } from './signal-forms/signal-forms';
import { DynamicSignalForms } from './dynamic-signal-forms/dynamic-signal-forms';

type formType = 'signal-forms' | 'dynamic-signal-forms';
type tab = {
  id: formType;
  label: string;
  description: string;
};
@Component({
  selector: 'app-forms-demo',
  imports: [SignalForms, DynamicSignalForms],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsDemo {
  readonly activeTab = signal<formType>('signal-forms');

  readonly tabs: tab[] = [
    {
      id: 'signal-forms',
      label: 'Signal Forms',
      description: 'Typed fields with built-in validation via form() and schema',
    },
    {
      id: 'dynamic-signal-forms',
      label: 'Dynamic Signal Forms',
      description: 'Array fields added/removed at runtime with applyEach()',
    },
  ];

  setTab(tab: formType): void {
    this.activeTab.set(tab);
  }
}
