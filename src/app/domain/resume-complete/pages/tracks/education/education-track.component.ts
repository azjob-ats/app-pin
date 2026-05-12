import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ChipItem, ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InputComponent } from '@shared/components/input/input.component';
import { Education } from '@shared/interfaces/entity/creator-portfolio';

interface DraftEdu {
  institutionName: string;
  course: string;
  startDate: string;
  endDate: string;
}

const EMPTY: DraftEdu = { institutionName: '', course: '', startDate: '', endDate: '' };

function toMonthInput(date: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

@Component({
  selector: 'app-education-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ButtonComponent, ChipScrollComponent, InputComponent],
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
            label="Instituição"
            [ngModel]="draft().institutionName"
            (ngModelChange)="patch({ institutionName: $event })"
          />
          <app-input
            label="Curso"
            [ngModel]="draft().course"
            (ngModelChange)="patch({ course: $event })"
          />
        </div>

        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Início</span>
            <input type="month" [value]="draft().startDate" (input)="patch({ startDate: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>Fim (opcional)</span>
            <input type="month" [value]="draft().endDate" (input)="patch({ endDate: $any($event.target).value })" />
          </label>
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
              ariaLabel="Excluir formação"
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
export class EducationTrackComponent {
  readonly initial = input.required<Education[]>();
  readonly save = output<{ educations: Education[] }>();

  protected readonly items = signal<Education[]>([]);
  protected readonly draft = signal<DraftEdu>({ ...EMPTY });
  protected readonly editingId = signal<string | null>(null);

  protected readonly chips = computed<ChipItem[]>(() =>
    this.items().map((e) => ({ key: e.id, labelKey: e.institutionName })),
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

  protected readonly canAdd = computed(
    () => !!this.draft().institutionName.trim() && !!this.draft().course.trim() && !!this.draft().startDate,
  );

  protected readonly isDirty = computed(
    () => JSON.stringify(this.items()) !== JSON.stringify(this.initial()),
  );

  protected patch(p: Partial<DraftEdu>): void {
    this.draft.update((d) => ({ ...d, ...p }));
  }

  protected addItem(): void {
    if (!this.canAdd()) return;
    const d = this.draft();
    const editing = this.editingId();
    const id = editing ?? `edu-${Date.now()}`;
    const item: Education = {
      id,
      institutionName: d.institutionName.trim(),
      institutionLogoUrl: null,
      course: d.course.trim(),
      startDate: new Date(`${d.startDate}-01`),
      endDate: d.endDate ? new Date(`${d.endDate}-01`) : null,
    };

    if (editing) {
      this.items.update((list) => list.map((e) => (e.id === editing ? item : e)));
    } else {
      this.items.update((list) => [...list, item]);
    }

    this.cancelEdit();
  }

  protected onChipSelect(id: string): void {
    const item = this.items().find((e) => e.id === id);
    if (!item) return;
    this.draft.set({
      institutionName: item.institutionName,
      course: item.course,
      startDate: toMonthInput(item.startDate),
      endDate: toMonthInput(item.endDate),
    });
    this.editingId.set(id);
  }

  protected cancelEdit(): void {
    this.draft.set({ ...EMPTY });
    this.editingId.set(null);
  }

  protected removeCurrent(): void {
    const editing = this.editingId();
    if (!editing) return;
    this.items.update((list) => list.filter((e) => e.id !== editing));
    this.cancelEdit();
  }

  protected emitSave(): void {
    this.save.emit({ educations: this.items() });
  }
}
