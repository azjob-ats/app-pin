import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Experience, Highlight } from '@shared/interfaces/entity/creator-portfolio';

interface HighlightGroup {
  key: string;
  experience: Experience | null;
  highlights: Highlight[];
}

const VIEWS_FORMATTER = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const ORPHAN_KEY = '__orphan__';

@Component({
  selector: 'app-portfolio-highlights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe],
  template: `
    <section class="portfolio-highlights" aria-labelledby="highlights-title">
      <header class="portfolio-highlights__head">
        <h2 id="highlights-title" class="portfolio-highlights__title">Trabalhos</h2>
        <span class="portfolio-highlights__count">{{ highlights().length }}</span>
      </header>

      @if (highlights().length === 0) {
        <p class="portfolio-highlights__empty">Nenhum trabalho publicado.</p>
      } @else {
        <div class="portfolio-highlights__groups">
          @for (group of groups(); track group.key) {
            <article class="portfolio-highlights__group">
              <header
                class="portfolio-highlights__group-head"
                [class.portfolio-highlights__group-head--orphan]="!group.experience"
              >
                @if (group.experience; as exp) {
                  <div class="portfolio-highlights__group-logo" aria-hidden="true">
                    @if (exp.companyLogoUrl) {
                      <img [src]="exp.companyLogoUrl" [alt]="''" loading="lazy" />
                    }
                  </div>
                  <div class="portfolio-highlights__group-meta">
                    <span class="portfolio-highlights__group-company">{{ exp.companyName }}</span>
                    <span class="portfolio-highlights__group-role">
                      {{ exp.role }}
                      <span class="portfolio-highlights__group-dot" aria-hidden="true">·</span>
                      <span class="portfolio-highlights__group-period">
                        {{ exp.startDate | date: 'yyyy' }} —
                        @if (exp.isCurrent) {
                          presente
                        } @else if (exp.endDate) {
                          {{ exp.endDate | date: 'yyyy' }}
                        } @else {
                          sem data
                        }
                      </span>
                    </span>
                  </div>
                } @else {
                  <div class="portfolio-highlights__group-meta">
                    <span class="portfolio-highlights__group-company">Outros</span>
                    <span class="portfolio-highlights__group-role">
                      Trabalhos sem trajetória associada
                    </span>
                  </div>
                }
                <span class="portfolio-highlights__group-count">{{ group.highlights.length }}</span>
              </header>

              <div class="portfolio-highlights__grid" role="list">
                @for (item of group.highlights; track item.id) {
                  <button
                    type="button"
                    role="listitem"
                    class="portfolio-highlights__card"
                    (click)="open.emit(item.pinId)"
                  >
                    <div class="portfolio-highlights__thumb">
                      <img [src]="item.thumbnailUrl" [alt]="item.title" loading="lazy" />
                    </div>
                    <div class="portfolio-highlights__meta">
                      <h3 class="portfolio-highlights__caption">{{ item.title }}</h3>
                      <p class="portfolio-highlights__sub">
                        <span>{{ formatViews(item.views) }} views</span>
                        <span class="portfolio-highlights__dot" aria-hidden="true">·</span>
                        <span>{{ item.publishedAt | date: 'MMM yyyy' }}</span>
                      </p>
                    </div>
                  </button>
                }
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './portfolio-highlights.component.scss',
})
export class PortfolioHighlightsComponent {
  readonly highlights = input.required<Highlight[]>();
  readonly experiences = input<Experience[]>([]);
  readonly open = output<string>();

  readonly groups = computed<HighlightGroup[]>(() => {
    const byExperience = new Map<string, Highlight[]>();
    const orphans: Highlight[] = [];

    for (const h of this.highlights()) {
      if (h.experienceId) {
        const bucket = byExperience.get(h.experienceId) ?? [];
        bucket.push(h);
        byExperience.set(h.experienceId, bucket);
      } else {
        orphans.push(h);
      }
    }

    const ordered: HighlightGroup[] = [];

    for (const exp of this.experiences()) {
      const items = byExperience.get(exp.id);
      if (items && items.length > 0) {
        ordered.push({ key: exp.id, experience: exp, highlights: items });
        byExperience.delete(exp.id);
      }
    }

    // Highlights ligados a uma experience que não existe mais — agrupa em órfãos
    for (const items of byExperience.values()) {
      orphans.push(...items);
    }

    if (orphans.length > 0) {
      ordered.push({ key: ORPHAN_KEY, experience: null, highlights: orphans });
    }

    return ordered;
  });

  formatViews(value: number): string {
    return VIEWS_FORMATTER.format(value);
  }
}
