import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { EligibleVideo } from '@shared/interfaces/entity/sponsored-campaigns';

interface ChecklistRow {
  label: string;
  passed: boolean;
}

@Component({
  selector: 'app-sponsored-eligibility-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DecimalPipe],
  template: `
    <section class="sponsored-eligibility" aria-labelledby="sponsored-eligibility-title">
      <header class="sponsored-eligibility__head">
        <h2 class="sponsored-eligibility__title" id="sponsored-eligibility-title">
          Vídeos que podem ser impulsionados
        </h2>
        <p class="sponsored-eligibility__subtitle">
          Selecione um vídeo para usar na sua reserva. Só sobe quem já converte organicamente.
        </p>
      </header>

      <ul class="sponsored-eligibility__list" role="list">
        @for (video of videos(); track video.id) {
          <li class="sponsored-eligibility__item">
            <button
              type="button"
              class="sponsored-eligibility__card"
              [class.is-selected]="video.id === selectedId()"
              [class.is-blocked]="!video.eligible"
              [disabled]="!video.eligible"
              [attr.aria-pressed]="video.id === selectedId()"
              (click)="select.emit(video.id)"
            >
              <img
                class="sponsored-eligibility__thumb"
                [src]="video.thumbnailUrl"
                alt=""
                loading="lazy"
              />

              <div class="sponsored-eligibility__body">
                <header class="sponsored-eligibility__card-head">
                  <h3 class="sponsored-eligibility__card-title">{{ video.title }}</h3>
                  <p class="sponsored-eligibility__credit">
                    <span class="sponsored-eligibility__channel">{{ video.channelName }}</span>
                    <span class="sponsored-eligibility__by">by</span>
                    <span class="sponsored-eligibility__creator">{{ video.creatorName }}</span>
                  </p>
                </header>

                <dl class="sponsored-eligibility__stats">
                  <div class="sponsored-eligibility__stat">
                    <dt>Retenção</dt>
                    <dd>{{ video.retentionPercent | number: '1.0-0' }}%</dd>
                  </div>
                  <div class="sponsored-eligibility__stat">
                    <dt>Conversão</dt>
                    <dd>{{ video.conversionRate | number: '1.1-1' }}%</dd>
                  </div>
                  <div class="sponsored-eligibility__stat">
                    <dt>Score</dt>
                    <dd>{{ video.relevanceScore | number: '1.0-0' }}</dd>
                  </div>
                </dl>

                <ul class="sponsored-eligibility__checks" role="list">
                  @for (row of checklistFor(video); track row.label) {
                    <li
                      class="sponsored-eligibility__check"
                      [class.is-passed]="row.passed"
                      [class.is-failed]="!row.passed"
                    >
                      <span class="material-symbols-rounded" aria-hidden="true">
                        {{ row.passed ? 'check_circle' : 'cancel' }}
                      </span>
                      {{ row.label }}
                    </li>
                  }
                </ul>

                @if (!video.eligible && video.blockedReason) {
                  <p class="sponsored-eligibility__blocked">
                    <span class="material-symbols-rounded" aria-hidden="true">block</span>
                    {{ video.blockedReason }}
                  </p>
                }
              </div>
            </button>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './sponsored-eligibility-list.component.scss',
})
export class SponsoredEligibilityListComponent {
  readonly videos = input.required<EligibleVideo[]>();
  readonly selectedId = input<string | null>(null);
  readonly select = output<string>();

  checklistFor(video: EligibleVideo): ChecklistRow[] {
    const c = video.checklist;
    return [
      { label: 'Criador identificado', passed: c.hasRealCreator },
      { label: 'Vídeo longo publicado', passed: c.hasLongVideo },
      { label: 'Moderação aprovada', passed: c.passedModeration },
      { label: 'Interação real', passed: c.hasRealInteraction },
      { label: 'Histórico limpo', passed: c.lowRejectionRate },
      { label: 'Boa retenção', passed: c.goodRetention },
    ];
  }
}
