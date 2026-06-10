import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { BuiInput } from '../input/input.component';
import {
  BatchAction,
  CategoricalFilterParams,
  ColumnDef,
  DataTableControlRef,
  FilterParams,
  NumericalFilterParams,
  Row,
  RowAction,
  SortDirection,
  SORT_DIRECTIONS,
  BooleanFilterParams,
  DatetimeFilterParams,
  COLUMNS,
} from './data-table.columns';

const HEADER_ROW_HEIGHT = 48;
const DEFAULT_ROW_HEIGHT = 36;

/* ─── Filter Panel ───────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-dt-filter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule],
  template: `
    <div class="bui-dt-fp__root">
      @if (filterType() === 'categorical') {
        <div class="bui-dt-fp__categorical">
          <div class="bui-dt-fp__exclude-row">
            <label>
              <input type="checkbox" [checked]="excludeMode()" (change)="excludeMode.set(!excludeMode())" />
              Exclude
            </label>
          </div>
          <div class="bui-dt-fp__items">
            @for (cat of categories(); track cat) {
              <label class="bui-dt-fp__item">
                <input
                  type="checkbox"
                  [checked]="catSelection().has(cat)"
                  (change)="toggleCat(cat)"
                />
                <span>{{ cat }}</span>
              </label>
            }
          </div>
        </div>
      }

      @if (filterType() === 'numerical') {
        <div class="bui-dt-fp__numerical">
          <label class="bui-dt-fp__label">Comparator</label>
          <select class="bui-dt-fp__select" [(ngModel)]="numComparator">
            <option value="gte">≥</option>
            <option value="lte">≤</option>
            <option value="gt">&gt;</option>
            <option value="lt">&lt;</option>
            <option value="between">between</option>
          </select>
          <input type="number" class="bui-dt-fp__input" [(ngModel)]="numValue1" placeholder="Value" />
          @if (numComparator === 'between') {
            <input type="number" class="bui-dt-fp__input" [(ngModel)]="numValue2" placeholder="Value 2" />
          }
        </div>
      }

      @if (filterType() === 'boolean') {
        <div class="bui-dt-fp__boolean">
          <label class="bui-dt-fp__item">
            <input type="radio" name="bool-filter" [value]="true" [(ngModel)]="boolSelection" /> True
          </label>
          <label class="bui-dt-fp__item">
            <input type="radio" name="bool-filter" [value]="false" [(ngModel)]="boolSelection" /> False
          </label>
        </div>
      }

      @if (filterType() === 'datetime') {
        <div class="bui-dt-fp__datetime">
          <label class="bui-dt-fp__label">From</label>
          <input type="date" class="bui-dt-fp__input" [(ngModel)]="dtStart" />
          <label class="bui-dt-fp__label">To</label>
          <input type="date" class="bui-dt-fp__input" [(ngModel)]="dtEnd" />
        </div>
      }

      @if (filterType() === 'none') {
        <p class="bui-dt-fp__note">No filter available for this column type.</p>
      }

      <div class="bui-dt-fp__actions">
        <button class="bui-dt-fp__btn bui-dt-fp__btn--clear" type="button" (click)="onClear()">Clear</button>
        <button class="bui-dt-fp__btn bui-dt-fp__btn--apply" type="button" (click)="onApply()">Apply</button>
      </div>
    </div>
  `,
})
export class BuiDtFilterPanel {
  readonly filterType = input<string>('categorical');
  readonly categories = input<string[]>([]);
  readonly existingFilter = input<FilterParams | null>(null);

  readonly filterApplied = output<FilterParams>();
  readonly filterCleared = output<void>();

  protected readonly catSelection = signal<Set<string>>(new Set());
  protected readonly excludeMode = signal(false);

  protected numComparator: 'gte' | 'lte' | 'gt' | 'lt' | 'between' = 'gte';
  protected numValue1 = 0;
  protected numValue2 = 0;
  protected boolSelection: boolean = true;
  protected dtStart = '';
  protected dtEnd = '';

  constructor() {
    effect(() => {
      const f = this.existingFilter();
      if (!f) return;
      const ft = this.filterType();
      if (ft === 'categorical') {
        const cf = f as CategoricalFilterParams;
        this.catSelection.set(new Set(cf.selection));
        this.excludeMode.set(cf.exclude);
      } else if (ft === 'numerical') {
        const nf = f as NumericalFilterParams;
        this.numComparator = nf.comparator;
        this.numValue1 = nf.value1;
        this.numValue2 = nf.value2 ?? 0;
      } else if (ft === 'boolean') {
        const bf = f as BooleanFilterParams;
        this.boolSelection = bf.selection;
      } else if (ft === 'datetime') {
        const df = f as DatetimeFilterParams;
        this.dtStart = df.startDate ? df.startDate.toISOString().slice(0, 10) : '';
        this.dtEnd = df.endDate ? df.endDate.toISOString().slice(0, 10) : '';
      }
    });
  }

  protected toggleCat(cat: string): void {
    this.catSelection.update((s) => {
      const next = new Set(s);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  protected onApply(): void {
    const ft = this.filterType();
    if (ft === 'categorical') {
      const sel = this.catSelection();
      this.filterApplied.emit({
        selection: new Set(sel),
        exclude: this.excludeMode(),
        description: sel.size ? Array.from(sel).join(', ') : 'all',
      } as CategoricalFilterParams);
    } else if (ft === 'numerical') {
      let description = `${this.numComparator} ${this.numValue1}`;
      if (this.numComparator === 'between') description += ` and ${this.numValue2}`;
      this.filterApplied.emit({
        comparator: this.numComparator,
        value1: this.numValue1,
        value2: this.numValue2,
        description,
      } as NumericalFilterParams);
    } else if (ft === 'boolean') {
      this.filterApplied.emit({
        selection: this.boolSelection,
        description: this.boolSelection ? 'true' : 'false',
      } as BooleanFilterParams);
    } else if (ft === 'datetime') {
      this.filterApplied.emit({
        startDate: this.dtStart ? new Date(this.dtStart) : undefined,
        endDate: this.dtEnd ? new Date(this.dtEnd) : undefined,
        description: `${this.dtStart || '?'} → ${this.dtEnd || '?'}`,
      } as DatetimeFilterParams);
    }
  }

  protected onClear(): void {
    this.catSelection.set(new Set());
    this.excludeMode.set(false);
    this.filterCleared.emit();
  }
}

/* ─── DataTable (controlled) ─────────────────────────────────────────────────── */

