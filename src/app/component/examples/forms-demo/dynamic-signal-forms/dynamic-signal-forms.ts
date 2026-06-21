import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  applyEach,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

interface SkillEntry {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

@Component({
  selector: 'app-dynamic-signal-forms',
  imports: [FormRoot, FormField, JsonPipe],
  templateUrl: './dynamic-signal-forms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicSignalForms {
  readonly submitted = signal(false);

  readonly #skills = signal<SkillEntry[]>([{ name: '', level: 'beginner' }]);

  readonly skillsForm = form(
    this.#skills,
    (s) => {
      applyEach(s, (item) => {
        required(item.name, { message: 'Skill name is required' });
        minLength(item.name, 2, { message: 'At least 2 characters' });
      });
    },
    {
      submission: {
        action: async () => {
          this.submitted.set(true);
          setTimeout(() => this.submitted.set(false), 3000);
        },
      },
    },
  );

  protected readonly skillCount = computed(() => this.#skills().length);
  protected readonly canAdd = computed(() => this.#skills().length < 8);

  addSkill(): void {
    this.#skills.update((s) => [...s, { name: '', level: 'beginner' }]);
  }

  removeSkill(index: number): void {
    this.#skills.update((s) => s.filter((_, i) => i !== index));
  }
}
