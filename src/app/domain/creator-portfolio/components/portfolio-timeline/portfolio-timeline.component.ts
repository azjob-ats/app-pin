import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Experience } from '@shared/interfaces/entity/creator-portfolio';
import { WorkMode } from '@shared/enums/work-mode.enum';

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  [WorkMode.Remote]: 'Remoto',
  [WorkMode.Hybrid]: 'Híbrido',
  [WorkMode.OnSite]: 'Presencial',
};

@Component({
  selector: 'app-portfolio-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe],
  template: `
    <section class="portfolio-timeline" aria-label="Trajetória profissional">
      <h2 class="portfolio-timeline__title">Trajetória</h2>

      @if (experiences().length === 0) {
        <p class="portfolio-timeline__empty">Sem experiências publicadas ainda.</p>
      } @else {
        <ol class="portfolio-timeline__list">
          @for (exp of experiences(); track exp.id) {
            <li class="portfolio-timeline__item">
              <div class="portfolio-timeline__logo" aria-hidden="true">
                @if (exp.companyLogoUrl) {
                  <img [src]="exp.companyLogoUrl" [alt]="''" loading="lazy" />
                } @else {
                  <span class="material-symbols-rounded">business</span>
                }
              </div>
              <div class="portfolio-timeline__content">
                <div class="portfolio-timeline__role">{{ exp.role }}</div>
                <div class="portfolio-timeline__company">
                  {{ exp.companyName }}
                  @if (exp.location) {
                    <span class="portfolio-timeline__sep">·</span>
                    <span>{{ exp.location }}</span>
                  }
                  <span class="portfolio-timeline__sep">·</span>
                  <span>{{ workModeLabel(exp) }}</span>
                </div>
                <div class="portfolio-timeline__period">
                  {{ exp.startDate | date: 'MMM yyyy' }} —
                  @if (exp.isCurrent) {
                    <span class="portfolio-timeline__current">presente</span>
                  } @else if (exp.endDate) {
                    {{ exp.endDate | date: 'MMM yyyy' }}
                  } @else {
                    sem data de saída
                  }
                </div>
                @if (exp.description) {
                  <p class="portfolio-timeline__description">{{ exp.description }}</p>
                }
              </div>
            </li>
          }
        </ol>
      }
    </section>
  `,
  styleUrl: './portfolio-timeline.component.scss',
})
export class PortfolioTimelineComponent {
  readonly experiences = input.required<Experience[]>();

  workModeLabel(exp: Experience): string {
    return WORK_MODE_LABELS[exp.workMode] ?? '';
  }
}