@Component({
  selector: 'bui-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule, NgStyle, BuiInput, BuiDtFilterPanel],
  styleUrl: './data-table.component.scss',
  host: { 'data-baseweb': 'data-table', class: 'bui-dt' },
  template: `
    <div class="bui-dt__root">

      <!-- Toolbar -->
      <div class="bui-dt__toolbar"
           [class.bui-dt__toolbar--hidden]="!searchable() && !filterable() && !hasSelectedRows()">
        @if (searchable()) {
          <div class="bui-dt__search">
            <bui-input
              placeholder="Search..."
              [value]="textQuery()"
              (valueChange)="onTextQueryChange($event)"
            />
          </div>
        }

        <!-- Active filters -->
        @if (filterable() && activeFilters().length) {
          <div class="bui-dt__filter-tags">
            @for (f of activeFilters(); track f.title) {
              <div class="bui-dt__filter-tag">
                <span>{{ f.title }}: {{ f.description }}</span>
                <button class="bui-dt__filter-tag-remove" type="button"
                        (click)="removeFilter(f.title)">×</button>
              </div>
            }
          </div>
        }

        <!-- Batch action bar -->
        @if (isSelectable() && hasSelectedRows()) {
          <div class="bui-dt__batch-bar">
            <span class="bui-dt__batch-count">{{ selectedRowIds().size }} selected</span>
            @for (action of batchActions(); track action.label) {
              <button class="bui-dt__batch-btn" type="button"
                      (click)="onBatchAction(action)">{{ action.label }}</button>
            }
            <button class="bui-dt__batch-btn bui-dt__batch-btn--cancel" type="button"
                    (click)="selectNone.emit()">Cancel</button>
          </div>
        }
      </div>

      <!-- Table wrapper -->
      <div class="bui-dt__table-wrap" [style.height.px]="tableHeight()">
        <div class="bui-dt__table-scroll" (scroll)="onScroll($event)">

          <!-- Sticky header -->
          <div class="bui-dt__header-row"
               [style.width.px]="totalWidth()">
            @if (isSelectable()) {
              <div class="bui-dt__th bui-dt__th--check">
                <input
                  class="bui-dt__checkbox"
                  type="checkbox"
                  [attr.aria-label]="isSelectedAll() ? 'Deselect all' : 'Select all'"
                  [checked]="isSelectedAll()"
                  [indeterminate]="isSelectedIndeterminate()"
                  (change)="onToggleAll($event)"
                />
              </div>
            }
            @for (col of columns(); track col.title; let ci = $index) {
              <div
                class="bui-dt__th"
                [class.bui-dt__th--sortable]="col.sortable"
                [class.bui-dt__th--sorted]="sortIndex() === ci"
                [class.bui-dt__th--hovered]="hoveredColIndex() === ci"
                [style.width.px]="columnWidths()[ci]"
                [style.min-width.px]="columnWidths()[ci]"
                (mouseenter)="hoveredColIndex.set(ci)"
                (mouseleave)="hoveredColIndex.set(-1)"
                (click)="col.sortable && onSort(ci)"
              >
                <span class="bui-dt__th-title">{{ col.title }}</span>
                @if (col.sortable && sortIndex() === ci) {
                  <span class="bui-dt__sort-icon">
                    {{ sortDirection() === 'ASC' ? '↑' : '↓' }}
                  </span>
                }
                @if (filterable() && col.filterable && filterType(col) !== 'none') {
                  <button
                    class="bui-dt__filter-btn"
                    [class.bui-dt__filter-btn--active]="hasFilter(col.title)"
                    type="button"
                    cdkOverlayOrigin
                    #filterOrigin="cdkOverlayOrigin"
                    (click)="openFilter($event, ci, filterOrigin)"
                    [attr.aria-label]="'Filter ' + col.title"
                  >
                    ⊟
                  </button>
                }
                @if (resizableColumnWidths()) {
                  <div class="bui-dt__resize-handle"
                       (mousedown)="startResize($event, ci)"></div>
                }
              </div>
            }
            <!-- Row actions spacer -->
            @if (hasRowActions()) {
              <div class="bui-dt__th bui-dt__th--actions"></div>
            }
          </div>

          <!-- Rows -->
          <div class="bui-dt__body"
               [style.width.px]="totalWidth()"
               (mouseleave)="hoveredRowIndex.set(-1)">
            @if (loading()) {
              <div class="bui-dt__message">{{ loadingMessage() }}</div>
            } @else if (visibleRows().length === 0) {
              <div class="bui-dt__message">{{ emptyMessage() }}</div>
            } @else {
              @for (row of visibleRows(); track row.id; let ri = $index) {
                <div
                  class="bui-dt__row"
                  [class.bui-dt__row--even]="ri % 2 === 0"
                  [class.bui-dt__row--odd]="ri % 2 !== 0"
                  [class.bui-dt__row--highlighted]="ri + 1 === rowHighlightIndex()"
                  [class.bui-dt__row--selected]="isRowSelected(row.id)"
                  [style.height.px]="rowHeight()"
                  (mouseenter)="onRowMouseEnter(ri + 1, row)"
                  (mouseleave)="onRowMouseLeave()"
                >
                  @if (isSelectable()) {
                    <div class="bui-dt__td bui-dt__td--check">
                      <input
                        class="bui-dt__checkbox"
                        type="checkbox"
                        [attr.aria-label]="'Select row ' + row.id"
                        [checked]="isRowSelected(row.id)"
                        (change)="selectOne.emit(row)"
                      />
                    </div>
                  }
                  @for (col of columns(); track col.title; let ci = $index) {
                    <div
                      class="bui-dt__td"
                      [class.bui-dt__td--col-highlighted]="hoveredColIndex() === ci"
                      [class.bui-dt__td--row-index]="col.kind === 'row-index'"
                      [style.width.px]="columnWidths()[ci]"
                      [style.min-width.px]="columnWidths()[ci]"
                      [ngStyle]="getCellStyle(col, row)"
                    >
                      @if (col.kind === 'row-index') {
                        <span class="bui-dt__row-index">{{ ri + 1 }}</span>
                      } @else if (col.isAnchor) {
                        <a [href]="col.getHref!(col.mapDataToValue(row.data))" target="_blank" rel="noopener">
                          {{ col.formatCell(col.mapDataToValue(row.data)) }}
                        </a>
                      } @else {
                        {{ col.formatCell(col.mapDataToValue(row.data)) }}
                      }
                    </div>
                  }

                  <!-- Row actions -->
                  @if (hasRowActions() && ri + 1 === hoveredRowIndex()) {
                    <div class="bui-dt__row-actions"
                         [style.height.px]="rowHeight()"
                         [style.right.px]="scrollLeft()">
                      @for (action of getRowActions(row); track action.label) {
                        <button class="bui-dt__row-action-btn" type="button"
                                [title]="action.label"
                                (click)="onRowAction(action, row, $event)">
                          {{ action.label }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Filter overlay -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="filterOriginRef()"
      [cdkConnectedOverlayOpen]="filterOpen()"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      cdkConnectedOverlayPanelClass="bw-root"
      [cdkConnectedOverlayPositions]="overlayPositions"
      (backdropClick)="filterOpen.set(false)"
    >
      <bui-dt-filter-panel
        [filterType]="activeFilterType()"
        [categories]="filterCategories()"
        [existingFilter]="activeFilterParams()"
        (filterApplied)="onFilterApplied($event)"
        (filterCleared)="onFilterCleared()"
      />
    </ng-template>
  `,
})
export class BuiDataTable implements OnChanges {
  readonly columns = input<ColumnDef[]>([]);
  readonly rows = input<Row[]>([]);
  readonly filters = input<Map<string, FilterParams>>(new Map());
  readonly textQuery = input('');
  readonly sortIndex = input(-1);
  readonly sortDirection = input<SortDirection | null | undefined>(null);
  readonly selectedRowIds = input<Set<string | number>>(new Set());
  readonly rowHighlightIndex = input<number | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading...');
  readonly emptyMessage = input('No data');
  readonly filterable = input(true, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly resizableColumnWidths = input(false, { transform: booleanAttribute });
  readonly rowHeight = input(DEFAULT_ROW_HEIGHT);
  readonly rowActions = input<RowAction[] | ((row: Row) => RowAction[])>([]);
  readonly batchActions = input<BatchAction[]>([]);
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly tableHeight = input(600);
  readonly controlRef = input<{ ref: DataTableControlRef } | null | undefined>(null);

  readonly sort = output<{ columnIndex: number }>();
  readonly filterAdd = output<{ title: string; params: FilterParams }>();
  readonly filterRemove = output<{ title: string }>();
  readonly selectMany = output<{ rows: Row[] }>();
  readonly selectNone = output<void>();
  readonly selectOne = output<Row>();
  readonly textQueryChange = output<string>();
  readonly includedRowsChange = output<{ rows: Row[] }>();
  readonly rowHighlightChange = output<{ rowIndex: number; row: Row }>();

  // CDK overlay refs
  protected readonly filterOpen = signal(false);
  protected readonly filterOriginRef = signal<CdkOverlayOrigin | undefined>(undefined);
  protected readonly filterColumnIndex = signal(-1);
  protected readonly overlayPositions = [
    { originX: 'start' as const, originY: 'bottom' as const, overlayX: 'start' as const, overlayY: 'top' as const },
    { originX: 'start' as const, originY: 'top' as const, overlayX: 'start' as const, overlayY: 'bottom' as const },
  ];

  // Hover state
  protected readonly hoveredRowIndex = signal(-1);
  protected readonly hoveredColIndex = signal(-1);
  protected readonly scrollLeft = signal(0);

  // Resize state
  protected readonly resizeDeltas = signal<number[]>([]);
  private resizingCol = -1;
  private resizeStartX = 0;
  private boundMouseMove = this.onResizeMouseMove.bind(this);
  private boundMouseUp = this.onResizeMouseUp.bind(this);

  // Column widths (measured + deltas)
  protected readonly columnWidths = computed((): number[] => {
    const cols = this.columns();
    const deltas = this.resizeDeltas();
    return cols.map((col, i) => {
      const base = col.minWidth ?? 120;
      return base + (deltas[i] ?? 0);
    });
  });

  protected readonly totalWidth = computed((): number => {
    const selWidth = this.isSelectable() ? 52 : 0;
    const actionsWidth = this.hasRowActions() ? 120 : 0;
    return this.columnWidths().reduce((s, w) => s + w, 0) + selWidth + actionsWidth;
  });

  protected readonly hasRowActions = computed((): boolean => {
    const a = this.rowActions();
    return typeof a === 'function' || a.length > 0;
  });

  protected readonly isSelectable = computed((): boolean => {
    return this.selectable() || (this.batchActions()?.length ?? 0) > 0;
  });

  protected readonly isSelectedAll = computed((): boolean => {
    const ids = this.selectedRowIds();
    const visible = this.visibleRows();
    return visible.length > 0 && ids.size >= visible.length;
  });

  protected readonly isSelectedIndeterminate = computed((): boolean => {
    const ids = this.selectedRowIds();
    const visible = this.visibleRows();
    return ids.size > 0 && ids.size < visible.length;
  });

  protected readonly hasSelectedRows = computed((): boolean => this.selectedRowIds().size > 0);

  protected readonly activeFilters = computed((): { title: string; description: string }[] => {
    const m = this.filters();
    return Array.from(m.entries()).map(([title, p]) => ({ title, description: p.description ?? '' }));
  });

  protected readonly activeFilterType = computed((): string => {
    const ci = this.filterColumnIndex();
    const cols = this.columns();
    if (ci < 0 || ci >= cols.length) return 'categorical';
    return cols[ci].filterType ?? 'categorical';
  });

  protected readonly filterCategories = computed((): string[] => {
    const ci = this.filterColumnIndex();
    const cols = this.columns();
    const rows = this.rows();
    if (ci < 0 || ci >= cols.length) return [];
    const col = cols[ci];
    const vals = rows.map((r) => col.mapDataToValue(r.data) as string);
    return Array.from(new Set(vals)).sort();
  });

  protected readonly activeFilterParams = computed((): FilterParams | null => {
    const ci = this.filterColumnIndex();
    const cols = this.columns();
    if (ci < 0 || ci >= cols.length) return null;
    const title = cols[ci].title;
    return this.filters().get(title) ?? null;
  });

  protected readonly visibleRows = computed((): Row[] => {
    const allRows = this.rows();
    const cols = this.columns();
    const fMap = this.filters();
    const query = this.textQuery().toLowerCase();
    const si = this.sortIndex();
    const sd = this.sortDirection();

    let result = [...allRows];

    // Apply column filters
    if (fMap.size) {
      fMap.forEach((params, title) => {
        const col = cols.find((c) => c.title === title);
        if (!col) return;
        const fn = col.buildFilter(params);
        result = result.filter((r) => fn(col.mapDataToValue(r.data)));
      });
    }

    // Apply text search
    if (query) {
      result = result.filter((r) =>
        cols.some((col) => col.textQueryFilter?.(query, col.mapDataToValue(r.data)) ?? false)
      );
    }

    // Sort
    if (si >= 0 && si < cols.length && sd) {
      const col = cols[si];
      result.sort((a, b) => {
        const va = col.mapDataToValue(a.data);
        const vb = col.mapDataToValue(b.data);
        const cmp = col.sortFn(va as never, vb as never);
        return sd === SORT_DIRECTIONS.ASC ? cmp : -cmp;
      });
    }

    this.includedRowsChange.emit({ rows: result });
    return result;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      const cols = this.columns();
      this.resizeDeltas.set(new Array(cols.length).fill(0));
    }
  }

  protected filterType(col: ColumnDef): string {
    return col.filterType;
  }

  protected hasFilter(title: string): boolean {
    return this.filters().has(title);
  }

  protected isRowSelected(id: string | number): boolean {
    return this.selectedRowIds().has(id);
  }

  protected getRowActions(row: Row): RowAction[] {
    const actions = this.rowActions();
    if (typeof actions === 'function') return actions(row);
    return actions as RowAction[];
  }

  protected getCellStyle(col: ColumnDef, row: Row): Record<string, string> {
    return col.getCellStyle?.(col.mapDataToValue(row.data)) ?? {};
  }

  protected onTextQueryChange(query: string): void {
    this.textQueryChange.emit(query);
  }

  protected onSort(columnIndex: number): void {
    this.sort.emit({ columnIndex });
  }

  protected onToggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectMany.emit({ rows: this.visibleRows() });
    } else {
      this.selectNone.emit();
    }
  }

  protected onRowMouseEnter(rowIndex: number, row: Row): void {
    this.hoveredRowIndex.set(rowIndex);
    this.rowHighlightChange.emit({ rowIndex, row });
  }

  protected onRowMouseLeave(): void {
    this.hoveredRowIndex.set(-1);
  }

  protected onRowAction(action: RowAction, row: Row, event: Event): void {
    action.onClick({ row, event });
  }

  protected onBatchAction(action: BatchAction): void {
    const selected = this.visibleRows().filter((r) => this.isRowSelected(r.id));
    action.onClick({
      selection: selected,
      clearSelection: () => this.selectNone.emit(),
      event: new Event('click'),
    });
  }

  protected onScroll(event: Event): void {
    this.scrollLeft.set((event.target as HTMLElement).scrollLeft);
  }

  protected openFilter(event: Event, columnIndex: number, origin: CdkOverlayOrigin): void {
    event.stopPropagation();
    this.filterColumnIndex.set(columnIndex);
    this.filterOriginRef.set(origin);
    this.filterOpen.set(true);
  }

  protected onFilterApplied(params: FilterParams): void {
    const ci = this.filterColumnIndex();
    const col = this.columns()[ci];
    if (col) {
      this.filterAdd.emit({ title: col.title, params });
    }
    this.filterOpen.set(false);
  }

  protected onFilterCleared(): void {
    const ci = this.filterColumnIndex();
    const col = this.columns()[ci];
    if (col) {
      this.filterRemove.emit({ title: col.title });
    }
    this.filterOpen.set(false);
  }

  protected removeFilter(title: string): void {
    this.filterRemove.emit({ title });
  }

  protected startResize(event: MouseEvent, columnIndex: number): void {
    event.preventDefault();
    this.resizingCol = columnIndex;
    this.resizeStartX = event.clientX;
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  private onResizeMouseMove(event: MouseEvent): void {
    if (this.resizingCol < 0) return;
    const delta = event.clientX - this.resizeStartX;
    const ci = this.resizingCol;
    const col = this.columns()[ci];
    const minW = col.minWidth ?? 80;
    const baseW = minW + (this.resizeDeltas()[ci] ?? 0);
    const newW = Math.max(minW, baseW + delta - (this.resizeDeltas()[ci] ?? 0));
    this.resizeDeltas.update((d) => {
      const next = [...d];
      next[ci] = Math.max(0, delta);
      return next;
    });
  }

  private onResizeMouseUp(event: MouseEvent): void {
    const delta = event.clientX - this.resizeStartX;
    this.resizeDeltas.update((d) => {
      const next = [...d];
      const ci = this.resizingCol;
      next[ci] = Math.max(0, (next[ci] ?? 0) + delta);
      return next;
    });
    this.resizingCol = -1;
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }
}

