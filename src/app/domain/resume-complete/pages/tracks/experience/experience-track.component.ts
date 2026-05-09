import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { EmploymentType } from '@shared/enums/employment-type.enum';
import { WorkMode } from '@shared/enums/work-mode.enum';
import { Experience } from '@shared/interfaces/entity/creator-portfolio';

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: EmploymentType.FullTime, label: 'Tempo integral' },
  { value: EmploymentType.PartTime, label: 'Meio período' },
  { value: EmploymentType.Internship, label: 'Estágio' },
  { value: EmploymentType.Freelance, label: 'Freelance' },
  { value: EmploymentType.Contract, label: 'Contrato' },
  { value: EmploymentType.Temporary, label: 'Temporário' },
  { value: EmploymentType.Volunteer, label: 'Voluntário' },
];

const WORK_MODE_OPTIONS: { value: WorkMode; label: string }[] = [
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
  template: `
    <div class="exp-track">
      @if (items().length > 0) {
        <ul class="exp-track__list" role="list">
          @for (item of items(); track item.id) {
            <li class="exp-track__item">
              <div>
                <strong>{{ item.role }}</strong> · {{ item.companyName }}
              </div>
              <button type="button" class="exp-track__remove" (click)="remove(item.id)" aria-label="Remover">
                <span class="material-symbols-rounded icon-sm" aria-hidden="true">delete</span>
              </button>
            </li>
          }
        </ul>
      }

      <fieldset class="exp-track__form">
        <legend>Adicionar experiência</legend>
        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Cargo</span>
            <input type="text" [value]="draft().role" (input)="patch({ role: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>Empresa</span>
            <input type="text" [value]="draft().companyName" (input)="patch({ companyName: $any($event.target).value })" />
          </label>
        </div>
        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Modalidade</span>
            <select [value]="draft().employmentType" (change)="onEmploymentChange($event)">
              @for (opt of employmentOptions; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </label>
          <label class="exp-track__field">
            <span>Modelo</span>
            <select [value]="draft().workMode" (change)="onModeChange($event)">
              @for (opt of modeOptions; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </label>
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
          <input
            type="checkbox"
            [checked]="draft().isCurrent"
            (change)="patch({ isCurrent: $any($event.target).checked })"
          />
          Trabalho atual
        </label>
        <label class="exp-track__field">
          <span>Localização (opcional)</span>
          <input type="text" [value]="draft().location" (input)="patch({ location: $any($event.target).value })" />
        </label>
        <button type="button" class="exp-track__add-btn" (click)="addItem()" [disabled]="!canAdd()">
          Adicionar à lista
        </button>
      </fieldset>

      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ items().length }} experiência(s)</span>
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
  styleUrl: './experience-track.component.scss',
})
export class ExperienceTrackComponent {
  readonly initial = input.required<Experience[]>();
  readonly save = output<{ experiences: Experience[] }>();

  protected readonly employmentOptions = EMPLOYMENT_OPTIONS;
  protected readonly modeOptions = WORK_MODE_OPTIONS;

  protected readonly items = signal<Experience[]>([]);
  protected readonly draft = signal<DraftExp>({ ...EMPTY_DRAFT });

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

  protected onEmploymentChange(event: Event): void {
    this.patch({ employmentType: (event.target as HTMLSelectElement).value as EmploymentType });
  }

  protected onModeChange(event: Event): void {
    this.patch({ workMode: (event.target as HTMLSelectElement).value as WorkMode });
  }

  protected addItem(): void {
    if (!this.canAdd()) return;
    const d = this.draft();
    const item: Experience = {
      id: `exp-${Date.now()}`,
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
    this.items.update((list) => [...list, item]);
    this.draft.set({ ...EMPTY_DRAFT });
  }

  protected remove(id: string): void {
    this.items.update((list) => list.filter((e) => e.id !== id));
  }

  protected emitSave(): void {
    this.save.emit({ experiences: this.items() });
  }
}
