import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import {
  AnchorColumn,
  BatchAction,
  BooleanColumn,
  CategoricalColumn,
  ColumnDef,
  CustomColumn,
  DataTableControlRef,
  DatetimeColumn,
  FilterParams,
  NUMERICAL_FORMATS,
  NumericalColumn,
  Row,
  RowAction,
  RowIndexColumn,
  SORT_DIRECTIONS,
  SortDirection,
  StringColumn,
} from './data-table.columns';
import { BuiDataTable, BuiStatefulDataTable } from './data-table.component';

/* ── Shared animal data (subset of AnimalData) ── */
const ANIMAL_DATA = [
  { Name: 'Spotted Hyena', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Mammalia', Order: 'Carnivora', Family: 'Hyaenidae' },
  { Name: 'Woolly mammoth', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Mammalia', Order: 'Proboscidea', Family: 'Elephantidae' },
  { Name: 'Giant Panda', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Mammalia', Order: 'Carnivora', Family: 'Ursidae' },
  { Name: 'Amur Tiger', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Mammalia', Order: 'Carnivora', Family: 'Felidae' },
  { Name: 'Emperor Penguin', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Aves', Order: 'Sphenisciformes', Family: 'Spheniscidae' },
  { Name: 'Blue Whale', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Mammalia', Order: 'Artiodactyla', Family: 'Balaenopteridae' },
  { Name: 'Komodo Dragon', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Reptilia', Order: 'Squamata', Family: 'Varanidae' },
  { Name: 'Golden Eagle', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Aves', Order: 'Accipitriformes', Family: 'Accipitridae' },
  { Name: 'Leafcutter Ant', Kingdom: 'Animalia', Phylum: 'Arthropoda', Class: 'Insecta', Order: 'Hymenoptera', Family: 'Formicidae' },
  { Name: 'Great White Shark', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Chondrichthyes', Order: 'Lamniformes', Family: 'Lamnidae' },
  { Name: 'African Elephant', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Mammalia', Order: 'Proboscidea', Family: 'Elephantidae' },
  { Name: 'Nile Crocodile', Kingdom: 'Animalia', Phylum: 'Chordata', Class: 'Reptilia', Order: 'Crocodilia', Family: 'Crocodylidae' },
].map((d) => ({ id: d.Name, data: d }));

/* ── Shared movie rows ── */
const MOVIE_ROWS: Row[] = [
  ['Avatar', 'Action', 237, 2784, 11.7, 8.0],
  ['The Blind Side', 'Drama', 29, 309, 10.7, 7.6],
  ['The Dark Knight', 'Action', 185, 1005, 5.4, 9.0],
  ['Finding Nemo', 'Adventure', 94, 940, 10.0, 8.1],
  ['Ghostbusters', 'Comedy', 144, 229, 1.6, 7.8],
  ['Jurassic Park', 'Action', 53, 1030, 19.4, 8.0],
  ['The Lion King', 'Adventure', 115, 577, 5.0, 8.0],
  ['Titanic', 'Thriller/Suspense', 200, 2187, 10.9, 7.6],
  ['Up', 'Adventure', 175, 735, 4.2, 8.3],
  ['Zookeeper', 'Romantic Comedy', 80, 170, 2.1, 5.0],
].map((r, i) => ({ id: i + 1, data: r }));

function makeAnimalCols(): ColumnDef[] {
  return [
    StringColumn({ title: 'Name', minWidth: 200, mapDataToValue: (d: any) => d.Name }),
    CategoricalColumn({ title: 'Kingdom', mapDataToValue: (d: any) => d.Kingdom }),
    CategoricalColumn({ title: 'Phylum', minWidth: 90, mapDataToValue: (d: any) => d.Phylum }),
    CategoricalColumn({ title: 'Class', minWidth: 120, mapDataToValue: (d: any) => d.Class }),
    CategoricalColumn({ title: 'Order', mapDataToValue: (d: any) => d.Order }),
    CategoricalColumn({ title: 'Family', mapDataToValue: (d: any) => d.Family }),
  ];
}

/* ─── 1. DataTable (default) ─────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:800px;width:900px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableScenario {
  readonly columns: ColumnDef[] = [
    CategoricalColumn({ title: 'categorical', mapDataToValue: (d: any) => d[0] }),
    NumericalColumn({ title: 'numerical', minWidth: 90, mapDataToValue: (d: any) => d[1] }),
    NumericalColumn({ title: 'neg std', highlight: (n) => n < 0, minWidth: 90, mapDataToValue: (d: any) => d[2] }),
    NumericalColumn({ title: 'accounting', format: NUMERICAL_FORMATS.ACCOUNTING, minWidth: 120, mapDataToValue: (d: any) => d[3] }),
    NumericalColumn({ title: 'percent', format: NUMERICAL_FORMATS.PERCENTAGE, minWidth: 120, mapDataToValue: (d: any) => d[4] }),
    DatetimeColumn({ title: 'datetime', mapDataToValue: (d: any) => d[5] }),
    CustomColumn({ title: 'custom color', sortable: true, filterable: false, minWidth: 120, mapDataToValue: (d: any) => d[6], formatCell: (v: any) => v?.color ?? '' }),
    StringColumn({ title: 'string', minWidth: 148, mapDataToValue: (d: any) => d[7] }),
    BooleanColumn({ title: 'boolean', mapDataToValue: (d: any) => d[8] }),
    CategoricalColumn({ title: 'second category', mapDataToValue: (d: any) => d[9] }),
    AnchorColumn({ title: 'anchor', mapDataToValue: (d: any) => d[10] }),
  ];
  readonly rows: Row[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    data: [
      ['A','B','C','D','F'][i % 5],
      ((i % 2 ? i - 1 : i + 3) * 99999) / 100,
      ((i % 2 ? -(i - 1) : i + 3) * 99999) / 100,
      ((i % 2 ? i - 1 : i + 3) * 99999) / 100,
      ((i % 2 ? i - 1 : i + 3) * 99999) / 100,
      new Date('2011-04-11T10:20:30Z'),
      { color: ['red','green','blue','purple'][i % 4] },
      `str-${i}`,
      i % 2 === 0,
      ['X','Y','Z'][i % 3],
      { content: 'link', href: 'https://example.com' },
    ],
  }));
}

/* ─── 2. AddRemoveColumns ────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-add-remove-columns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <button (click)="addColumn()">Add Column</button>
      <button (click)="removeColumn()">Remove Column</button>
      <div style="height:400px;width:900px;margin-top:8px">
        <bui-stateful-data-table [resizableColumnWidths]="true" [columns]="columns()" [rows]="rows" />
      </div>
    </div>
  `,
})
export class DataTableAddRemoveColumnsScenario {
  protected readonly columns = signal<ColumnDef[]>([
    BooleanColumn({ title: '0', mapDataToValue: () => true }),
    BooleanColumn({ title: '1', mapDataToValue: () => true }),
  ]);
  readonly rows: Row[] = Array.from({ length: 5 }, (_, i) => ({ id: i, data: {} }));

  protected addColumn(): void {
    this.columns.update((cols) => [
      ...cols,
      BooleanColumn({ title: String(cols.length), mapDataToValue: () => true }),
    ]);
  }

  protected removeColumn(): void {
    this.columns.update((cols) => cols.slice(0, -1));
  }
}

/* ─── 3. BatchAction ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-batch-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <div style="height:400px;width:900px">
        <bui-stateful-data-table
          [columns]="columns"
          [rows]="rows()"
          [batchActions]="batchActions"
          [onSelectionChangeCb]="onSelectionChange"
        />
      </div>
      <p id="selection-change-count">selection change count: {{ count() }}</p>
    </div>
  `,
})
export class DataTableBatchActionScenario {
  readonly columns: ColumnDef[] = [
    NumericalColumn({ title: 'row-id', mapDataToValue: (d: any) => d[0] }),
    BooleanColumn({ title: 'is-it-flagged', mapDataToValue: (d: any) => d[1] }),
  ];
  protected readonly rows = signal<Row[]>([
    { id: 1, data: [1, false] }, { id: 2, data: [2, false] }, { id: 3, data: [3, false] },
    { id: 4, data: [4, false] }, { id: 5, data: [5, false] },
  ]);
  protected readonly count = signal(0);

  readonly onSelectionChange = () => this.count.update((c) => c + 1);

  readonly batchActions: BatchAction[] = [
    {
      label: 'Flag',
      onClick: ({ selection, clearSelection }) => {
        const ids = new Set(selection.map((r) => r.id));
        this.rows.update((rs) => rs.map((r) => ids.has(r.id) ? { ...r, data: [(r.data as any[])[0], true] } : r));
        clearSelection();
      },
    },
    {
      label: 'Remove',
      onClick: ({ selection, clearSelection }) => {
        const ids = new Set(selection.map((r) => r.id));
        this.rows.update((rs) => rs.filter((r) => !ids.has(r.id)));
        clearSelection();
      },
    },
  ];
}

/* ─── 4. CategoricalColumn ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-categorical-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:1000px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableCategoricalColumnScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 5. CellIndices ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-cell-indices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableCellIndicesScenario {
  readonly columns: ColumnDef[] = Array.from({ length: 4 }, (_, ci) =>
    StringColumn({
      title: `col-${ci}`,
      mapDataToValue: (d: any) => String(d[ci]),
    })
  );
  readonly rows: Row[] = Array.from({ length: 10 }, (_, ri) => ({
    id: ri,
    data: Array.from({ length: 4 }, (_, ci) => `(${ri},${ci})`),
  }));
}

/* ─── 6. CollectionOfObjects ─────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-collection-of-objects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableCollectionOfObjectsScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Name', minWidth: 200, mapDataToValue: (d: any) => d.name }),
    NumericalColumn({ title: 'Age', mapDataToValue: (d: any) => d.age }),
    BooleanColumn({ title: 'Active', mapDataToValue: (d: any) => d.active }),
  ];
  readonly rows: Row[] = [
    { id: 1, data: { name: 'Alice', age: 30, active: true } },
    { id: 2, data: { name: 'Bob', age: 25, active: false } },
    { id: 3, data: { name: 'Carol', age: 35, active: true } },
    { id: 4, data: { name: 'Dave', age: 28, active: true } },
  ];
}

/* ─── 7. ColumnWidthResize ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-column-width-resize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [resizableColumnWidths]="true" />
    </div>
  `,
})
export class DataTableColumnWidthResizeScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 8. ColumnsNotSortable ──────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-columns-not-sortable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableColumnsNotSortableScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Name', sortable: false, mapDataToValue: (d: any) => d.Name }),
    CategoricalColumn({ title: 'Kingdom', sortable: false, mapDataToValue: (d: any) => d.Kingdom }),
    CategoricalColumn({ title: 'Class', sortable: false, mapDataToValue: (d: any) => d.Class }),
  ];
  readonly rows = ANIMAL_DATA;
}

/* ─── 9. Columns ─────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-columns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:1000px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableColumnsScenario {
  readonly columns: ColumnDef[] = [
    BooleanColumn({ title: 'boolean-column', mapDataToValue: (d: any) => d[0] }),
    CategoricalColumn({ title: 'categorical-column', mapDataToValue: (d: any) => d[1] }),
    NumericalColumn({ title: 'numerical-column', mapDataToValue: (d: any) => d[2] }),
    StringColumn({ title: 'string-column', mapDataToValue: (d: any) => d[3] }),
    DatetimeColumn({ title: 'datetime-column', mapDataToValue: (d: any) => d[4] }),
  ];
  readonly rows: Row[] = [
    { id: 1, data: [true, 'A', 2, 'one', new Date('2012-05-11T10:20:30')] },
    { id: 2, data: [false, 'B', 1, 'two', new Date('2011-04-12T11:21:31')] },
    { id: 3, data: [true, 'A', 4, 'three', new Date('2014-07-13T12:22:32')] },
    { id: 4, data: [false, 'A', 3, 'four', new Date('2013-06-14T13:23:33')] },
  ];
}

/* ─── 10. DatetimeColumn ─────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-datetime-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableDatetimeColumnScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Name', mapDataToValue: (d: any) => d[0] }),
    DatetimeColumn({ title: 'created', mapDataToValue: (d: any) => d[1] }),
    DatetimeColumn({ title: 'updated', mapDataToValue: (d: any) => d[2] }),
  ];
  readonly rows: Row[] = [
    { id: 1, data: ['Alice', new Date('2020-01-01'), new Date('2021-06-15')] },
    { id: 2, data: ['Bob', new Date('2019-05-20'), new Date('2022-03-10')] },
    { id: 3, data: ['Carol', new Date('2021-08-30'), new Date('2023-01-01')] },
  ];
}

/* ─── 11. Empty ──────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:400px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableEmptyScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Name', mapDataToValue: (d: any) => d }),
    CategoricalColumn({ title: 'Category', mapDataToValue: (d: any) => d }),
  ];
  readonly rows: Row[] = [];
}

/* ─── 12. ExtractedFilters ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-extracted-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDataTable],
  template: `
    <div style="display:flex;gap:16px">
      <div style="min-width:200px">
        <h4 style="margin:0 0 8px;font-size:13px">Active Filters</h4>
        @for (entry of filterEntries(); track entry[0]) {
          <div style="margin-bottom:4px;font-size:12px">
            {{ entry[0] }}: {{ entry[1].description }}
            <button (click)="removeFilter(entry[0])">×</button>
          </div>
        }
      </div>
      <div style="flex:1;height:600px">
        <bui-data-table
          [columns]="columns"
          [rows]="rows"
          [filters]="filters()"
          [sortIndex]="sortIndex()"
          [sortDirection]="sortDirection()"
          (sort)="onSort($event)"
          (filterAdd)="onFilterAdd($event)"
          (filterRemove)="onFilterRemove($event)"
        />
      </div>
    </div>
  `,
})
export class DataTableExtractedFiltersScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;

  protected readonly filters = signal<Map<string, FilterParams>>(new Map());
  protected readonly filterEntries = computed(() => [...this.filters().entries()]);
  protected readonly sortIndex = signal(-1);
  protected readonly sortDirection = signal<SortDirection | null>(null);

  protected removeFilter(title: string): void {
    this.filters.update((m) => { const n = new Map(m); n.delete(title); return n; });
  }

  protected onSort(event: { columnIndex: number }): void {
    const ci = event.columnIndex;
    const curIdx = this.sortIndex();
    const curDir = this.sortDirection();
    if (ci === curIdx) {
      if (curDir === SORT_DIRECTIONS.ASC) { this.sortDirection.set(SORT_DIRECTIONS.DESC); }
      else { this.sortIndex.set(-1); this.sortDirection.set(null); }
    } else {
      this.sortIndex.set(ci); this.sortDirection.set(SORT_DIRECTIONS.ASC);
    }
  }

  protected onFilterAdd(event: { title: string; params: FilterParams }): void {
    this.filters.update((m) => { const n = new Map(m); n.set(event.title, event.params); return n; });
  }

  protected onFilterRemove(event: { title: string }): void {
    this.removeFilter(event.title);
  }
}

/* ─── 13. ExtractedHighlight ─────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-extracted-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <p style="font-size:13px;color:#555">Use J/K keys to navigate rows, O to toggle selected.</p>
      <div style="height:600px;width:700px">
        <bui-stateful-data-table
          [columns]="columns"
          [rows]="rows()"
          [rowHighlightIndex]="highlightIndex()"
          [onRowHighlightChangeCb]="onRowHighlightChange"
        />
      </div>
    </div>
  `,
  host: { '(keydown)': 'onKey($event)', tabindex: '0' },
})
export class DataTableExtractedHighlightScenario {
  readonly columns = makeAnimalCols();
  protected readonly rows = signal(ANIMAL_DATA.map((r) => ({ ...r, data: { ...r.data as object, isSelected: false } })));
  protected readonly highlightIndex = signal(-1);
  private _highlightedRow: Row | null = null;

  readonly onRowHighlightChange = (rowIndex: number, row: Row) => {
    this.highlightIndex.set(rowIndex);
    this._highlightedRow = row;
  };

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'j') this.highlightIndex.update((h) => Math.min(h + 1, this.rows().length));
    if (event.key === 'k') this.highlightIndex.update((h) => Math.max(h - 1, 0));
  }
}

/* ─── 14. FullWindow ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-full-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:100vh;width:100vw">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [tableHeight]="600" />
    </div>
  `,
})
export class DataTableFullWindowScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 15. GetRows ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-get-rows',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <button (click)="logRows()">Log filtered and sorted records to console</button>
      <div style="height:800px;width:900px;margin-top:8px">
        <bui-stateful-data-table [columns]="columns" [rows]="rows" [controlRef]="controlRef" />
      </div>
    </div>
  `,
})
export class DataTableGetRowsScenario {
  readonly columns: ColumnDef[] = [
    BooleanColumn({ title: 'boolean', mapDataToValue: (d: any) => d[0] }),
    CategoricalColumn({ title: 'color', mapDataToValue: (d: any) => d[1] }),
    NumericalColumn({ title: 'number', mapDataToValue: (d: any) => d[2] }),
    StringColumn({ title: 'description', mapDataToValue: (d: any) => d[3] }),
  ];
  readonly rows: Row[] = [
    { id: 1, data: [true, 'green', 2, 'bright'] }, { id: 2, data: [false, 'blue', 1, 'glossy'] },
    { id: 3, data: [true, 'black', 4, 'dry'] }, { id: 4, data: [false, 'pink', 3, 'brittle'] },
  ];
  readonly controlRef: DataTableControlRef = { clearSelection: () => {}, getRows: () => [] };

  protected logRows(): void {
    console.log(this.controlRef.getRows());
  }
}

/* ─── 16. ImperativeClearSelection ──────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-imperative-clear-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:400px;width:900px">
      <bui-stateful-data-table
        [columns]="columns"
        [rows]="rows()"
        [batchActions]="batchActions"
        [rowActions]="rowActions"
        [controlRef]="controlRef"
      />
    </div>
  `,
})
export class DataTableImperativeClearSelectionScenario {
  readonly columns: ColumnDef[] = [
    NumericalColumn({ title: 'row-id', mapDataToValue: (d: any) => d }),
    NumericalColumn({ title: 'filler', mapDataToValue: (d: any) => d }),
  ];
  protected readonly rows = signal<Row[]>([
    { id: 1, data: 1 }, { id: 2, data: 2 }, { id: 3, data: 3 },
    { id: 4, data: 4 }, { id: 5, data: 5 },
  ]);
  readonly controlRef: DataTableControlRef = { clearSelection: () => {}, getRows: () => [] };

  readonly batchActions: BatchAction[] = [{
    label: 'Remove selected rows',
    onClick: ({ selection, clearSelection }) => {
      const ids = new Set(selection.map((r) => r.id));
      this.rows.update((rs) => rs.filter((r) => !ids.has(r.id)));
      clearSelection();
    },
  }];

  readonly rowActions: RowAction[] = [{
    label: 'Remove row',
    onClick: ({ row }) => {
      this.rows.update((rs) => rs.filter((r) => r.id !== row.id));
      this.controlRef.clearSelection();
    },
  }];
}

/* ─── 17. IncludedRowsChange ─────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-included-rows-change',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <p style="font-size:13px">Visible rows: {{ visibleCount() }}</p>
      <div style="height:600px;width:700px">
        <bui-stateful-data-table
          [columns]="columns"
          [rows]="rows"
          [onIncludedRowsChangeCb]="onIncludedRowsChange"
        />
      </div>
    </div>
  `,
})
export class DataTableIncludedRowsChangeScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
  protected readonly visibleCount = signal(ANIMAL_DATA.length);

  readonly onIncludedRowsChange = (rows: Row[]) => this.visibleCount.set(rows.length);
}

/* ─── 18. InitialFilters ─────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-initial-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table
        [columns]="columns"
        [rows]="rows"
        [initialFilters]="initialFilters"
      />
    </div>
  `,
})
export class DataTableInitialFiltersScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
  readonly initialFilters = new Map<string, FilterParams>([
    ['Class', { selection: new Set(['Mammalia']), exclude: false, description: 'Mammalia' } as any],
  ]);
}

/* ─── 19. InitialSelectedRows ────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-initial-selected-rows',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:400px;width:700px">
      <bui-stateful-data-table
        [columns]="columns"
        [rows]="rows"
        [batchActions]="batchActions"
        [initialSelectedRowIds]="selectedIds"
      />
    </div>
  `,
})
export class DataTableInitialSelectedRowsScenario {
  readonly columns: ColumnDef[] = [
    NumericalColumn({ title: 'id', mapDataToValue: (d: any) => d }),
    StringColumn({ title: 'label', mapDataToValue: (d: any) => `item-${d}` }),
  ];
  readonly rows: Row[] = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, data: i + 1 }));
  readonly selectedIds = new Set<number | string>([2, 4]);
  readonly batchActions: BatchAction[] = [{ label: 'Delete', onClick: ({ clearSelection }) => clearSelection() }];
}

/* ─── 20. InitialSort ────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-initial-sort',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table
        [columns]="columns"
        [rows]="rows"
        [initialSortIndex]="0"
        [initialSortDirection]="'ASC'"
      />
    </div>
  `,
})
export class DataTableInitialSortScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 21. Loading ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:400px;width:700px">
      <bui-stateful-data-table
        [columns]="columns"
        [rows]="rows"
        [loading]="true"
      />
    </div>
  `,
})
export class DataTableLoadingScenario {
  readonly columns = makeAnimalCols();
  readonly rows: Row[] = [];
}

/* ─── 22. NotFilterable ──────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-not-filterable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [filterable]="false" />
    </div>
  `,
})
export class DataTableNotFilterableScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 23. NotSearchable ──────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-not-searchable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [searchable]="false" />
    </div>
  `,
})
export class DataTableNotSearchableScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 24. NumericalColumn ────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-numerical-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:900px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableNumericalColumnScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Movie', mapDataToValue: (d: any) => d[0] }),
    CategoricalColumn({ title: 'Genre', mapDataToValue: (d: any) => d[1] }),
    NumericalColumn({ title: 'Production Budget', format: NUMERICAL_FORMATS.ACCOUNTING, mapDataToValue: (d: any) => d[2] }),
    NumericalColumn({ title: 'Box Office', format: NUMERICAL_FORMATS.ACCOUNTING, mapDataToValue: (d: any) => d[3] }),
    NumericalColumn({ title: 'ROI', precision: 2, mapDataToValue: (d: any) => d[4] }),
    NumericalColumn({ title: 'IMDB Rating', precision: 2, mapDataToValue: (d: any) => d[5] }),
  ];
  readonly rows = MOVIE_ROWS;
}

/* ─── 25. ResizableColumnWidths ──────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-resizable-column-widths',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [resizableColumnWidths]="true" />
    </div>
  `,
})
export class DataTableResizableColumnWidthsScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 26. RowActions ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-row-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <div style="height:500px;width:700px">
        <bui-stateful-data-table [columns]="columns" [rows]="rows" [rowActions]="rowActions" />
      </div>
      <ul id="clicked-rows">
        @for (r of clicked(); track r) {
          <li>{{ r }}</li>
        }
      </ul>
    </div>
  `,
})
export class DataTableRowActionsScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Movie', mapDataToValue: (d: any) => d[0] }),
    CategoricalColumn({ title: 'Genre', mapDataToValue: (d: any) => d[1] }),
    NumericalColumn({ title: 'Budget', format: NUMERICAL_FORMATS.ACCOUNTING, mapDataToValue: (d: any) => d[2] }),
  ];
  readonly rows = MOVIE_ROWS;
  protected readonly clicked = signal<(string | number)[]>([]);

  readonly rowActions: RowAction[] = [
    { label: 'Action One', onClick: ({ row }) => this.clicked.update((c) => [...c, row.id]) },
    { label: 'Action Two', onClick: ({ row }) => this.clicked.update((c) => [...c, row.id]) },
  ];
}

/* ─── 27. RowActionsButton ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-row-actions-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:400px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [rowActions]="rowActions" />
    </div>
  `,
})
export class DataTableRowActionsButtonScenario {
  readonly columns: ColumnDef[] = [
    NumericalColumn({ title: 'ID', mapDataToValue: (d: any) => d }),
    StringColumn({ title: 'Label', mapDataToValue: (d: any) => `item-${d}` }),
  ];
  readonly rows: Row[] = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, data: i + 1 }));
  readonly rowActions: RowAction[] = [{ label: 'Delete', onClick: ({ row }) => alert(`Delete ${row.id}`) }];
}

/* ─── 28. RowActionsDynamic ──────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-row-actions-dynamic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:400px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [rowActions]="rowActionsFn" />
    </div>
  `,
})
export class DataTableRowActionsDynamicScenario {
  readonly columns: ColumnDef[] = [
    NumericalColumn({ title: 'ID', mapDataToValue: (d: any) => d[0] }),
    BooleanColumn({ title: 'Active', mapDataToValue: (d: any) => d[1] }),
  ];
  readonly rows: Row[] = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, data: [i + 1, i % 2 === 0] }));
  readonly rowActionsFn = (row: Row): RowAction[] => {
    const isActive = (row.data as any[])[1];
    return [
      { label: isActive ? 'Deactivate' : 'Activate', onClick: () => {} },
    ];
  };
}

/* ─── 29. RowHeight ──────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-row-height',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" [rowHeight]="64" />
    </div>
  `,
})
export class DataTableRowHeightScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 30. StatefulCallback ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-stateful-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div>
      <p style="font-size:13px">Callbacks: sort={{ sortCount() }}, filter={{ filterCount() }}, selection={{ selectionCount() }}, textQuery={{ textCount() }}</p>
      <div style="height:600px;width:700px">
        <bui-stateful-data-table
          [columns]="columns"
          [rows]="rows"
          [batchActions]="batchActions"
          [onSortCb]="onSort"
          [onFilterAddCb]="onFilterAdd"
          [onSelectionChangeCb]="onSelectionChange"
          [onTextQueryChangeCb]="onTextQueryChange"
        />
      </div>
    </div>
  `,
})
export class DataTableStatefulCallbackScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
  protected readonly sortCount = signal(0);
  protected readonly filterCount = signal(0);
  protected readonly selectionCount = signal(0);
  protected readonly textCount = signal(0);

  readonly batchActions: BatchAction[] = [{ label: 'Test', onClick: ({ clearSelection }) => clearSelection() }];

  readonly onSort = () => this.sortCount.update((n) => n + 1);
  readonly onFilterAdd = () => this.filterCount.update((n) => n + 1);
  readonly onSelectionChange = () => this.selectionCount.update((n) => n + 1);
  readonly onTextQueryChange = () => this.textCount.update((n) => n + 1);
}

/* ─── 31. TextSearch ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-text-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableTextSearchScenario {
  readonly columns: ColumnDef[] = [
    StringColumn({ title: 'Name', minWidth: 200, mapDataToValue: (d: any) => d.Name }),
    CategoricalColumn({ title: 'Kingdom', mapDataToValue: (d: any) => d.Kingdom }),
    CategoricalColumn({ title: 'Phylum', minWidth: 90, mapDataToValue: (d: any) => d.Phylum }),
    CategoricalColumn({ title: 'Class', minWidth: 120, mapDataToValue: (d: any) => d.Class }),
  ];
  readonly rows = ANIMAL_DATA;
}

/* ─── 32. TestRtl ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-rtl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div dir="rtl" style="height:600px;width:700px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableRtlScenario {
  readonly columns = makeAnimalCols();
  readonly rows = ANIMAL_DATA;
}

/* ─── 33. LargeData ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-dt-large-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDataTable],
  template: `
    <div style="height:800px;width:900px">
      <bui-stateful-data-table [columns]="columns" [rows]="rows" />
    </div>
  `,
})
export class DataTableLargeDataScenario {
  readonly columns: ColumnDef[] = [
    NumericalColumn({ title: 'ID', mapDataToValue: (d: any) => d[0] }),
    StringColumn({ title: 'Name', minWidth: 200, mapDataToValue: (d: any) => d[1] }),
    CategoricalColumn({ title: 'Category', mapDataToValue: (d: any) => d[2] }),
    NumericalColumn({ title: 'Value', precision: 2, mapDataToValue: (d: any) => d[3] }),
    BooleanColumn({ title: 'Active', mapDataToValue: (d: any) => d[4] }),
    DatetimeColumn({ title: 'Date', mapDataToValue: (d: any) => d[5] }),
  ];
  readonly rows: Row[] = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    data: [
      i + 1,
      `item-${i}`,
      ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][i % 5],
      Math.round(Math.random() * 10000) / 100,
      i % 2 === 0,
      new Date(Date.now() - i * 86400000),
    ],
  }));
}
