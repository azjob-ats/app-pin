import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { PricingCalendarComponent } from '@domain/sponsored-campaigns/components/pricing-calendar/pricing-calendar.component';
import { PricingCalendar } from '@shared/interfaces/entity/campaign';

@Component({
  selector: 'app-wizard-window-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, DecimalPipe, CurrencyPipe, PricingCalendarComponent],
  template: `
    <section class="wizard-window" aria-labelledby="wizard-window-title">
      <header class="wizard-window__head">
        <h2 class="wizard-window__title" id="wizard-window-title">
          Quando você quer aparecer?
        </h2>
        <p class="wizard-window__subtitle">
          Janela fixa de 31 dias a partir da data inicial. Clique nas horas para selecionar
          — o preço varia por horário (manhã caro, madrugada barato) e por dia do mês.
        </p>
      </header>

      <div class="wizard-window__controls">
        <label class="wizard-window__field">
          <span class="wizard-window__label">Início da janela</span>
          <input
            type="date"
            class="wizard-window__input"
            [value]="windowFrom() ?? ''"
            [min]="minDate"
            name="windowFrom"
            (change)="onDateChange($event)"
          />
        </label>

        <div class="wizard-window__summary">
          <div class="wizard-window__summary-row">
            <span class="wizard-window__summary-label">Horas selecionadas</span>
            <strong class="wizard-window__summary-value">
              {{ hoursCount() | number: '1.0-0' }}
            </strong>
          </div>
          <div class="wizard-window__summary-row">
            <span class="wizard-window__summary-label">Total estimado</span>
            <strong class="wizard-window__summary-value wizard-window__summary-value--accent">
              {{ totalCost() | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
            </strong>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="wizard-window__loading">Carregando preços por hora…</div>
      } @else if (calendar(); as cal) {
        <div class="wizard-window__window-info">
          <span class="material-symbols-rounded" aria-hidden="true">calendar_month</span>
          <span>
            Janela: <strong>{{ cal.from | date: 'dd MMM yyyy' }}</strong>
            <span aria-hidden="true">→</span>
            <strong>{{ cal.to | date: 'dd MMM yyyy' }}</strong>
            · palavra-chave <strong>"{{ cal.keyword }}"</strong>
          </span>
        </div>

        <app-pricing-calendar
          [calendar]="cal"
          [selectedIndex]="selectedIndex()"
          (toggle)="onCellToggle($event)"
          (toggleDay)="onDayToggle($event)"
        />
      } @else {
        <div class="wizard-window__placeholder">
          <span class="material-symbols-rounded" aria-hidden="true">date_range</span>
          <p>Escolha a data inicial para abrir o calendário de preços.</p>
        </div>
      }
    </section>
  `,
  styleUrl: './wizard-window-step.component.scss',
})
export class WizardWindowStepComponent {
  readonly windowFrom = input.required<string | null>();
  readonly calendar = input.required<PricingCalendar | null>();
  readonly selectedIndex = input.required<ReadonlySet<string>>();
  readonly hoursCount = input.required<number>();
  readonly totalCost = input.required<number>();
  readonly loading = input<boolean>(false);

  readonly windowFromChange = output<string>();
  readonly toggle = output<{ date: string; hour: number }>();
  readonly toggleDay = output<{ date: string; hours: number[] }>();

  readonly minDate = new Date().toISOString().slice(0, 10);

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.windowFromChange.emit(value);
  }

  onCellToggle(payload: { date: string; hour: number }): void {
    this.toggle.emit(payload);
  }

  onDayToggle(payload: { date: string; hours: number[] }): void {
    this.toggleDay.emit(payload);
  }
}
