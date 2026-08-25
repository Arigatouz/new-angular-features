import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  form,
  FormRoot,
  FormField,
  required,
  email,
  min,
  max,
  minLength,
  maxLength,
} from '@angular/forms/signals';

interface UserFormData {
  name: string;
  email: string;
  age: number;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
}

@Component({
  selector: 'app-web-mcp-form',
  imports: [FormRoot, FormField],
  templateUrl: './web-mcp-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebMcpForm {
  readonly submitted = signal(false);

  readonly #userData = signal<UserFormData>({
    name: 'Ali G',
    email: 'aliG@aliG.com',
    age: 39,
    gender: 'male',
    address: {
      street: 'some street',
      city: 'some city',
      state: 'some state',
      zip: 12345,
    },
  });

  readonly userForm = form(
    this.#userData,
    (s) => {
      required(s.name, { message: 'Full name is required' });
      minLength(s.name, 2, { message: 'Name must be at least 2 characters' });
      maxLength(s.name, 60, { message: 'Name cannot exceed 60 characters' });

      required(s.email, { message: 'Email is required' });
      email(s.email, { message: 'Enter a valid email address' });

      required(s.age, { message: 'Age is required' });
      min(s.age, 1, { message: 'Age must be at least 1' });
      max(s.age, 120, { message: 'Age cannot exceed 120' });

      required(s.gender, { message: 'Please select a gender' });

      required(s.address.street, { message: 'Street is required' });
      required(s.address.city, { message: 'City is required' });
      required(s.address.state, { message: 'State is required' });
      required(s.address.zip, { message: 'ZIP code is required' });
      min(s.address.zip, 10000, { message: 'Enter a valid 5-digit ZIP' });
      max(s.address.zip, 99999, { message: 'Enter a valid 5-digit ZIP' });
    },
    {
      experimentalWebMcpTool: {
        name: 'createUser',
        description: 'Creates a user with the given name, email, age, gender and address.',
      },
      submission: {
        action: async () => {
          this.submitted.set(true);
          console.log('Submitted:', this.#userData());
          setTimeout(() => this.submitted.set(false), 3000);
        },
      },
    },
  );
}
