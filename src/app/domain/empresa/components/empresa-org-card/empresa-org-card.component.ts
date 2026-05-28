import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Organization } from '@shared/interfaces/entity/empresa-organization';

export type OrgCardMenuAction = 'members' | 'leave' | 'delete';

@Component({
  selector: 'app-empresa-org-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="emp-org-card"
      role="link"
      tabindex="0"
      [attr.aria-label]="'Abrir painel de ' + organization().name"
      (click)="open.emit()"
      (keydown.enter)="open.emit()"
      (keydown.space)="$event.preventDefault(); open.emit()"
    >
      <div class="emp-org-card__top">
        <div class="emp-org-card__mark">
          <img
            class="emp-org-card__logo"
            [src]="organization().logoUrl"
            [alt]="''"
            width="44"
            height="44"
            loading="lazy"
          />
        </div>

        <button
          type="button"
          class="emp-org-card__fav"
          [class.is-active]="organization().isFavorite"
          [attr.aria-pressed]="organization().isFavorite"
          [attr.aria-label]="
            organization().isFavorite
              ? 'Remover ' + organization().name + ' dos favoritos'
              : 'Favoritar ' + organization().name
          "
          (click)="$event.stopPropagation(); favoriteToggle.emit()"
        >
          <span class="material-symbols-rounded" aria-hidden="true">
            {{ organization().isFavorite ? 'star' : 'star_outline' }}
          </span>
        </button>
      </div>

      <div class="emp-org-card__identity">
        <h2 class="emp-org-card__name">{{ organization().name }}</h2>
        <p class="emp-org-card__domain">{{ organization().slug }}.realwe</p>
      </div>

      <dl class="emp-org-card__stats" aria-label="Estatísticas">
        <div class="emp-org-card__stat">
          <dt>Produtos</dt>
          <dd>{{ organization().productsCount }}</dd>
        </div>
        <div class="emp-org-card__stat">
          <dt>Triagens</dt>
          <dd>{{ organization().submissionsCount }}</dd>
        </div>
        <div class="emp-org-card__stat">
          <dt>Pessoas</dt>
          <dd>{{ organization().membersCount }}</dd>
        </div>
      </dl>

      <div class="emp-org-card__overflow">
        <button
          type="button"
          class="emp-org-card__menu-btn"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="'Mais ações em ' + organization().name"
          (click)="$event.stopPropagation(); menuToggle.emit()"
        >
          <span class="material-symbols-rounded" aria-hidden="true">more_horiz</span>
        </button>

        @if (menuOpen()) {
          <ul class="emp-org-card__menu" role="menu" (click)="$event.stopPropagation()">
            <li role="menuitem">
              <button type="button" (click)="menuAction.emit('members')">Ver membros</button>
            </li>
            <li role="menuitem">
              <button type="button" (click)="menuAction.emit('leave')">Deixar de ser membro</button>
            </li>
            <li role="separator" aria-hidden="true"></li>
            <li role="menuitem">
              <button
                type="button"
                class="emp-org-card__menu-danger"
                (click)="menuAction.emit('delete')"
              >
                Excluir organização
              </button>
            </li>
          </ul>
        }
      </div>
    </article>
  `,
  styleUrl: './empresa-org-card.component.scss',
})
export class EmpresaOrgCardComponent {
  readonly organization = input.required<Organization>();
  readonly menuOpen = input<boolean>(false);

  readonly open = output<void>();
  readonly favoriteToggle = output<void>();
  readonly menuToggle = output<void>();
  readonly menuAction = output<OrgCardMenuAction>();
}
