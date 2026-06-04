import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** FlexGrid — fiel ao baseui/flex-grid (grid via flexbox; nº de colunas). */
@Component({
  selector: 'bui-flex-grid',
  exportAs: 'buiFlexGrid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content select="bui-flex-grid-item" />',
  styles: `bui-flex-grid { display:flex; flex-wrap:wrap; gap:var(--bui-fg-gap, var(--bw-sizing-scale600)); }`,
  host: { '[style.--bui-fg-cols]': 'columns()' },
})
export class FlexGrid {
  readonly columns = input<number>(2);
}

@Component({
  selector: 'bui-flex-grid-item',
  exportAs: 'buiFlexGridItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-flex-grid-item { flex:1 1 calc((100% - (var(--bui-fg-cols,2) - 1) * var(--bw-sizing-scale600)) / var(--bui-fg-cols,2)); min-width:0; }`,
})
export class FlexGridItem {}

@Component({
  selector: 'bui-s-flex-grid', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FlexGrid, FlexGridItem],
  template: `<bui-flex-grid [columns]="3" style="--bui-fg-cols:3">
    @for (i of [1,2,3,4,5,6]; track i) {
      <bui-flex-grid-item><div style="background:var(--bw-background-secondary); padding:24px; text-align:center; border-radius:8px;">Item {{ i }}</div></bui-flex-grid-item>
    }
  </bui-flex-grid>`,
})
export class FlexGridScenario {}
