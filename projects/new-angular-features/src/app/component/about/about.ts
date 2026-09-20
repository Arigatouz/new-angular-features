import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { pattern } from '@angular/forms/signals';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  nnfb = inject(NonNullableFormBuilder);

  form = this.nnfb.group({
    whatEver: this.nnfb.control('', {validators:Validators.pattern(/^[a-zA-Z]+$/)})
  })
}
