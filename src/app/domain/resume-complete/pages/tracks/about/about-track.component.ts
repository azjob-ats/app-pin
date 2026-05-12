import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';

const MAX_LENGTH = 600;
const MIN_LENGTH_TO_COMPLETE = 50;

@Component({
  selector: 'app-about-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, TextareaComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      <div class="exp-track__form">
        <app-textarea
          label="Sobre você"
          placeholder="Conte em poucas linhas o que move você profissionalmente."
          [hint]="hint()"
          [rows]="6"
          [maxlength]="maxLength"
          [ngModel]="text()"
          (ngModelChange)="text.set($event)"
        />
      </div>

      <footer class="track-form-footer">
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class AboutTrackComponent {
  readonly initialText = input.required<string>();
  readonly save = output<{ about: string }>();

  protected readonly maxLength = MAX_LENGTH;
  protected readonly text = signal<string>('');

  protected readonly hint = computed(
    () =>
      `${this.text().length}/${MAX_LENGTH} — mínimo ${MIN_LENGTH_TO_COMPLETE} caracteres para concluir`,
  );

  private hasInit = false;

  constructor() {
    effect(() => {
      const initial = this.initialText();
      if (this.hasInit) return;
      this.text.set(initial ?? '');
      this.hasInit = true;
    });
  }

  protected readonly isDirty = computed(() => this.text() !== this.initialText());

  protected emitSave(): void {
    this.save.emit({ about: this.text() });
  }
}
