import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output, signal } from '@angular/core';
import { LanguageProficiency } from '@shared/enums/language-proficiency.enum';
import { Language } from '@shared/interfaces/entity/creator-portfolio';

const PROFICIENCY_OPTIONS: { value: LanguageProficiency; label: string }[] = [
  { value: LanguageProficiency.Basic, label: 'Básico' },
  { value: LanguageProficiency.Intermediate, label: 'Intermediário' },
  { value: LanguageProficiency.Advanced, label: 'Avançado' },
  { value: LanguageProficiency.Fluent, label: 'Fluente' },
  { value: LanguageProficiency.Native, label: 'Nativo' },
];

@Component({
  selector: 'app-languages-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="languages-track">
      <p class="languages-track__hint">Adicione 2 ou mais idiomas para concluir.</p>

      <ul class="languages-track__list" role="list">
        @for (lang of languages(); track lang.id) {
          <li class="languages-track__item">
            <span class="languages-track__name">{{ lang.name }}</span>
            <span class="languages-track__level">{{ levelLabel(lang.proficiency) }}</span>
            <button type="button" class="languages-track__remove" (click)="remove(lang.id)" aria-label="Remover">
              <span class="material-symbols-rounded icon-sm" aria-hidden="true">close</span>
            </button>
          </li>
        }
      </ul>

      <div class="languages-track__add">
        <input
          type="text"
          class="languages-track__input"
          placeholder="Idioma (ex.: Inglês)"
          [value]="draftName()"
          (input)="draftName.set($any($event.target).value)"
          aria-label="Nome do idioma"
        />
        <select
          class="languages-track__select"
          [value]="draftLevel()"
          (change)="onLevelChange($event)"
          aria-label="Nível"
        >
          @for (opt of options; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>
        <button type="button" class="languages-track__add-btn" (click)="add()" [disabled]="!draftName().trim()">
          Adicionar
        </button>
      </div>

      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ languages().length }} idiomas</span>
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
  styleUrl: './languages-track.component.scss',
})
export class LanguagesTrackComponent {
  readonly initial = input<Language[]>([]);
  readonly save = output<{ languages: Language[] }>();

  protected readonly options = PROFICIENCY_OPTIONS;
  protected readonly languages = signal<Language[]>([]);
  protected readonly draftName = signal<string>('');
  protected readonly draftLevel = signal<LanguageProficiency>(LanguageProficiency.Intermediate);

  private hasInit = false;

  constructor() {
    queueMicrotask(() => {
      if (!this.hasInit) {
        this.languages.set([...this.initial()]);
        this.hasInit = true;
      }
    });
  }

  protected readonly isDirty = computed(
    () => JSON.stringify(this.languages()) !== JSON.stringify(this.initial()),
  );

  protected onLevelChange(event: Event): void {
    const v = (event.target as HTMLSelectElement).value as LanguageProficiency;
    this.draftLevel.set(v);
  }

  protected levelLabel(level: LanguageProficiency): string {
    return PROFICIENCY_OPTIONS.find((o) => o.value === level)?.label ?? level;
  }

  protected add(): void {
    const name = this.draftName().trim();
    if (!name) return;
    const id = `lan-${Date.now()}`;
    this.languages.update((list) => [...list, { id, name, proficiency: this.draftLevel() }]);
    this.draftName.set('');
    this.draftLevel.set(LanguageProficiency.Intermediate);
  }

  protected remove(id: string): void {
    this.languages.update((list) => list.filter((l) => l.id !== id));
  }

  protected emitSave(): void {
    this.save.emit({ languages: this.languages() });
  }
}
