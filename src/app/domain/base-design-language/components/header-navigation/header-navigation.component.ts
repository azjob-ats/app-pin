import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** HeaderNavigation — fiel ao baseui/header-navigation (slots left/center/right). */
@Component({
  selector: 'bui-header-navigation',
  exportAs: 'buiHeaderNavigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-hn__left"><ng-content select="[buiLeft]" /></div>
    <div class="bui-hn__center"><ng-content select="[buiCenter]" /></div>
    <div class="bui-hn__right"><ng-content select="[buiRight]" /></div>
  `,
  styles: `
    bui-header-navigation { display:flex; align-items:center; gap:var(--bw-sizing-scale600); padding:var(--bw-sizing-scale400) var(--bw-sizing-scale700); border-bottom:1px solid var(--bw-border-opaque); }
    .bui-hn__left { display:flex; align-items:center; gap:var(--bw-sizing-scale600); }
    .bui-hn__center { flex:1; display:flex; justify-content:center; gap:var(--bw-sizing-scale500); }
    .bui-hn__right { display:flex; align-items:center; gap:var(--bw-sizing-scale400); }
  `,
})
export class HeaderNavigation {}

@Component({
  selector: 'bui-s-header-navigation', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [HeaderNavigation],
  template: `<div style="width:640px; border:1px solid var(--bw-border-opaque); border-radius:8px;">
    <bui-header-navigation>
      <strong buiLeft style="font:var(--bw-font-LabelLarge)">◆ Brand</strong>
      <a buiCenter href="#" style="color:var(--bw-content-secondary); text-decoration:none">Home</a>
      <a buiCenter href="#" style="color:var(--bw-content-secondary); text-decoration:none">Docs</a>
      <span buiRight class="material-symbols-rounded">account_circle</span>
    </bui-header-navigation>
  </div>`,
})
export class HeaderNavigationScenario {}
