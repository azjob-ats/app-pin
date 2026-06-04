import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import type { TableColumn, TableRow } from '../table-semantic/table-semantic.component';

/** Table (Flex) — fiel ao baseui/table (linhas em flexbox, divs com role de tabela). */
@Component({
  selector: 'bui-table',
  exportAs: 'buiTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-tbl" [class.bui-tbl--borderless]="borderless()" role="table">
      <div class="bui-tbl__head" role="row">
        @for (col of columns(); track col.key) {
          <div class="bui-tbl__hc" role="columnheader">{{ col.label }}</div>
        }
      </div>
      <div class="bui-tbl__body">
        @for (row of data(); track $index) {
          <div class="bui-tbl__row" [class.bui-tbl__row--striped]="striped() && $even" role="row">
            @for (col of columns(); track col.key) {
              <div class="bui-tbl__cell" role="cell">{{ row[col.key] }}</div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .bui-tbl { display:flex; flex-direction:column; border:1px solid var(--bw-border-opaque); border-radius:var(--bw-borders-radius200); overflow:hidden; background:var(--bw-background-primary); }
    .bui-tbl--borderless { border:none; }
    .bui-tbl__head { display:flex; background:var(--bw-background-secondary); }
    .bui-tbl__hc { flex:1; font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); white-space:nowrap; }
    .bui-tbl__row { display:flex; }
    .bui-tbl__row:not(:first-child) { border-top:1px solid var(--bw-border-opaque); }
    .bui-tbl--borderless .bui-tbl__row { border-top:none; }
    .bui-tbl__row--striped { background:var(--bw-background-secondary); }
    .bui-tbl__cell { flex:1; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); padding:var(--bw-sizing-scale300) var(--bw-sizing-scale600); }
  `,
})
export class Table {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<TableRow[]>([]);
  readonly striped = input(false);
  readonly borderless = input(false);
}

const COLS: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'city', label: 'City' },
];
const ROWS: TableRow[] = [
  { name: 'Sarah Brown', role: 'Engineer', city: 'San Francisco' },
  { name: 'Marcus Lee', role: 'Designer', city: 'New York' },
  { name: 'Ana Costa', role: 'Product Manager', city: 'São Paulo' },
];

@Component({
  selector: 'bui-s-table', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Table],
  template: `<div style="width:560px;"><bui-table [columns]="cols" [data]="rows" /></div>`,
})
export class TableScenario {
  protected readonly cols = COLS;
  protected readonly rows = ROWS;
}
