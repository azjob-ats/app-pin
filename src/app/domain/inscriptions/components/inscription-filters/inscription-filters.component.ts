import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
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

export type InscriptionFiltersMode = 'all' | 'bar' | 'status';
export type InscriptionFiltersTone = 'light' | 'dark';

@Component({
  selector: 'app-inscription-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="inscription-filters"
      [class.is-dark]="tone() === 'dark'"
      [class.is-bar-only]="mode() === 'bar'"
      [class.is-status-only]="mode() === 'status'"
    >
      @if (showBar()) {
        <div class="inscription-filters__bar">
          <div class="inscription-filters__row" role="group" aria-label="Filtrar por tipo">
            <button
              type="button"
              class="inscription-filters__chip"
              [class.is-selected]="selectedType() === null"
              [attr.aria-pressed]="selectedType() === null"
              (click)="onResetType()"
            >
              Todos
            </button>
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

          @if (showClear()) {
            <button
              type="button"
              class="inscription-filters__clear"
              (click)="clear.emit()"
              aria-label="Limpar todos os filtros"
            >
              Limpar
              <span aria-hidden="true">×</span>
            </button>
          }
        </div>
      }

      @if (showStatus()) {
        <div
          class="inscription-filters__row inscription-filters__row--status"
          role="group"
          aria-label="Filtrar por status"
        >
          <button
            type="button"
            class="inscription-filters__pill"
            [class.is-selected]="selectedStatus() === null"
            [attr.aria-pressed]="selectedStatus() === null"
            (click)="onResetStatus()"
          >
            Todos os status
          </button>
          @for (option of statusOptions; track option.value) {
            <button
              type="button"
              class="inscription-filters__pill"
              [class.is-selected]="option.value === selectedStatus()"
              [attr.aria-pressed]="option.value === selectedStatus()"
              (click)="onToggleStatus(option.value)"
            >
              <span
                class="inscription-filters__pill-dot"
                [class]="'status-' + option.value"
                aria-hidden="true"
              ></span>
              {{ option.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './inscription-filters.component.scss',
})
export class InscriptionFiltersComponent {
  readonly selectedType = input<InscriptionType | null>(null);
  readonly selectedStatus = input<InscriptionStatus | null>(null);
  readonly mode = input<InscriptionFiltersMode>('all');
  readonly tone = input<InscriptionFiltersTone>('light');

  readonly typeChange = output<InscriptionType | null>();
  readonly statusChange = output<InscriptionStatus | null>();
  readonly clear = output<void>();

  readonly typeOptions = TYPE_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;

  readonly showBar = computed(() => this.mode() !== 'status');
  readonly showStatus = computed(() => this.mode() !== 'bar');
  readonly showClear = computed(
    () => this.selectedType() !== null || this.selectedStatus() !== null,
  );

  onToggleType(value: InscriptionType): void {
    this.typeChange.emit(this.selectedType() === value ? null : value);
  }

  onToggleStatus(value: InscriptionStatus): void {
    this.statusChange.emit(this.selectedStatus() === value ? null : value);
  }

  onResetType(): void {
    if (this.selectedType() !== null) {
      this.typeChange.emit(null);
    }
  }

  onResetStatus(): void {
    if (this.selectedStatus() !== null) {
      this.statusChange.emit(null);
    }
  }
}
