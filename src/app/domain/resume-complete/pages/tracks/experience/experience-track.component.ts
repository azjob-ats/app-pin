import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCheckComponent } from '@shared/components/app-check/app-check.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ChipItem, ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent, SelectOption } from '@shared/components/select/select.component';
import { EmploymentType } from '@shared/enums/employment-type.enum';
import { WorkMode } from '@shared/enums/work-mode.enum';
import { Experience } from '@shared/interfaces/entity/creator-portfolio';

function toMonthInput(date: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const EMPLOYMENT_OPTIONS: SelectOption[] = [
  { value: EmploymentType.FullTime, label: 'Tempo integral' },
  { value: EmploymentType.PartTime, label: 'Meio período' },
  { value: EmploymentType.Internship, label: 'Estágio' },
  { value: EmploymentType.Freelance, label: 'Freelance' },
  { value: EmploymentType.Contract, label: 'Contrato' },
  { value: EmploymentType.Temporary, label: 'Temporário' },
  { value: EmploymentType.Volunteer, label: 'Voluntário' },
];

const WORK_MODE_OPTIONS: SelectOption[] = [
  { value: WorkMode.Remote, label: 'Remoto' },
  { value: WorkMode.Hybrid, label: 'Híbrido' },
  { value: WorkMode.OnSite, label: 'Presencial' },
];

interface DraftExp {
  role: string;
  companyName: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

const EMPTY_DRAFT: DraftExp = {
  role: '',
  companyName: '',
  employmentType: EmploymentType.FullTime,
  workMode: WorkMode.Remote,
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

@Component({
  selector: 'app-experience-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    AppCheckComponent,
    ButtonComponent,
    ChipScrollComponent,
    InputComponent,
    SelectComponent,
  ],
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
            label="Cargo"
            [ngModel]="draft().role"
            (ngModelChange)="patch({ role: $event })"
          />
          <app-input
            label="Empresa"
            [ngModel]="draft().companyName"
            (ngModelChange)="patch({ companyName: $event })"
          />
        </div>

        <div class="exp-track__row">
          <app-select
            label="Modalidade"
            [options]="employmentOptions"
            [ngModel]="draft().employmentType"
            (ngModelChange)="onEmploymentChange($event)"
          />
          <app-select
            label="Modelo"
            [options]="modeOptions"
            [ngModel]="draft().workMode"
            (ngModelChange)="onModeChange($event)"
          />
        </div>

        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Início</span>
            <input type="month" [value]="draft().startDate" (input)="patch({ startDate: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>Fim</span>
            <input
              type="month"
              [value]="draft().endDate"
              [disabled]="draft().isCurrent"
              (input)="patch({ endDate: $any($event.target).value })"
            />
          </label>
        </div>

        <label class="exp-track__check">
          <app-check
            [checked]="draft().isCurrent"
            ariaLabel="Trabalho atual"
            (checkedChange)="patch({ isCurrent: $event })"
          />
          Trabalho atual
        </label>

        <app-input
          label="Localização (opcional)"
          [ngModel]="draft().location"
          (ngModelChange)="patch({ location: $event })"
        />

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
              ariaLabel="Excluir experiência"
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
  styleUrls: ['./experience-track.component.scss', '../track-form-footer.shared.scss'],
})
export class ExperienceTrackComponent {
  readonly initial = input.required<Experience[]>();
  readonly save = output<{ experiences: Experience[] }>();

  protected readonly employmentOptions = EMPLOYMENT_OPTIONS;
  protected readonly modeOptions = WORK_MODE_OPTIONS;

  protected readonly items = signal<Experience[]>([]);
  protected readonly draft = signal<DraftExp>({ ...EMPTY_DRAFT });
  protected readonly editingId = signal<string | null>(null);

  protected readonly chips = computed<ChipItem[]>(() =>
    this.items().map((e) => ({
      key: e.id,
      labelKey: e.companyName,
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

  protected readonly canAdd = computed(
    () => !!this.draft().role.trim() && !!this.draft().companyName.trim() && !!this.draft().startDate,
  );

  protected readonly isDirty = computed(
    () => JSON.stringify(this.items()) !== JSON.stringify(this.initial()),
  );

  protected patch(p: Partial<DraftExp>): void {
    this.draft.update((d) => ({ ...d, ...p }));
  }

  protected onEmploymentChange(value: string): void {
    this.patch({ employmentType: value as EmploymentType });
  }

  protected onModeChange(value: string): void {
    this.patch({ workMode: value as WorkMode });
  }

  protected addItem(): void {
    if (!this.canAdd()) return;
    const d = this.draft();
    const editing = this.editingId();
    const id = editing ?? `exp-${Date.now()}`;
    const item: Experience = {
      id,
      role: d.role.trim(),
      companyName: d.companyName.trim(),
      companyLogoUrl: null,
      employmentType: d.employmentType,
      workMode: d.workMode,
      location: d.location.trim() || null,
      startDate: new Date(`${d.startDate}-01`),
      endDate: d.isCurrent || !d.endDate ? null : new Date(`${d.endDate}-01`),
      isCurrent: d.isCurrent,
      description: d.description.trim() || null,
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
      role: item.role,
      companyName: item.companyName,
      employmentType: item.employmentType,
      workMode: item.workMode,
      location: item.location ?? '',
      startDate: toMonthInput(item.startDate),
      endDate: toMonthInput(item.endDate),
      isCurrent: item.isCurrent,
      description: item.description ?? '',
    });
    this.editingId.set(id);
  }

  protected cancelEdit(): void {
    this.draft.set({ ...EMPTY_DRAFT });
    this.editingId.set(null);
  }

  protected removeCurrent(): void {
    const editing = this.editingId();
    if (!editing) return;
    this.items.update((list) => list.filter((e) => e.id !== editing));
    this.cancelEdit();
  }

  protected emitSave(): void {
    this.save.emit({ experiences: this.items() });
  }
}