/* ─── StatefulDataTable ──────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-stateful-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDataTable],
  template: `
    <bui-data-table
      [columns]="columns()"
      [rows]="rows()"
      [filters]="filters()"
      [textQuery]="textQuery()"
      [sortIndex]="sortIndex()"
      [sortDirection]="sortDirection()"
      [selectedRowIds]="selectedRowIds()"
      [rowHighlightIndex]="rowHighlightIndex()"
      [loading]="loading()"
      [loadingMessage]="loadingMessage()"
      [emptyMessage]="emptyMessage()"
      [filterable]="filterable()"
      [searchable]="searchable()"
      [resizableColumnWidths]="resizableColumnWidths()"
      [rowHeight]="rowHeight()"
      [rowActions]="rowActions()"
      [batchActions]="batchActions()"
      [selectable]="selectable()"
      [tableHeight]="tableHeight()"
      (sort)="onSort($event)"
      (filterAdd)="onFilterAdd($event)"
      (filterRemove)="onFilterRemove($event)"
      (selectMany)="onSelectMany($event)"
      (selectNone)="onSelectNone()"
      (selectOne)="onSelectOne($event)"
      (textQueryChange)="onTextQueryChange($event)"
      (includedRowsChange)="onIncludedRowsChange($event)"
      (rowHighlightChange)="onRowHighlightChange($event)"
    />
  `,
})
export class BuiStatefulDataTable {
  readonly columns = input<ColumnDef[]>([]);
  readonly rows = input<Row[]>([]);
  readonly initialFilters = input<Map<string, FilterParams>>(new Map());
  readonly initialSortIndex = input(-1);
  readonly initialSortDirection = input<SortDirection | null | undefined>(null);
  readonly initialSelectedRowIds = input<Set<string | number>>(new Set());
  readonly initialTextQuery = input('');
  readonly rowHighlightIndex = input<number | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading...');
  readonly emptyMessage = input('No data');
  readonly filterable = input(true, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly resizableColumnWidths = input(false, { transform: booleanAttribute });
  readonly rowHeight = input(DEFAULT_ROW_HEIGHT);
  readonly rowActions = input<RowAction[] | ((row: Row) => RowAction[])>([]);
  readonly batchActions = input<BatchAction[]>([]);
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly tableHeight = input(600);
  readonly controlRef = input<DataTableControlRef | null | undefined>(null);

  readonly onFilterAddCb = input<((title: string, params: FilterParams) => void) | null | undefined>(null);
  readonly onFilterRemoveCb = input<((title: string) => void) | null | undefined>(null);
  readonly onIncludedRowsChangeCb = input<((rows: Row[]) => void) | null | undefined>(null);
  readonly onRowHighlightChangeCb = input<((rowIndex: number, row: Row) => void) | null | undefined>(null);
  readonly onSelectionChangeCb = input<((rows: Row[]) => void) | null | undefined>(null);
  readonly onSortCb = input<((columnIndex: number, direction: SortDirection) => void) | null | undefined>(null);
  readonly onTextQueryChangeCb = input<((query: string) => void) | null | undefined>(null);

  protected readonly filters = signal<Map<string, FilterParams>>(new Map());
  protected readonly textQuery = signal('');
  protected readonly sortIndex = signal(-1);
  protected readonly sortDirection = signal<SortDirection | null | undefined>(null);
  protected readonly selectedRowIds = signal<Set<string | number>>(new Set());

  private _currentRows: Row[] = [];

  constructor() {
    effect(() => {
      this.filters.set(new Map(this.initialFilters()));
      this.sortIndex.set(this.initialSortIndex());
      this.sortDirection.set(this.initialSortDirection());
      this.selectedRowIds.set(new Set(this.initialSelectedRowIds()));
      this.textQuery.set(this.initialTextQuery());
    }, { allowSignalWrites: true });

    effect(() => {
      const ref = this.controlRef();
      if (ref) {
        (ref as DataTableControlRef).clearSelection = () => this.onSelectNone();
        (ref as DataTableControlRef).getRows = () => this._currentRows;
      }
    });
  }

  protected onSort(event: { columnIndex: number }): void {
    const ci = event.columnIndex;
    const curIdx = this.sortIndex();
    const curDir = this.sortDirection();
    let nextIdx = ci;
    let nextDir: SortDirection = SORT_DIRECTIONS.ASC;

    if (ci === curIdx) {
      if (curDir === SORT_DIRECTIONS.ASC) {
        nextDir = SORT_DIRECTIONS.DESC;
      } else {
        nextIdx = -1;
        nextDir = SORT_DIRECTIONS.ASC;
      }
    }

    this.sortIndex.set(nextIdx);
    this.sortDirection.set(nextDir);
    this.onSortCb()?.(nextIdx, nextDir);
  }

  protected onFilterAdd(event: { title: string; params: FilterParams }): void {
    this.filters.update((m) => { const next = new Map(m); next.set(event.title, event.params); return next; });
    this.onFilterAddCb()?.(event.title, event.params);
  }

  protected onFilterRemove(event: { title: string }): void {
    this.filters.update((m) => { const next = new Map(m); next.delete(event.title); return next; });
    this.onFilterRemoveCb()?.(event.title);
  }

  protected onSelectMany(event: { rows: Row[] }): void {
    this.selectedRowIds.update((s) => new Set([...s, ...event.rows.map((r) => r.id)]));
    this.onSelectionChangeCb()?.(event.rows.filter((r) => this.selectedRowIds().has(r.id)));
  }

  protected onSelectNone(): void {
    this.selectedRowIds.set(new Set());
    this.onSelectionChangeCb()?.([]);
  }

  protected onSelectOne(row: Row): void {
    this.selectedRowIds.update((s) => {
      const next = new Set(s);
      if (next.has(row.id)) next.delete(row.id); else next.add(row.id);
      return next;
    });
    const selected = this.rows().filter((r) => this.selectedRowIds().has(r.id));
    this.onSelectionChangeCb()?.(selected);
  }

  protected onTextQueryChange(query: string): void {
    this.textQuery.set(query);
    this.onTextQueryChangeCb()?.(query);
  }

  protected onIncludedRowsChange(event: { rows: Row[] }): void {
    this._currentRows = event.rows;
    this.onIncludedRowsChangeCb()?.(event.rows);
  }

  protected onRowHighlightChange(event: { rowIndex: number; row: Row }): void {
    this.onRowHighlightChangeCb()?.(event.rowIndex, event.row);
  }
}
