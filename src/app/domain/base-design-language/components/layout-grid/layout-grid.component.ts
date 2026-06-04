import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** LayoutGrid — fiel ao baseui/layout-grid (12 colunas responsivas, gutters). */
@Component({
  selector: 'bui-layout-grid',
  exportAs: 'buiLayoutGrid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content select="bui-cell" />',
  styles: `
    bui-layout-grid { display:grid; grid-template-columns:repeat(12, minmax(0,1fr)); gap:var(--bw-sizing-scale600); width:100%; max-width:1136px; margin:0 auto; }
    @media (max-width:1135px) { bui-layout-grid { grid-template-columns:repeat(8, minmax(0,1fr)); } }
    @media (max-width:599px) { bui-layout-grid { grid-template-columns:repeat(4, minmax(0,1fr)); } }
  `,
})
export class LayoutGrid {}

/** Cell — span de colunas (1–12). */
@Component({
  selector: 'bui-cell',
  exportAs: 'buiCell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-cell { grid-column: span min(var(--bui-span,12), 12); min-width:0; }`,
  host: { '[style.--bui-span]': 'span()' },
})
export class Cell {
  readonly span = input<number>(12);
}

@Component({
  selector: 'bui-s-layout-grid', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [LayoutGrid, Cell],
  template: `<bui-layout-grid>
    @for (i of [1,2,3,4,5,6]; track i) {
      <bui-cell [span]="2"><div style="background:var(--bw-background-secondary); padding:16px; text-align:center; border-radius:8px;">span 2</div></bui-cell>
    }
    <bui-cell [span]="6"><div style="background:var(--bw-background-secondary); padding:16px; text-align:center; border-radius:8px;">span 6</div></bui-cell>
    <bui-cell [span]="6"><div style="background:var(--bw-background-secondary); padding:16px; text-align:center; border-radius:8px;">span 6</div></bui-cell>
  </bui-layout-grid>`,
})
export class LayoutGridScenario {}
