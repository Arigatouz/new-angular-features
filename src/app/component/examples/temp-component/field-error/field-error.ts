import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-field-error',
  imports: [],
  template: `
    @let state = fieldRef()();
    @if (state.touched() && state.errors().length) {
      <ul>
        @for (error of state.errors(); track $index) {
          <li class="text-red-400 text-xs">{{ error.message }}</li>
        }
      </ul>
    }
    <input />
  `,
  styles: [],
  host: {
    '[style.display]': "fieldRef()().touched() && fieldRef()().errors().length ? 'block' : 'none'",
  },
})
export class FieldError<T> {
  fieldRef = input.required<FieldTree<T>>();
}
