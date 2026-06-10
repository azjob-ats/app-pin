import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, input } from '@angular/core';

/**
 * Card — clone de `baseui/card`. `<section>` (borda 2px, raio 12, overflow hidden) com
 * `headerImage` (topo) + Contents (margem 16) contendo `title` + conteúdo projetado
 * (`[buiCardThumbnail]`/`[buiCardTitle]`/`[buiCardBody]`/`[buiCardAction]`). **Aproximação:**
 * o `header-level` (Title vira H1/H2/H3 via LevelContext React) é renderizado como H1. Nenhum token novo.
 */
@Component({
  selector: 'bui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './card.component.scss',
  template: `
    @if (headerImage()) {
      <img class="bui-card__header-image" [src]="headerImage()" [attr.alt]="headerAlt() || null" />
    }
    <div class="bui-card__contents">
      @if (title()) {
        <h1 class="bui-card__title">{{ title() }}</h1>
      }
      <ng-content />
    </div>
  `,
  host: { 'data-baseweb': 'card', class: 'bui-card' },
})
export class BuiCard {
  readonly headerImage = input<string>();
  readonly headerAlt = input<string>();
  readonly title = input<string>();
}

@Directive({ selector: 'img[buiCardThumbnail]', host: { class: 'bui-card__thumbnail' } })
export class BuiCardThumbnail {}

@Directive({ selector: '[buiCardTitle]', host: { class: 'bui-card__title' } })
export class BuiCardTitle {}

@Directive({ selector: '[buiCardBody]', host: { class: 'bui-card__body' } })
export class BuiCardBody {}

@Directive({ selector: '[buiCardAction]', host: { class: 'bui-card__action' } })
export class BuiCardAction {}
