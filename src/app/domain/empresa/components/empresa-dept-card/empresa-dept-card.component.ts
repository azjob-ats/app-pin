import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Department } from '@shared/interfaces/entity/empresa-department';

export type DeptCardMenuAction = 'edit' | 'delete';

@Component({
  selector: 'app-empresa-dept-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="emp-dept-card"
      role="link"
      tabindex="0"
      [attr.aria-label]="'Abrir departamento ' + department().name"
      (click)="open.emit()"
      (keydown.enter)="open.emit()"
      (keydown.space)="$event.preventDefault(); open.emit()"
    >
      <div class="emp-dept-card__top">
        <div class="emp-dept-card__mark" [style.--dept-accent]="department().color">
          <span class="material-symbols-rounded" aria-hidden="true">
            {{ department().icon || 'workspaces' }}
          </span>
        </div>

        <button
          type="button"
          class="emp-dept-card__fav"
          [class.is-active]="department().isFavorite"
          [attr.aria-pressed]="department().isFavorite"
          [attr.aria-label]="
            department().isFavorite
              ? 'Remover ' + department().name + ' dos favoritos'
              : 'Favoritar ' + department().name
          "
          (click)="$event.stopPropagation(); favoriteToggle.emit()"
        >
          <span class="material-symbols-rounded" aria-hidden="true">
            {{ department().isFavorite ? 'star' : 'star_outline' }}
          </span>
        </button>
      </div>

      <div class="emp-dept-card__identity">
        <h2 class="emp-dept-card__name">{{ department().name }}</h2>
        @if (department().description) {
          <p class="emp-dept-card__desc">{{ department().description }}</p>
        }
      </div>

      <dl class="emp-dept-card__stats" aria-label="Estatísticas">
        <div class="emp-dept-card__stat">
          <dt>Produtos</dt>
          <dd>{{ department().productsCount }}</dd>
        </div>
        <div class="emp-dept-card__stat">
          <dt>Triagens</dt>
          <dd>{{ department().submissionsCount }}</dd>
        </div>
        <div class="emp-dept-card__stat">
          <dt>Pessoas</dt>
          <dd>{{ department().membersCount }}</dd>
        </div>
      </dl>

      <div class="emp-dept-card__overflow">
        <button
          type="button"
          class="emp-dept-card__menu-btn"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="'Mais ações em ' + department().name"
          (click)="$event.stopPropagation(); menuToggle.emit()"
        >
          <span class="material-symbols-rounded" aria-hidden="true">more_horiz</span>
        </button>

        @if (menuOpen()) {
          <ul class="emp-dept-card__menu" role="menu" (click)="$event.stopPropagation()">
            <li role="menuitem">
              <button type="button" (click)="menuAction.emit('edit')">Editar departamento</button>
            </li>
            <li role="separator" aria-hidden="true"></li>
            <li role="menuitem">
              <button
                type="button"
                class="emp-dept-card__menu-danger"
                (click)="menuAction.emit('delete')"
              >
                Excluir departamento
              </button>
            </li>
          </ul>
        }
      </div>
    </article>
  `,
  styleUrl: './empresa-dept-card.component.scss',
})
export class EmpresaDeptCardComponent {
  readonly department = input.required<Department>();
  readonly menuOpen = input<boolean>(false);

  readonly open = output<void>();
  readonly favoriteToggle = output<void>();
  readonly menuToggle = output<void>();
  readonly menuAction = output<DeptCardMenuAction>();
}
