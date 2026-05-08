import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { CommunityInfo, SocialLink } from '@shared/interfaces/entity/creator-portfolio';

const COUNT_FORMATTER = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

const PLATFORM_ICONS: Record<SocialLink['platform'], string> = {
  linkedin: 'work',
  github: 'code',
  behance: 'palette',
  instagram: 'photo_camera',
  website: 'language',
  other: 'link',
};

@Component({
  selector: 'app-portfolio-community',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="portfolio-community" aria-label="Comunidade e redes">
      <h2 class="portfolio-community__title">Comunidade</h2>

      <div class="portfolio-community__row">
        <div class="portfolio-community__followers">
          <span class="material-symbols-rounded portfolio-community__icon" aria-hidden="true">group</span>
          <span class="portfolio-community__count">{{ followersFormatted() }}</span>
          <span class="portfolio-community__label">seguidores</span>
        </div>

        @if (community().supportsDM) {
          <span class="portfolio-community__chip">
            <span class="material-symbols-rounded icon-sm" aria-hidden="true">forum</span>
            Aberto a mensagens
          </span>
        }
      </div>

      @if (socials().length > 0) {
        <ul class="portfolio-community__socials" role="list">
          @for (social of socials(); track social.url) {
            <li>
              <a
                class="portfolio-community__social"
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="social.label || social.platform"
              >
                <span class="material-symbols-rounded icon-sm" aria-hidden="true">
                  {{ iconFor(social.platform) }}
                </span>
                {{ social.label || labelFor(social.platform) }}
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

  readonly followersFormatted = computed(() => COUNT_FORMATTER.format(this.community().followers));

  iconFor(platform: SocialLink['platform']): string {
    return PLATFORM_ICONS[platform] ?? 'link';
  }

  labelFor(platform: SocialLink['platform']): string {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
}
