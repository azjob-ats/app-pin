import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';

@Component({
  selector: 'app-portfolio-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="portfolio-hero">
      <section class="portfolio-hero__bio">
        <img
          class="portfolio-hero__bio-avatar"
          [src]="portfolio().avatarUrl"
          [alt]="'Foto de ' + portfolio().displayName"
          loading="eager"
        />

        @if (portfolio().headline) {
          <p class="portfolio-hero__bio-headline">— {{ portfolio().headline }}</p>
        }

        <h1 class="portfolio-hero__bio-name">
          {{ portfolio().displayName }}<span class="portfolio-hero__bio-handle">&#64;{{ portfolio().username ?? portfolio().handle }}</span>
        </h1>

        @if (portfolio().about) {
          <p class="portfolio-hero__bio-text">
            <span class="portfolio-hero__bio-quote" aria-hidden="true">&ldquo;</span>{{ portfolio().about }}<span class="portfolio-hero__bio-quote portfolio-hero__bio-quote--end" aria-hidden="true">&rdquo;</span>
          </p>
        }
      </section>
    </header>
  `,
  styleUrl: './portfolio-hero.component.scss',
})
export class PortfolioHeroComponent {
  readonly portfolio = input.required<CreatorPortfolio>();
  readonly isOwner = input<boolean>(false);

  readonly follow = output<void>();
  readonly contact = output<void>();
  readonly edit = output<void>();

  readonly locationLabel = computed<string | null>(() => {
    const c = this.portfolio().contact;
    const parts = [c.city, c.country].filter((v): v is string => !!v && v.trim() !== '');
    return parts.length ? parts.join(', ') : null;
  });

  readonly hasContact = computed(() => {
    const c = this.portfolio().contact;
    return !!(c.email || c.phone);
  });
}
