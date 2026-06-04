import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** Card — fiel ao baseui/card (Root + HeaderImage + Title + Contents + Action). */
@Component({
  selector: 'bui-card',
  exportAs: 'buiCard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (headerImage()) { <div class="bui-card__image" [style.background-image]="'url(' + headerImage() + ')'"></div> }
    <div class="bui-card__contents">
      @if (title()) { <div class="bui-card__title">{{ title() }}</div> }
      <div class="bui-card__body"><ng-content /></div>
      <div class="bui-card__action"><ng-content select="[buiAction]" /></div>
    </div>
  `,
  styles: `
    bui-card { display:block; width:280px; border-radius:var(--bw-radius-300); overflow:hidden; background:var(--bw-background-primary); box-shadow:inset 0 0 0 1px var(--bw-border-opaque); }
    .bui-card__image { height:160px; background-size:cover; background-position:center; background-color:var(--bw-background-tertiary); }
    .bui-card__contents { display:flex; flex-direction:column; gap:var(--bw-sizing-scale400); padding:var(--bw-sizing-scale700); }
    .bui-card__title { font:var(--bw-font-HeadingXSmall); color:var(--bw-content-primary); }
    .bui-card__body { font:var(--bw-font-ParagraphMedium); color:var(--bw-content-secondary); }
    .bui-card__action:empty { display:none; }
    .bui-card__action { margin-top:var(--bw-sizing-scale200); }
  `,
})
export class Card {
  readonly title = input<string>('');
  readonly headerImage = input<string>('');
}

@Component({
  selector: 'bui-s-card', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Card],
  template: `<div style="display:flex; gap:16px;">
    <bui-card title="Card title">Texto de apoio do card, com uma breve descrição do conteúdo.</bui-card>
  </div>`,
})
export class CardScenario {}
