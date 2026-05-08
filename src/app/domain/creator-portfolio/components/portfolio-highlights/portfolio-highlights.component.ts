import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { Highlight } from '@shared/interfaces/entity/creator-portfolio';

const VIEWS_FORMATTER = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

@Component({
  selector: 'app-portfolio-highlights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="portfolio-highlights" aria-label="Conteúdos em destaque">
      <h2 class="portfolio-highlights__title">Conteúdos em destaque</h2>

      @if (highlights().length === 0) {
        <p class="portfolio-highlights__empty">Aguardando primeiro conteúdo.</p>
      } @else {
        <div class="portfolio-highlights__grid" role="list">
          @for (item of highlights(); track item.id) {
            <button
              type="button"
              role="listitem"
              class="portfolio-highlights__card"
              (click)="open.emit(item.pinId)"
            >
              <div class="portfolio-highlights__thumb">
                <img [src]="item.thumbnailUrl" [alt]="''" loading="lazy" />
                <span class="portfolio-highlights__views">
                  <span class="material-symbols-rounded icon-sm" aria-hidden="true">visibility</span>
                  {{ formatViews(item.views) }}
                </span>
              </div>
              <div class="portfolio-highlights__caption">{{ item.title }}</div>
            </button>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './portfolio-highlights.component.scss',
})
export class PortfolioHighlightsComponent {
  readonly highlights = input.required<Highlight[]>();
  readonly open = output<string>();

  formatViews(value: number): string {
    return VIEWS_FORMATTER.format(value);
  }
}
