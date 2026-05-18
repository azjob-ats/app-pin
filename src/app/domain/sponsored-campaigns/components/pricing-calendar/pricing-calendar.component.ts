import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { HourAvailability } from '@shared/enums/hour-availability.enum';
import { PricingCalendar } from '@shared/interfaces/entity/campaign';

interface HourCellView {
  hour: number;
  price: number;
  status: HourAvailability;
  band: 'low' | 'medium' | 'high';
  selected: boolean;
  clickable: boolean;
}

interface DayRowView {
  dateIso: string; // ISO datetime
  dateKey: string; // yyyy-mm-dd
  date: Date;
  totalPrice: number;
  selectedCount: number;
  hours: HourCellView[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function bandForPrice(price: number, low: number, high: number): 'low' | 'medium' | 'high' {
  if (price <= low) return 'low';
  if (price >= high) return 'high';
  return 'medium';
}

@Component({
  selector: 'app-pricing-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, DecimalPipe, CurrencyPipe],
  template: `
    <div class="pricing-calendar">
      <header class="pricing-calendar__head">
        <div class="pricing-calendar__head-cell pricing-calendar__head-cell--date">Dia</div>
        <div class="pricing-calendar__head-hours" aria-hidden="true">
          @for (hour of headerHours; track hour) {
            <span class="pricing-calendar__head-hour">{{ hour }}h</span>
          }
        </div>
      </header>

      <div class="pricing-calendar__body" role="grid" aria-label="Preço por dia e hora">
        @for (row of rows(); track row.dateIso) {
          <div class="pricing-calendar__row" role="row">
            <button
              type="button"
              class="pricing-calendar__date-cell"
              role="rowheader"
              [attr.aria-label]="'Selecionar dia todo ' + (row.date | date: 'dd MMM')"
              (click)="onDayClick(row)"
            >
              <span class="pricing-calendar__date-day">
                {{ row.date | date: 'EEE' }}
              </span>
              <span class="pricing-calendar__date-num">
                {{ row.date | date: 'dd MMM' }}
              </span>
              @if (row.selectedCount > 0) {
                <span class="pricing-calendar__date-total">
                  {{ row.selectedCount }}h ·
                  {{ row.totalPrice | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
                </span>
              }
            </button>

            <div class="pricing-calendar__hours">
              @for (cell of row.hours; track cell.hour) {
                <button
                  type="button"
                  class="pricing-calendar__cell"
                  [class]="'band-' + cell.band + ' status-' + cell.status"
                  [class.is-selected]="cell.selected"
                  [disabled]="!cell.clickable"
                  role="gridcell"
                  [attr.aria-label]="cellLabel(row.date, cell)"
                  [attr.aria-pressed]="cell.selected"
                  [title]="cellTooltip(row.date, cell)"
                  (click)="onCellClick(row.dateKey, cell)"
                >
                  <span class="pricing-calendar__cell-price">
                    {{ cell.price | number: '1.0-0' }}
                  </span>
                </button>
              }
            </div>
          </div>
        }
      </div>

      <footer class="pricing-calendar__legend" aria-label="Legenda">
        <span class="pricing-calendar__legend-group">
          <span class="pricing-calendar__legend-item">
            <span class="pricing-calendar__legend-swatch band-low"></span>
            Baixo
          </span>
          <span class="pricing-calendar__legend-item">
            <span class="pricing-calendar__legend-swatch band-medium"></span>
            Médio
          </span>
          <span class="pricing-calendar__legend-item">
            <span class="pricing-calendar__legend-swatch band-high"></span>
            Alto
          </span>
        </span>
        <span class="pricing-calendar__legend-group">
          <span class="pricing-calendar__legend-item">
            <span class="pricing-calendar__legend-swatch status-reserved"></span>
            Reservado
          </span>
          <span class="pricing-calendar__legend-item">
            <span class="pricing-calendar__legend-swatch status-sold"></span>
            Vendido
          </span>
        </span>
      </footer>
    </div>
  `,
  styleUrl: './pricing-calendar.component.scss',
})
export class PricingCalendarComponent {
  readonly calendar = input.required<PricingCalendar>();
  readonly selectedIndex = input.required<ReadonlySet<string>>();
  readonly toggle = output<{ date: string; hour: number }>();
  readonly toggleDay = output<{ date: string; hours: number[] }>();

  readonly headerHours = HOURS;

  readonly priceStats = computed(() => {
    const prices = this.calendar()
      .days.flatMap((day) => day.hours.map((h) => h.price))
      .filter((p) => p > 0);
    if (prices.length === 0) return { low: 0, high: 0 };
    const sorted = prices.slice().sort((a, b) => a - b);
    return {
      low: sorted[Math.floor(sorted.length * 0.33)],
      high: sorted[Math.floor(sorted.length * 0.66)],
    };
  });

  readonly rows = computed<DayRowView[]>(() => {
    const calendar = this.calendar();
    const { low, high } = this.priceStats();
    const selected = this.selectedIndex();

    return calendar.days.map((day) => {
      const dateKey = day.date.toISOString().slice(0, 10);
      let totalPrice = 0;
      let selectedCount = 0;
      const hours: HourCellView[] = day.hours.map((cell) => {
        const isSelected = selected.has(`${dateKey}|${cell.hour}`);
        if (isSelected) {
          totalPrice += cell.price;
          selectedCount += 1;
        }
        return {
          hour: cell.hour,
          price: cell.price,
          status: cell.status,
          band: bandForPrice(cell.price, low, high),
          selected: isSelected,
          clickable: cell.status === HourAvailability.Available,
        };
      });
      return {
        dateIso: day.date.toISOString(),
        dateKey,
        date: day.date,
        totalPrice,
        selectedCount,
        hours,
      };
    });
  });

  onCellClick(dateKey: string, cell: HourCellView): void {
    if (!cell.clickable) return;
    this.toggle.emit({ date: dateKey, hour: cell.hour });
  }

  onDayClick(row: DayRowView): void {
    const availableHours = row.hours.filter((h) => h.clickable).map((h) => h.hour);
    if (availableHours.length === 0) return;
    this.toggleDay.emit({ date: row.dateKey, hours: availableHours });
  }

  cellLabel(date: Date, cell: HourCellView): string {
    const dateLabel = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    const status =
      cell.status === HourAvailability.Sold
        ? 'vendido'
        : cell.status === HourAvailability.Reserved
          ? 'reservado'
          : 'disponível';
    return `${dateLabel} ${cell.hour}h, R$ ${cell.price}, ${status}`;
  }

  cellTooltip(date: Date, cell: HourCellView): string {
    const dateLabel = date.toLocaleDateString('pt-BR');
    return `${dateLabel} · ${cell.hour}h–${cell.hour + 1}h · R$ ${cell.price}`;
  }
}
