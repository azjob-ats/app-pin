import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** AspectRatioBox — fiel ao baseui/aspect-ratio-box (mantém proporção do conteúdo). */
@Component({
  selector: 'bui-aspect-ratio-box',
  exportAs: 'buiAspectRatioBox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<div class="bui-arb__inner"><ng-content /></div>',
  styles: `
    bui-aspect-ratio-box { display:block; position:relative; width:100%; aspect-ratio: var(--bui-arb, 1); }
    .bui-arb__inner { position:absolute; inset:0; display:flex; }
    .bui-arb__inner > * { width:100%; height:100%; }
  `,
  host: { '[style.--bui-arb]': 'aspectRatio()' },
})
export class AspectRatioBox {
  /** Razão largura/altura (ex.: 16/9). */
  readonly aspectRatio = input<number>(1);
}

@Component({
  selector: 'bui-s-arb', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [AspectRatioBox],
  template: `<div style="display:flex; gap:16px; width:480px;">
    <div style="flex:1"><bui-aspect-ratio-box [aspectRatio]="1"><div style="background:var(--bw-background-secondary); display:flex; align-items:center; justify-content:center;">1:1</div></bui-aspect-ratio-box></div>
    <div style="flex:1"><bui-aspect-ratio-box [aspectRatio]="16/9"><div style="background:var(--bw-background-secondary); display:flex; align-items:center; justify-content:center;">16:9</div></bui-aspect-ratio-box></div>
  </div>`,
})
export class AspectRatioBoxScenario {}
