import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import type { TableColumn, TableRow } from '../table-semantic/table-semantic.component';

/** TableGrid — fiel ao baseui/table-grid (CSS grid; uma única grade para alinhamento de colunas). */
@Component({
  selector: 'bui-table-grid',
  exportAs: 'buiTableGrid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-tg" [style.grid-template-columns]="gridCols()" role="table">
      @for (col of columns(); track col.key) {
        <div class="bui-tg__hc" role="columnheader">{{ col.label }}</div>
      }
      @for (row of data(); track $index) {
        @for (col of columns(); track col.key) {
          <div class="bui-tg__cell" [class.bui-tg__cell--striped]="striped() && $even" role="cell">{{ row[col.key] }}</div>
        }
      }
    </div>
  `,
  styles: `
    .bui-tg { display:grid; border:1px solid var(--bw-border-opaque); border-radius:var(--bw-borders-radius200); overflow:hidden; background:var(--bw-background-primary); }
    .bui-tg__hc { font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); background:var(--bw-background-secondary); padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); white-space:nowrap; position:sticky; top:0; }
    .bui-tg__cell { font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); padding:var(--bw-sizing-scale300) var(--bw-sizing-scale600); border-top:1px solid var(--bw-border-opaque); }
    .bui-tg__cell--striped { background:var(--bw-background-secondary); }
  `,
})
export class TableGrid {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<TableRow[]>([]);
  readonly striped = input(false);
  protected readonly gridCols = computed(() => `repeat(${this.columns().length}, minmax(120px, 1fr))`);
}

const COLS: TableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'product', label: 'Product' },
  { key: 'qty', label: 'Qty' },
  { key: 'price', label: 'Price' },
];
const ROWS: TableRow[] = [
  { id: '001', product: 'Wireless Mouse', qty: 12, price: '$24.00' },
  { id: '002', product: 'Mechanical Keyboard', qty: 5, price: '$89.00' },
  { id: '003', product: 'USB-C Hub', qty: 30, price: '$42.50' },
];

@Component({
  selector: 'bui-s-table-grid', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [TableGrid],
  template: `<div style="width:620px;"><bui-table-grid [columns]="cols" [data]="rows" [striped]="true" /></div>`,
})
export class TableGridScenario {
  protected readonly cols = COLS;
  protected readonly rows = ROWS;
}
