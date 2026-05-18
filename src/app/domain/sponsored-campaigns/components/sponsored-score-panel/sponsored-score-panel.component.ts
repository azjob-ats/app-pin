import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { ScoreBreakdown } from '@shared/interfaces/entity/sponsored-campaigns';

interface ScoreSegment {
  label: string;
  description: string;
  weight: number;
  toneClass: string;
}

@Component({
  selector: 'app-sponsored-score-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="sponsored-score" aria-labelledby="sponsored-score-title">
      <header class="sponsored-score__head">
        <h2 class="sponsored-score__title" id="sponsored-score-title">Score de Relevância</h2>
        <p class="sponsored-score__subtitle">
          Critério oficial para escolher quem leva o slot patrocinado.
        </p>
      </header>

      <div class="sponsored-score__bar" role="img" aria-label="Composição do score">
        @for (segment of segments(); track segment.label) {
          <span
            class="sponsored-score__segment"
            [class]="segment.toneClass"
            [style.flex]="segment.weight"
            [attr.title]="segment.label + ': ' + segment.weight + '%'"
          ></span>
        }
      </div>

      <ul class="sponsored-score__list" role="list">
        @for (segment of segments(); track segment.label) {
          <li class="sponsored-score__item">
            <span class="sponsored-score__item-head">
              <span class="sponsored-score__dot" [class]="segment.toneClass"></span>
              <span class="sponsored-score__item-label">{{ segment.label }}</span>
              <span class="sponsored-score__item-weight">{{ segment.weight }}%</span>
            </span>
            <p class="sponsored-score__item-desc">{{ segment.description }}</p>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './sponsored-score-panel.component.scss',
})
export class SponsoredScorePanelComponent {
  readonly breakdown = input.required<ScoreBreakdown>();

  readonly segments = computed<ScoreSegment[]>(() => {
    const b = this.breakdown();
    return [
      {
        label: 'Performance orgânica',
        description: 'Retenção e engajamento que o conteúdo já provou sem pagar.',
        weight: b.organicPerformanceWeight,
        toneClass: 'is-organic',
      },
      {
        label: 'Qualidade do conteúdo',
        description: 'Aprovação editorial, criador identificado e produção cuidada.',
        weight: b.contentQualityWeight,
        toneClass: 'is-quality',
      },
      {
        label: 'Histórico de conversão',
        description: 'Quanto "Saiba mais" o conteúdo já gerou em rodadas anteriores.',
        weight: b.conversionHistoryWeight,
        toneClass: 'is-conversion',
      },
      {
        label: 'Valor da campanha',
        description: 'O lance importa, mas pesa menos que mérito orgânico.',
        weight: b.campaignValueWeight,
        toneClass: 'is-bid',
      },
    ];
  });
}
