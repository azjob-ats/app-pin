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
    <section class="portfolio-timeline" aria-labelledby="timeline-title">
      <header class="portfolio-timeline__head">
        <h2 id="timeline-title" class="portfolio-timeline__title">Trajetória</h2>
        <span class="portfolio-timeline__count">{{ experiences().length }}</span>
      </header>

      @if (experiences().length === 0) {
        <p class="portfolio-timeline__empty">Nenhuma experiência publicada.</p>
      } @else {
        <ol class="portfolio-timeline__list">
          @for (exp of experiences(); track exp.id) {
            <li class="portfolio-timeline__item">
              <div class="portfolio-timeline__logo" aria-hidden="true">
                @if (exp.companyLogoUrl) {
                  <img [src]="exp.companyLogoUrl" [alt]="''" loading="lazy" />
                } @else {
                  <span class="material-symbols-rounded">apartment</span>
                }
              </div>

              <div class="portfolio-timeline__content">
                <div class="portfolio-timeline__top">
                  <h3 class="portfolio-timeline__role">{{ exp.role }}</h3>
                  @if (exp.isCurrent) {
                    <span class="portfolio-timeline__badge">Atual</span>
                  }
                </div>

                <p class="portfolio-timeline__company">
                  {{ exp.companyName }}
                  @if (exp.location) {
                    <span class="portfolio-timeline__sep" aria-hidden="true">·</span>
                    <span>{{ exp.location }}</span>
                  }
                  <span class="portfolio-timeline__sep" aria-hidden="true">·</span>
                  <span>{{ workModeLabel(exp) }}</span>
                </p>

                <p class="portfolio-timeline__period">
                  {{ exp.startDate | date: 'MMM yyyy' }}
                  <span class="portfolio-timeline__dash" aria-hidden="true">—</span>
                  @if (exp.isCurrent) {
                    presente
                  } @else if (exp.endDate) {
                    {{ exp.endDate | date: 'MMM yyyy' }}
                  } @else {
                    sem data
                  }
                </p>

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
