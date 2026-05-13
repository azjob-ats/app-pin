import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';

@Component({
  selector: 'app-portfolio-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="portfolio-hero">
      <div
        class="portfolio-hero__cover"
        role="img"
        [attr.aria-label]="'Capa de ' + portfolio().displayName"
        [style.background-image]="'url(' + portfolio().coverUrl + ')'"
      ></div>

      <div class="portfolio-hero__body">
        <img
          class="portfolio-hero__avatar"
          [src]="portfolio().avatarUrl"
          [alt]="'Foto de ' + portfolio().displayName"
          loading="eager"
        />

        <div class="portfolio-hero__identity">
          <div class="portfolio-hero__name-row">
            <h1 class="portfolio-hero__name">{{ portfolio().displayName }}</h1>
            <span class="portfolio-hero__handle">&#64;{{ portfolio().username ?? portfolio().handle }}</span>
            @if (portfolio().pronoun) {
              <span class="portfolio-hero__pronoun">{{ portfolio().pronoun }}</span>
            }
          </div>
          <p class="portfolio-hero__headline">{{ portfolio().headline }}</p>

          @if (hasContact()) {
            <ul class="portfolio-hero__contact" role="list">
              @if (portfolio().contact.email; as email) {
                <li class="portfolio-hero__contact-item">
                  <a class="portfolio-hero__contact-link" [href]="'mailto:' + email">{{ email }}</a>
                </li>
              }
              @if (portfolio().contact.phone; as phone) {
                <li class="portfolio-hero__contact-item">
                  <a class="portfolio-hero__contact-link" [href]="'tel:' + phone">{{ phone }}</a>
                </li>
              }
              @if (locationLabel(); as location) {
                <li class="portfolio-hero__contact-item">{{ location }}</li>
              }
            </ul>
          }
        </div>

        <div class="portfolio-hero__actions">
          @if (isOwner()) {
            <button type="button" class="portfolio-hero__btn-primary" (click)="edit.emit()">
              <span class="material-symbols-rounded icon-sm" aria-hidden="true">edit</span>
              Editar portfólio
            </button>
          } @else {
            <button type="button" class="portfolio-hero__btn-primary" (click)="follow.emit()">
              <span class="material-symbols-rounded icon-sm" aria-hidden="true">add</span>
              Seguir
            </button>
            <button type="button" class="portfolio-hero__btn-secondary" (click)="contact.emit()">
              <span class="material-symbols-rounded icon-sm" aria-hidden="true">forum</span>
              Contato
            </button>
          }
        </div>
      </div>
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
    return !!(c.email || c.phone || this.locationLabel());
  });
}
