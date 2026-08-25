import { Directive, effect, inject } from '@angular/core';
import { FORM_FIELD } from '@angular/forms/signals';
import { PLACEHOLDER } from './signalform.schema';

@Directive({
  selector: 'input[formField], textarea[formField]',
})
export class FieldPlaceholderDirective {
  readonly #formField = inject(FORM_FIELD);

  constructor() {
    effect(() => {
      const placeholder = this.#formField.state().metadata(PLACEHOLDER)?.();
      if (placeholder !== undefined) {
        (this.#formField.element as HTMLInputElement | HTMLTextAreaElement).placeholder = placeholder;
      }
    });
  }
}
