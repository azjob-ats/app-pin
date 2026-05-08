import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output, signal } from '@angular/core';

const MAX_LENGTH = 600;

@Component({
  selector: 'app-about-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="about-track">
      <p class="about-track__hint">Conte em poucas linhas o que move você profissionalmente. Mínimo 50 caracteres para concluir.</p>
      <textarea
        class="about-track__textarea"
        [value]="text()"
        (input)="onInput($event)"
        rows="6"
        [attr.maxlength]="maxLength"
        aria-label="Sobre você"
      ></textarea>
      <div class="about-track__count" [class.is-warning]="text().length < 50">
        {{ text().length }}/{{ maxLength }}
      </div>
      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ statusLabel() }}</span>
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
  styleUrl: './about-track.component.scss',
})
export class AboutTrackComponent {
  readonly initialText = input<string>('');
  readonly save = output<{ about: string }>();

  protected readonly maxLength = MAX_LENGTH;
  protected readonly text = signal<string>('');
  private hasInit = false;

  constructor() {
    queueMicrotask(() => {
      if (!this.hasInit) {
        this.text.set(this.initialText() || '');
        this.hasInit = true;
      }
    });
  }

  protected readonly isDirty = computed(() => this.text() !== this.initialText());

  protected readonly statusLabel = computed(() => {
    if (this.text().length === 0) return 'Vazio';
    if (this.text().length < 50) return 'Falta para concluir';
    return 'Pronto para concluir';
  });

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.text.set(target.value);
  }

  protected emitSave(): void {
    this.save.emit({ about: this.text() });
  }
}
