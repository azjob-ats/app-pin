import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { MetricsPeriod } from '@shared/enums/metrics-period.enum';

interface PeriodOption {
  value: MetricsPeriod;
  label: string;
}

const OPTIONS: PeriodOption[] = [
  { value: MetricsPeriod.Last7Days, label: '7 dias' },
  { value: MetricsPeriod.Last30Days, label: '30 dias' },
  { value: MetricsPeriod.Last90Days, label: '90 dias' },
  { value: MetricsPeriod.AllTime, label: 'Tudo' },
];

@Component({
  selector: 'app-metrics-period-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="metrics-period" role="group" aria-label="Filtrar por período">
      @for (option of options; track option.value) {
        <button
          type="button"
          class="metrics-period__chip"
          [class.is-selected]="option.value === selected()"
          [attr.aria-pressed]="option.value === selected()"
          (click)="periodChange.emit(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styleUrl: './metrics-period-filter.component.scss',
})
export class MetricsPeriodFilterComponent {
  readonly selected = input.required<MetricsPeriod>();
  readonly periodChange = output<MetricsPeriod>();

  readonly options = OPTIONS;
}
