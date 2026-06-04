import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** ListItem — fiel ao baseui/list (artwork + conteúdo + endEnhancer, divisória inferior). */
@Component({
  selector: 'bui-list-item',
  exportAs: 'buiListItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="bui-li__artwork"><ng-content select="[buiArtwork]" /></span>
    <span class="bui-li__content"><ng-content /></span>
    <span class="bui-li__end"><ng-content select="[buiEndEnhancer]" /></span>
  `,
  styles: `
    bui-list-item { display:flex; align-items:center; gap:var(--bw-sizing-scale500); min-height:var(--bw-sizing-scale1600); padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); border-bottom:1px solid var(--bw-border-opaque); background:var(--bw-background-primary); }
    .bui-li__artwork { display:inline-flex; align-items:center; color:var(--bw-content-secondary); &:empty { display:none; } }
    .bui-li__content { flex:1; min-width:0; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    .bui-li__end { display:inline-flex; align-items:center; color:var(--bw-content-secondary); &:empty { display:none; } }
  `,
})
export class ListItem {}

@Component({
  selector: 'bui-s-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [ListItem],
  template: `<div style="width:420px; border:1px solid var(--bw-border-opaque); border-radius:8px; overflow:hidden;">
    <bui-list-item><span buiArtwork class="material-symbols-rounded">person</span>Ada Lovelace<span buiEndEnhancer class="material-symbols-rounded">chevron_right</span></bui-list-item>
    <bui-list-item><span buiArtwork class="material-symbols-rounded">person</span>Grace Hopper<span buiEndEnhancer class="material-symbols-rounded">chevron_right</span></bui-list-item>
    <bui-list-item><span buiArtwork class="material-symbols-rounded">person</span>Alan Turing<span buiEndEnhancer class="material-symbols-rounded">chevron_right</span></bui-list-item>
  </div>`,
})
export class ListScenario {}
