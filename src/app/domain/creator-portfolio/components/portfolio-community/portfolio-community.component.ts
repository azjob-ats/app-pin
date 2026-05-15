import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { CommunityInfo, SocialLink } from '@shared/interfaces/entity/creator-portfolio';

const PLATFORM_LABELS: Record<SocialLink['platform'], string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  behance: 'Behance',
  instagram: 'Instagram',
  website: 'Site',
  other: 'Link',
};

@Component({
  selector: 'app-portfolio-community',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="portfolio-community" aria-labelledby="community-title">
      <div class="portfolio-community__head">
        <p class="portfolio-community__label">Comunidade</p>
        <h2 id="community-title" class="portfolio-community__title">Onde a conversa continua</h2>
        @if (community().supportsDM) {
          <span class="portfolio-community__status">
            <span class="portfolio-community__status-dot" aria-hidden="true"></span>
            Aberto a mensagens
          </span>
        }
      </div>

      @if (socials().length > 0) {
        <ul class="portfolio-community__links" role="list">
          @for (social of socials(); track social.url) {
            <li>
              <a
                class="portfolio-community__link"
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="portfolio-community__link-platform">{{ labelFor(social.platform) }}</span>
                <span class="portfolio-community__link-label">{{ social.label || 'Acessar' }}</span>
                <span class="material-symbols-rounded portfolio-community__link-arrow" aria-hidden="true">arrow_outward</span>
              </a>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styleUrl: './portfolio-community.component.scss',
})
export class PortfolioCommunityComponent {
  readonly community = input.required<CommunityInfo>();
  readonly socials = input<SocialLink[]>([]);

  labelFor(platform: SocialLink['platform']): string {
    return PLATFORM_LABELS[platform] ?? platform;
  }
}
