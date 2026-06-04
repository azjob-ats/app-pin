import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';
import type { TableColumn, TableRow } from '../table-semantic/table-semantic.component';

export interface DataTableColumn extends TableColumn { numeric?: boolean; sortable?: boolean; }
type SortDir = 'ASC' | 'DESC' | null;

/** DataTable — fiel ao baseui/data-table (colunas ordenáveis, indicador de sort, células medindo). */
@Component({
  selector: 'bui-data-table',
  exportAs: 'buiDataTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-dt" role="grid">
      <div class="bui-dt__head" role="row">
        @for (col of columns(); track col.key) {
          <button
            type="button"
            class="bui-dt__hc"
            [class.bui-dt__hc--num]="col.numeric"
            [class.bui-dt__hc--sortable]="col.sortable !== false"
            role="columnheader"
            [attr.aria-sort]="ariaSort(col)"
            (click)="sort(col)"
          >
            <span>{{ col.label }}</span>
            @if (sortKey() === col.key) {
              <span class="material-symbols-rounded bui-dt__sort">{{ dir() === 'ASC' ? 'arrow_upward' : 'arrow_downward' }}</span>
            }
          </button>
        }
      </div>
      <div class="bui-dt__body">
        @for (row of sorted(); track $index) {
          <div class="bui-dt__row" role="row">
            @for (col of columns(); track col.key) {
              <div class="bui-dt__cell" [class.bui-dt__cell--num]="col.numeric" role="gridcell">{{ row[col.key] }}</div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .bui-dt { display:flex; flex-direction:column; border:1px solid var(--bw-border-opaque); border-radius:var(--bw-borders-radius200); overflow:hidden; background:var(--bw-background-primary); }
    .bui-dt__head { display:flex; background:var(--bw-background-secondary); border-bottom:1px solid var(--bw-border-opaque); }
    .bui-dt__hc { flex:1; display:flex; align-items:center; gap:4px; font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); background:transparent; border:none; padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); text-align:left; white-space:nowrap; }
    .bui-dt__hc--sortable { cursor:pointer; }
    .bui-dt__hc--sortable:hover { background:var(--bw-background-tertiary); }
    .bui-dt__hc--num { justify-content:flex-end; text-align:right; }
    .bui-dt__sort { font-size:16px; color:var(--bw-content-secondary); }
    .bui-dt__row { display:flex; }
    .bui-dt__row:not(:first-child) { border-top:1px solid var(--bw-border-opaque); }
    .bui-dt__row:hover { background:var(--bw-background-secondary); }
    .bui-dt__cell { flex:1; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); padding:var(--bw-sizing-scale300) var(--bw-sizing-scale600); }
    .bui-dt__cell--num { text-align:right; font-variant-numeric:tabular-nums; }
  `,
})
export class DataTable {
  readonly columns = input<DataTableColumn[]>([]);
  readonly data = input<TableRow[]>([]);

  protected readonly sortKey = signal<string | null>(null);
  protected readonly dir = signal<SortDir>(null);

  protected readonly sorted = computed<TableRow[]>(() => {
    const key = this.sortKey(), d = this.dir();
    if (!key || !d) return this.data();
    const factor = d === 'ASC' ? 1 : -1;
    return [...this.data()].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv)) * factor;
    });
  });

  protected sort(col: DataTableColumn): void {
    if (col.sortable === false) return;
    if (this.sortKey() !== col.key) { this.sortKey.set(col.key); this.dir.set('ASC'); return; }
    this.dir.update((d) => (d === 'ASC' ? 'DESC' : d === 'DESC' ? null : 'ASC'));
    if (this.dir() === null) this.sortKey.set(null);
  }
  protected ariaSort(col: DataTableColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== col.key || !this.dir()) return 'none';
    return this.dir() === 'ASC' ? 'ascending' : 'descending';
  }
}

const COLS: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'salary', label: 'Salary', numeric: true },
];
const ROWS: TableRow[] = [
  { name: 'Sarah Brown', role: 'Engineer', salary: 145000 },
  { name: 'Marcus Lee', role: 'Designer', salary: 118000 },
  { name: 'Ana Costa', role: 'Product Manager', salary: 162000 },
  { name: 'Yuki Tanaka', role: 'Researcher', salary: 134000 },
];

@Component({
  selector: 'bui-s-data-table', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [DataTable],
  template: `<div style="width:600px;"><bui-data-table [columns]="cols" [data]="rows" /></div>`,
})
export class DataTableScenario {
  protected readonly cols = COLS;
  protected readonly rows = ROWS;
}
