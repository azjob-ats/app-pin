import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export interface TableColumn { key: string; label: string; }
export type TableRow = Record<string, string | number>;

/** TableSemantic — fiel ao baseui/table-semantic (builder; elementos <table> semânticos). */
@Component({
  selector: 'bui-table-semantic',
  exportAs: 'buiTableSemantic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-tsem" [class.bui-tsem--borderless]="borderless()">
      <table class="bui-tsem__table">
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              <th class="bui-tsem__th" scope="col">{{ col.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr class="bui-tsem__tr" [class.bui-tsem__tr--striped]="striped() && $even">
              @for (col of columns(); track col.key) {
                <td class="bui-tsem__td">{{ row[col.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .bui-tsem { border:1px solid var(--bw-border-opaque); border-radius:var(--bw-borders-radius200); overflow:hidden; background:var(--bw-background-primary); }
    .bui-tsem--borderless { border:none; }
    .bui-tsem__table { width:100%; border-collapse:collapse; }
    .bui-tsem__th { text-align:left; font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); background:var(--bw-background-secondary); padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); white-space:nowrap; }
    .bui-tsem__td { font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); padding:var(--bw-sizing-scale300) var(--bw-sizing-scale600); border-top:1px solid var(--bw-border-opaque); }
    .bui-tsem--borderless .bui-tsem__td { border-top:none; }
    .bui-tsem__tr--striped { background:var(--bw-background-secondary); }
  `,
})
export class TableSemantic {
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
  { name: 'Yuki Tanaka', role: 'Researcher', city: 'Tokyo' },
];

@Component({
  selector: 'bui-s-table-semantic', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [TableSemantic],
  template: `<div style="width:560px;"><bui-table-semantic [columns]="cols" [data]="rows" [striped]="true" /></div>`,
})
export class TableSemanticScenario {
  protected readonly cols = COLS;
  protected readonly rows = ROWS;
}
