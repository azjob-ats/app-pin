import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCheckComponent } from '@shared/components/app-check/app-check.component';
import { ChipItem, ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';

const PRONOUN_OPTIONS = ['ele/dele', 'ela/dela', 'elu/delu', 'eles/delas', 'prefiro não informar'];

@Component({
  selector: 'app-pronoun-pcd-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, AppCheckComponent, ChipScrollComponent, TextareaComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      <div class="exp-track__form">
        <app-chip-scroll
          [chips]="pronounChips"
          [selected]="pronoun() ?? ''"
          (chipSelect)="onPronounSelect($event)"
        />

        <label class="exp-track__check">
          <app-check
            [checked]="isPcd()"
            ariaLabel="Sou PCD"
            (checkedChange)="isPcd.set($event)"
          />
          Sou PCD (Pessoa com Deficiência)
        </label>

        @if (isPcd()) {
          <app-textarea
            label="Observações (opcional)"
            placeholder="Ex.: deficiência visual parcial, uso leitor de tela."
            [rows]="3"
            [ngModel]="pcdNotes()"
            (ngModelChange)="pcdNotes.set($event)"
          />
        }
      </div>

      <footer class="track-form-footer">
        <button type="button" class="track-form-footer__save" [disabled]="!isDirty()" (click)="emitSave()">
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class PronounPcdTrackComponent {
  readonly initialPronoun = input.required<string | null>();
  readonly initialIsPcd = input.required<boolean>();
  readonly initialPcdNotes = input.required<string | null>();

  readonly save = output<{ pronoun: string | null; isPcd: boolean; pcdNotes: string | null }>();

  protected readonly pronounChips: ChipItem[] = PRONOUN_OPTIONS.map((p) => ({
    key: p,
    labelKey: p,
  }));

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

  protected onPronounSelect(value: string): void {
    this.pronoun.set(this.pronoun() === value ? null : value);
  }

  protected emitSave(): void {
    const notes = this.pcdNotes().trim();
    this.save.emit({
      pronoun: this.pronoun(),
      isPcd: this.isPcd(),
      pcdNotes: notes === '' ? null : notes,
    });
  }
}
