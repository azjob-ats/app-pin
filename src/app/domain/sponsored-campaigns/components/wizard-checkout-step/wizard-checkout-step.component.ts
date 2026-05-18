import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import {
  CampaignProjection,
  CardSummary,
} from '@shared/interfaces/entity/campaign';
import { EligibleVideo } from '@shared/interfaces/entity/sponsored-campaigns';

interface DayBreakdown {
  date: Date;
  hours: number[];
  total: number;
}

@Component({
  selector: 'app-wizard-checkout-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, DecimalPipe, CurrencyPipe],
  template: `
    <section class="wizard-checkout" aria-labelledby="wizard-checkout-title">
      <header class="wizard-checkout__head">
        <h2 class="wizard-checkout__title" id="wizard-checkout-title">
          Detalhe da compra
        </h2>
        <p class="wizard-checkout__subtitle">
          Revise antes de iniciar. Você pode cancelar a campanha enquanto estiver pendente
          ou agendada.
        </p>
      </header>

      <div class="wizard-checkout__layout">
        <div class="wizard-checkout__column">
          <article class="wizard-checkout__panel">
            <h3 class="wizard-checkout__panel-title">Palavra-chave</h3>
            <p class="wizard-checkout__value">
              <span class="material-symbols-rounded" aria-hidden="true">search</span>
              {{ keyword() }}
            </p>
          </article>

          @if (video(); as v) {
            <article class="wizard-checkout__panel">
              <h3 class="wizard-checkout__panel-title">Vídeo patrocinado</h3>
              <div class="wizard-checkout__video">
                <img
                  class="wizard-checkout__thumb"
                  [src]="v.thumbnailUrl"
                  alt=""
                  loading="lazy"
                />
                <div class="wizard-checkout__video-body">
                  <h4 class="wizard-checkout__video-title">{{ v.title }}</h4>
                  <p class="wizard-checkout__video-credit">
                    {{ v.channelName }} <span class="wizard-checkout__by">by</span>
                    {{ v.creatorName }}
                  </p>
                  <p class="wizard-checkout__video-stats">
                    Retenção {{ v.retentionPercent | number: '1.0-0' }}% ·
                    Conversão {{ v.conversionRate | number: '1.1-1' }}% ·
                    Score {{ v.relevanceScore | number: '1.0-0' }}
                  </p>
                </div>
              </div>
            </article>
          }

          <article class="wizard-checkout__panel">
            <h3 class="wizard-checkout__panel-title">Horas por dia</h3>
            <ul class="wizard-checkout__breakdown" role="list">
              @for (day of breakdown(); track day.date) {
                <li class="wizard-checkout__breakdown-row">
                  <time
                    class="wizard-checkout__breakdown-date"
                    [attr.datetime]="day.date.toISOString()"
                  >
                    {{ day.date | date: 'EEE, dd MMM' }}
                  </time>
                  <span class="wizard-checkout__breakdown-hours">
                    {{ formatHours(day.hours) }}
                  </span>
                  <span class="wizard-checkout__breakdown-total">
                    {{ day.total | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
                  </span>
                </li>
              }
            </ul>
          </article>
        </div>

        <aside class="wizard-checkout__sidebar">
          <article class="wizard-checkout__panel wizard-checkout__panel--total">
            <h3 class="wizard-checkout__panel-title">Total</h3>
            <p class="wizard-checkout__total">
              {{ totalCost() | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
            </p>
            <p class="wizard-checkout__total-hint">
              {{ totalHours() }} horas em {{ totalDays() }} dias
            </p>
          </article>

          <article class="wizard-checkout__panel">
            <h3 class="wizard-checkout__panel-title">Forma de pagamento</h3>
            @if (card(); as c) {
              <div class="wizard-checkout__card">
                <span class="wizard-checkout__card-brand">{{ c.brand }}</span>
                <span class="wizard-checkout__card-number">•••• {{ c.last4 }}</span>
                <span class="wizard-checkout__card-meta">
                  {{ c.holderName }} · {{ padMonth(c.expirationMonth) }}/{{ c.expirationYear }}
                </span>
              </div>
            } @else {
              <div class="wizard-checkout__no-card">
                <span class="material-symbols-rounded" aria-hidden="true">credit_card_off</span>
                <div>
                  <strong>Sem cartão configurado</strong>
                  <p>
                    A campanha fica pendente até você cadastrar um cartão. Ela aparecerá no
                    seu histórico aguardando configuração.
                  </p>
                </div>
              </div>
            }
          </article>

          @if (projection(); as proj) {
            <article class="wizard-checkout__panel">
              <h3 class="wizard-checkout__panel-title">Projeção</h3>
              <dl class="wizard-checkout__projection">
                <div>
                  <dt>Impressões est.</dt>
                  <dd>{{ proj.estimatedImpressions | number: '1.0-0' }}</dd>
                </div>
                <div>
                  <dt>Cliques est.</dt>
                  <dd>{{ proj.estimatedClicks | number: '1.0-0' }}</dd>
                </div>
                <div>
                  <dt>Conversões est.</dt>
                  <dd>{{ proj.estimatedConversions | number: '1.0-0' }}</dd>
                </div>
                <div>
                  <dt>Prob. vencer</dt>
                  <dd>{{ proj.winProbability * 100 | number: '1.0-0' }}%</dd>
                </div>
              </dl>
            </article>
          }
        </aside>
      </div>
    </section>
  `,
  styleUrl: './wizard-checkout-step.component.scss',
})
export class WizardCheckoutStepComponent {
  readonly keyword = input.required<string>();
  readonly video = input.required<EligibleVideo | null>();
  readonly hours = input.required<{ date: string; hour: number; price: number }[]>();
  readonly card = input.required<CardSummary | null>();
  readonly projection = input.required<CampaignProjection | null>();
  readonly totalCost = input.required<number>();

  readonly totalHours = computed(() => this.hours().length);

  readonly breakdown = computed<DayBreakdown[]>(() => {
    const map = new Map<string, DayBreakdown>();
    for (const h of this.hours()) {
      const date = new Date(h.date);
      const key = date.toISOString().slice(0, 10);
      let entry = map.get(key);
      if (!entry) {
        entry = { date, hours: [], total: 0 };
        map.set(key, entry);
      }
      entry.hours.push(h.hour);
      entry.total += h.price;
    }
    const list = Array.from(map.values());
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    list.forEach((entry) => entry.hours.sort((a, b) => a - b));
    return list;
  });

  readonly totalDays = computed(() => this.breakdown().length);

  formatHours(hours: number[]): string {
    if (hours.length === 0) return '—';
    const ranges: string[] = [];
    let start = hours[0];
    let prev = hours[0];
    for (let i = 1; i <= hours.length; i += 1) {
      const cur = hours[i];
      if (cur === prev + 1) {
        prev = cur;
        continue;
      }
      ranges.push(start === prev ? `${start}h` : `${start}h–${prev + 1}h`);
      start = cur;
      prev = cur;
    }
    return ranges.join(', ');
  }

  padMonth(month: number): string {
    return month.toString().padStart(2, '0');
  }
}
