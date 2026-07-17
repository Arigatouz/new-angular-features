import { Component, effect, signal } from '@angular/core';
import { FieldTree, form, FormField, FormRoot, required, validate } from '@angular/forms/signals';
import { tempFormInitialization } from './temp-form.constant';
import { tempFormSchema } from './temp-form.schema';
import { FieldError } from './field-error/field-error';

type UserProfile = {
  username: string;
  email: string;
  role: string;
  bio: string;
};

@Component({
  selector: 'app-temp-component',
  imports: [FormField, FormRoot, FieldError],
  templateUrl: './temp-component.html',
  styleUrls: ['./temp-component.css'],
})
export class TempComponent {
  userForm = form(tempFormInitialization, tempFormSchema, {
    name: 'userForm',
    submission: {
      action: async () => {
        await new Promise((resolve) =>
          setTimeout(() => {
            console.log('Submitted');
            console.log(this.userForm().value());
            resolve(true);
          }, 2000),
        );
      },
    },
  });

  log = effect(() => {
    this.userForm().submitting();
  });

  protected ariaInvalidState(field: FieldTree<unknown>): boolean | undefined {
    return field().touched() && !field().pending() ? field().errors().length > 0 : undefined;
  }

  protected addEmail() {
    this.userForm.personalInfo.emails().value.update((emails) => [...emails, '']);
  }

  protected removeEmail($index: number) {
    this.userForm.personalInfo
      .emails()
      .value.update((emails) => emails.filter((_, index) => index !== $index));
  }
}
