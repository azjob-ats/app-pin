import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** ButtonDock — fiel ao baseui/button-dock (barra de ações ancorada). */
@Component({
  selector: 'bui-button-dock',
  exportAs: 'buiButtonDock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-dock__primary"><ng-content select="[buiPrimary]" /></div>
    <div class="bui-dock__secondary"><ng-content select="[buiSecondary]" /></div>
  `,
  styles: `
    bui-button-dock { display:flex; flex-direction:column; gap:var(--bw-sizing-scale400); padding:var(--bw-sizing-scale600); border-top:1px solid var(--bw-border-opaque); background:var(--bw-background-primary); }
    .bui-dock__primary { display:flex; gap:var(--bw-sizing-scale400); }
    .bui-dock__primary > * { flex:1; }
    .bui-dock__secondary { display:flex; justify-content:center; gap:var(--bw-sizing-scale400); &:empty { display:none; } }
  `,
})
export class ButtonDock {}

@Component({
  selector: 'bui-s-button-dock', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [ButtonDock],
  template: `<div style="width:360px; border:1px solid var(--bw-border-opaque); border-radius:8px; overflow:hidden;">
    <bui-button-dock>
      <button buiPrimary style="padding:12px; border:none; border-radius:8px; background:var(--bw-button-primary-fill); color:var(--bw-button-primary-text); cursor:pointer">Continue</button>
      <a buiSecondary href="#" style="color:var(--bw-content-accent); text-decoration:none; align-self:center">Skip for now</a>
    </bui-button-dock>
  </div>`,
})
export class ButtonDockScenario {}
