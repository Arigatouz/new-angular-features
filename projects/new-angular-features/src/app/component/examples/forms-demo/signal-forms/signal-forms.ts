import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { FieldPlaceholderDirective } from './field-placeholder.directive';
import { signalFormSchema } from './signalform.schema';

export interface ProfileModel {
  username: string;
  email: string;
  role: string;
  bio: string;
}

@Component({
  selector: 'app-signal-forms',
  imports: [FormRoot, FormField, FieldPlaceholderDirective, JsonPipe],
  templateUrl: './signal-forms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalForms {
  readonly submitted = signal<boolean>(false);

  readonly #model = signal<ProfileModel>({
    username: '',
    email: '',
    role: '',
    bio: '',
  });

  readonly profileForm = form(this.#model, signalFormSchema, {
    submission: {
      action: async (): Promise<void> => {
        this.submitted.set(true);
        setTimeout(() => this.submitted.set(false), 3000);
      },
    },
  });
}
