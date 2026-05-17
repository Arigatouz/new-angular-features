import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

interface FormModel {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-forms-demo',
  imports: [FormsModule, JsonPipe],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsDemo {
  readonly form = signal<FormModel>({
    name: '',
    email: '',
    message: '',
  });

  readonly submitted = signal(false);

  updateField<K extends keyof FormModel>(field: K, value: string): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  onSubmit(): void {
    this.submitted.set(true);
    setTimeout(() => this.submitted.set(false), 3000);
  }
}
