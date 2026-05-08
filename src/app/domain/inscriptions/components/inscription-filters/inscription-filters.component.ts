import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { InscriptionStatus } from '@shared/enums/inscription-status.enum';
import { InscriptionType } from '@shared/enums/inscription-type.enum';

interface ChipOption<T> {
  value: T;
  label: string;
}

const TYPE_OPTIONS: ChipOption<InscriptionType>[] = [
  { value: InscriptionType.Job, label: 'Vagas' },
  { value: InscriptionType.Training, label: 'Treinamentos' },
  { value: InscriptionType.Product, label: 'Produtos' },
  { value: InscriptionType.Event, label: 'Eventos' },
  { value: InscriptionType.Scheduling, label: 'Agendamentos' },
  { value: InscriptionType.Contact, label: 'Contatos' },
];

const STATUS_OPTIONS: ChipOption<InscriptionStatus>[] = [
  { value: InscriptionStatus.Sent, label: 'Enviadas' },
  { value: InscriptionStatus.InReview, label: 'Em análise' },
  { value: InscriptionStatus.Approved, label: 'Aprovadas' },
  { value: InscriptionStatus.Rejected, label: 'Recusadas' },
  { value: InscriptionStatus.Cancelled, label: 'Canceladas' },
  { value: InscriptionStatus.Expired, label: 'Expiradas' },
];

@Component({
  selector: 'app-inscription-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="inscription-filters">
      <div class="inscription-filters__group" role="group" aria-label="Filtrar por tipo">
        <span class="inscription-filters__label">Tipo</span>
        <div class="inscription-filters__chips">
          @for (option of typeOptions; track option.value) {
            <button
              type="button"
              class="inscription-filters__chip"
              [class.is-selected]="option.value === selectedType()"
              [attr.aria-pressed]="option.value === selectedType()"
              (click)="onToggleType(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>
      </div>

      <div class="inscription-filters__group" role="group" aria-label="Filtrar por status">
        <span class="inscription-filters__label">Status</span>
        <div class="inscription-filters__chips">
          @for (option of statusOptions; track option.value) {
            <button
              type="button"
              class="inscription-filters__chip"
              [class.is-selected]="option.value === selectedStatus()"
              [attr.aria-pressed]="option.value === selectedStatus()"
              (click)="onToggleStatus(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>
      </div>

      @if (showClear()) {
        <button
          type="button"
          class="inscription-filters__clear"
          (click)="clear.emit()"
          aria-label="Limpar todos os filtros"
        >
          <span class="material-symbols-rounded icon-sm" aria-hidden="true">close</span>
          Limpar filtros
        </button>
      }
    </div>
  `,
  styleUrl: './inscription-filters.component.scss',
})
export class InscriptionFiltersComponent {
  readonly selectedType = input<InscriptionType | null>(null);
  readonly selectedStatus = input<InscriptionStatus | null>(null);

  readonly typeChange = output<InscriptionType | null>();
  readonly statusChange = output<InscriptionStatus | null>();
  readonly clear = output<void>();

  readonly typeOptions = TYPE_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;

  readonly showClear = computed(() => this.selectedType() !== null || this.selectedStatus() !== null);

  onToggleType(value: InscriptionType): void {
    this.typeChange.emit(this.selectedType() === value ? null : value);
  }

  onToggleStatus(value: InscriptionStatus): void {
    this.statusChange.emit(this.selectedStatus() === value ? null : value);
  }
}
