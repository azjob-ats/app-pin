import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ChipItem, ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent, SelectOption } from '@shared/components/select/select.component';
import { LanguageProficiency } from '@shared/enums/language-proficiency.enum';
import { Language } from '@shared/interfaces/entity/creator-portfolio';

const PROFICIENCY_OPTIONS: SelectOption[] = [
  { value: LanguageProficiency.Basic, label: 'Básico' },
  { value: LanguageProficiency.Intermediate, label: 'Intermediário' },
  { value: LanguageProficiency.Advanced, label: 'Avançado' },
  { value: LanguageProficiency.Fluent, label: 'Fluente' },
  { value: LanguageProficiency.Native, label: 'Nativo' },
];

interface DraftLang {
  name: string;
  proficiency: LanguageProficiency;
}

const EMPTY: DraftLang = {
  name: '',
  proficiency: LanguageProficiency.Intermediate,
};

@Component({
  selector: 'app-languages-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ButtonComponent, ChipScrollComponent, InputComponent, SelectComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      @if (chips().length > 0) {
        <app-chip-scroll
          [chips]="chips()"
          [selected]="editingId() ?? ''"
          (chipSelect)="onChipSelect($event)"
        />
      }

      <div class="exp-track__form">
        <div class="exp-track__row">
          <app-input
            label="Idioma"
            [ngModel]="draft().name"
            (ngModelChange)="patch({ name: $event })"
          />
          <app-select
            label="Nível"
            [options]="proficiencyOptions"
            [ngModel]="draft().proficiency"
            (ngModelChange)="onProficiencyChange($event)"
          />
        </div>

        <div class="exp-track__form-actions">
          <app-button
            variant="secondary"
            size="sm"
            [disabled]="!canAdd()"
            (clicked)="addItem()"
          >
            {{ isEditing() ? 'Atualizar' : 'Adicionar à lista' }}
          </app-button>

          @if (isEditing()) {
            <app-button
              variant="secondary"
              size="sm"
              (clicked)="cancelEdit()"
            >
              Cancelar
            </app-button>

            <app-button
              variant="secondary"
              size="sm"
              ariaLabel="Excluir idioma"
              (clicked)="removeCurrent()"
            >
              Excluir
            </app-button>
          }
        </div>
      </div>

      <footer class="track-form-footer">
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class LanguagesTrackComponent {
  readonly initial = input.required<Language[]>();
  readonly save = output<{ languages: Language[] }>();

  protected readonly proficiencyOptions = PROFICIENCY_OPTIONS;
  protected readonly items = signal<Language[]>([]);
  protected readonly draft = signal<DraftLang>({ ...EMPTY });
  protected readonly editingId = signal<string | null>(null);

  protected readonly chips = computed<ChipItem[]>(() =>
    this.items().map((l) => ({
      key: l.id,
      labelKey: `${l.name} — ${this.levelLabel(l.proficiency)}`,
    })),
  );

  protected readonly isEditing = computed(() => this.editingId() !== null);

  private hasInit = false;

  constructor() {
    effect(() => {
      const initial = this.initial();
      if (this.hasInit) return;
      this.items.set([...initial]);
      this.hasInit = true;
    });
  }

  protected readonly canAdd = computed(() => !!this.draft().name.trim());

  protected readonly isDirty = computed(
    () => JSON.stringify(this.items()) !== JSON.stringify(this.initial()),
  );

  protected patch(p: Partial<DraftLang>): void {
    this.draft.update((d) => ({ ...d, ...p }));
  }

  protected onProficiencyChange(value: string): void {
    this.patch({ proficiency: value as LanguageProficiency });
  }

  protected levelLabel(level: LanguageProficiency): string {
    return PROFICIENCY_OPTIONS.find((o) => o.value === level)?.label ?? level;
  }

  protected addItem(): void {
    if (!this.canAdd()) return;
    const d = this.draft();
    const editing = this.editingId();
    const id = editing ?? `lan-${Date.now()}`;
    const item: Language = { id, name: d.name.trim(), proficiency: d.proficiency };

    if (editing) {
      this.items.update((list) => list.map((l) => (l.id === editing ? item : l)));
    } else {
      this.items.update((list) => [...list, item]);
    }

    this.cancelEdit();
  }

  protected onChipSelect(id: string): void {
    const item = this.items().find((l) => l.id === id);
    if (!item) return;
    this.draft.set({ name: item.name, proficiency: item.proficiency });
    this.editingId.set(id);
  }

  protected cancelEdit(): void {
    this.draft.set({ ...EMPTY });
    this.editingId.set(null);
  }

  protected removeCurrent(): void {
    const editing = this.editingId();
    if (!editing) return;
    this.items.update((list) => list.filter((l) => l.id !== editing));
    this.cancelEdit();
  }

  protected emitSave(): void {
    this.save.emit({ languages: this.items() });
  }
}
