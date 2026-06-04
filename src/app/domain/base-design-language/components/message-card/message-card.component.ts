import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** MessageCard — fiel ao baseui/message-card (imagem + título + parágrafo + ação). */
@Component({
  selector: 'bui-message-card',
  exportAs: 'buiMessageCard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (image()) { <div class="bui-mc__image" [style.background-image]="'url(' + image() + ')'"></div> }
    <div class="bui-mc__content">
      <div class="bui-mc__heading">{{ heading() }}</div>
      <p class="bui-mc__paragraph">{{ paragraph() }}</p>
      <div class="bui-mc__action"><ng-content /></div>
    </div>
  `,
  styles: `
    bui-message-card { display:flex; flex-direction:column; width:280px; border-radius:var(--bw-radius-300); overflow:hidden; background:var(--bw-background-primary); box-shadow:inset 0 0 0 1px var(--bw-border-opaque); cursor:pointer; }
    bui-message-card[data-bg="dark"] { background:var(--bw-background-inverse-primary); color:var(--bw-content-inverse-primary); }
    .bui-mc__image { height:140px; background-size:cover; background-position:center; background-color:var(--bw-background-tertiary); }
    .bui-mc__content { display:flex; flex-direction:column; gap:var(--bw-sizing-scale300); padding:var(--bw-sizing-scale600); }
    .bui-mc__heading { font:var(--bw-font-HeadingXSmall); }
    .bui-mc__paragraph { margin:0; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-secondary); }
    bui-message-card[data-bg="dark"] .bui-mc__paragraph { color:var(--bw-content-inverse-secondary); }
    .bui-mc__action:empty { display:none; }
  `,
  host: { '[attr.data-bg]': 'backgroundColor()' },
})
export class MessageCard {
  readonly heading = input.required<string>();
  readonly paragraph = input<string>('');
  readonly image = input<string>('');
  readonly backgroundColor = input<'light' | 'dark'>('light');
}

@Component({
  selector: 'bui-s-message-card', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [MessageCard],
  template: `<div style="display:flex; gap:16px;">
    <bui-message-card heading="Novidade" paragraph="Conheça o novo recurso do Design System." />
    <bui-message-card heading="Dark card" paragraph="Versão em fundo escuro." backgroundColor="dark" />
  </div>`,
})
export class MessageCardScenario {}
