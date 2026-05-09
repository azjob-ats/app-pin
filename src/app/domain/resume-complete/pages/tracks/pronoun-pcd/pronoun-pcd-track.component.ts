import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';

const PRONOUN_OPTIONS = ['ele/dele', 'ela/dela', 'elu/delu', 'eles/delas', 'prefiro não informar'];

@Component({
  selector: 'app-pronoun-pcd-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form class="pronoun-track" (submit)="$event.preventDefault(); emitSave()">
      <fieldset class="pronoun-track__fieldset">
        <legend class="pronoun-track__legend">Pronome</legend>
        <div class="pronoun-track__chips" role="radiogroup" aria-label="Pronome">
          @for (option of options; track option) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="pronoun() === option"
              class="pronoun-track__chip"
              [class.is-selected]="pronoun() === option"
              (click)="pronoun.set(option)"
            >
              {{ option }}
            </button>
          }
        </div>
      </fieldset>

      <label class="pronoun-track__check">
        <input type="checkbox" [checked]="isPcd()" (change)="isPcd.set($any($event.target).checked)" />
        Sou PCD (Pessoa com Deficiência)
      </label>

      @if (isPcd()) {
        <label class="pronoun-track__field">
          <span class="pronoun-track__label">Observações (opcional)</span>
          <textarea
            rows="3"
            [value]="pcdNotes()"
            (input)="pcdNotes.set($any($event.target).value)"
            placeholder="Ex.: deficiência visual parcial, uso leitor de tela."
          ></textarea>
        </label>
      }

      <footer class="track-form-footer">
        <span class="track-form-footer__count">
          @if (pronoun()) { Pronome: {{ pronoun() }} } @else { Sem pronome selecionado }
        </span>
        <button type="submit" class="track-form-footer__save" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </form>
  `,
  styleUrl: './pronoun-pcd-track.component.scss',
})
export class PronounPcdTrackComponent {
  readonly initialPronoun = input.required<string | null>();
  readonly initialIsPcd = input.required<boolean>();
  readonly initialPcdNotes = input.required<string | null>();

  readonly save = output<{ pronoun: string | null; isPcd: boolean; pcdNotes: string | null }>();

  protected readonly options = PRONOUN_OPTIONS;
  protected readonly pronoun = signal<string | null>(null);
  protected readonly isPcd = signal<boolean>(false);
  protected readonly pcdNotes = signal<string>('');

  private hasInit = false;

  constructor() {
    effect(() => {
      const pronoun = this.initialPronoun();
      const isPcd = this.initialIsPcd();
      const notes = this.initialPcdNotes();
      if (this.hasInit) return;
      this.pronoun.set(pronoun);
      this.isPcd.set(isPcd);
      this.pcdNotes.set(notes ?? '');
      this.hasInit = true;
    });
  }

  protected readonly isDirty = computed(
    () =>
      this.pronoun() !== this.initialPronoun() ||
      this.isPcd() !== this.initialIsPcd() ||
      (this.pcdNotes() || '') !== (this.initialPcdNotes() ?? ''),
  );

  protected emitSave(): void {
    const notes = this.pcdNotes().trim();
    this.save.emit({
      pronoun: this.pronoun(),
      isPcd: this.isPcd(),
      pcdNotes: notes === '' ? null : notes,
    });
  }
}
