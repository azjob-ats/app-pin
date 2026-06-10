import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BuiTriangleUp, BuiTriangleDown } from '../icon/icon.component';

export type Divider = 'horizontal' | 'vertical' | 'grid' | 'clean';
export type TableSize = 'compact' | 'default' | 'spacious';

const SIZE_PADDING: Record<TableSize, string> = {
  compact: 'var(--bw-sizing-scale500, 12px)',
  default: 'var(--bw-sizing-scale600, 16px)',
  spacious: 'var(--bw-sizing-scale800, 28px)',
};

/* ── Styled primitives ─────────────────────────────────────────────────────── */

@Directive({
  selector: 'bui-ts-root, [buiTsRoot]',
  host: { 'data-baseweb': 'table-semantic', class: 'bui-ts__root' },
})
export class BuiStyledRoot {}

@Directive({
  selector: 'table[buiTsTable]',
  host: { class: 'bui-ts__table' },
})
export class BuiStyledSemanticTable {}

@Directive({
  selector: 'thead[buiTsThead]',
  host: { class: 'bui-ts__thead' },
})
export class BuiStyledTHead {}

@Directive({
  selector: 'tr[buiTsTheadRow]',
  host: { class: 'bui-ts__thead-row' },
})
export class BuiStyledTHeadRow {}

@Directive({
  selector: 'th[buiTsTh]',
  host: { class: 'bui-ts__th', scope: 'col' },
})
export class BuiStyledTHeadCell {}

@Directive({
  selector: 'tbody[buiTsTbody]',
  host: { class: 'bui-ts__tbody' },
})
export class BuiStyledTBody {}

@Directive({
  selector: 'tr[buiTsTbodyRow]',
  host: { class: 'bui-ts__tbody-row' },
})
export class BuiStyledTBodyRow {}

@Directive({
  selector: 'td[buiTsTd]',
  host: { class: 'bui-ts__td' },
})
export class BuiStyledTBodyCell {}

/* ── TableBuilderColumn — column definition directive ──────────────────────── */

@Directive({ selector: 'bui-builder-column' })
export class BuiTableBuilderColumn {
  readonly id = input<string>();
  readonly header = input<string>('');
  readonly numeric = input(false, { transform: booleanAttribute });
  readonly sortable = input(false, { transform: booleanAttribute });

  readonly cellTpl = contentChild(TemplateRef<{ $implicit: unknown }>);
}

/* ── SemanticTable — high-level <Table> equivalent ─────────────────────────── */

@Component({
  selector: 'bui-semantic-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledRoot, BuiStyledSemanticTable, BuiStyledTHead, BuiStyledTHeadRow, BuiStyledTHeadCell, BuiStyledTBody, BuiStyledTBodyRow, BuiStyledTBodyCell],
  template: `
    <bui-ts-root
      [class]="rootClass()"
      [attr.data-divider]="divider()"
    >
      <table buiTsTable [style.min-width]="'100%'" [style.width]="horizontalScrollWidth() || null">
        <thead buiTsThead>
          <tr buiTsTheadRow>
            @for (col of columns(); track $index) {
              <th buiTsTh [class]="thClass()" [style.padding]="cellPadding()">{{ col }}</th>
            }
          </tr>
        </thead>
        <tbody buiTsTbody>
          @if (isLoading()) {
            <tr><td [attr.colspan]="columns().length" class="bui-ts__msg">{{ loadingMessage() }}</td></tr>
          } @else if (isEmpty()) {
            <tr><td [attr.colspan]="columns().length" class="bui-ts__msg">{{ emptyMessage() }}</td></tr>
          } @else {
            @for (row of data(); track rowIdx; let rowIdx = $index; let lastRow = $last) {
              <tr buiTsTbodyRow>
                @for (cell of row; track $index) {
                  <td buiTsTd
                    [class.bui-ts__td--border-bottom]="!lastRow && hasHorizBorder()"
                    [style.padding]="cellPadding()"
                  >{{ cell }}</td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </bui-ts-root>
  `,
})
export class BuiSemanticTable {
  readonly columns = input<string[]>([]);
  readonly data = input<unknown[][]>([]);
  readonly divider = input<Divider | null>(null);
  readonly size = input<TableSize>('default');
  readonly horizontalScrollWidth = input<string | null>(null);
  readonly isLoading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading...');
  readonly emptyMessage = input<string | null>(null);

  protected readonly isEmpty = computed(() => !this.isLoading() && this.data().length === 0);

  protected readonly cellPadding = computed(() => SIZE_PADDING[this.size()]);

  protected readonly rootClass = computed(() => {
    const d = this.divider();
    if (d === 'grid' || d === 'vertical') return 'bui-ts__root bui-ts__root--bordered';
    if (d === 'horizontal') return 'bui-ts__root bui-ts__root--border-bottom';
    return 'bui-ts__root';
  });

  protected readonly thClass = computed(() => {
    const d = this.divider();
    return d === 'clean' ? 'bui-ts__th bui-ts__th--clean' : 'bui-ts__th';
  });

  protected hasHorizBorder(): boolean {
    const d = this.divider();
    return d == null || d === 'horizontal' || d === 'grid';
  }
}

/* ── TableBuilder ───────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-table-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet, BuiTriangleUp, BuiTriangleDown],
  template: `
    <ng-content />
    <div
      data-baseweb="table-builder-semantic"
      class="bui-ts__root"
      [class.bui-ts__root--bordered]="divider() === 'grid' || divider() === 'vertical'"
      [class.bui-ts__root--border-bottom]="divider() === 'horizontal'"
    >
      <table class="bui-ts__table" [style.min-width]="'100%'" [style.width]="horizontalScrollWidth() || null">
        <thead class="bui-ts__thead">
          <tr class="bui-ts__thead-row">
            @for (col of cols(); track $index) {
              @if (col.sortable()) {
                <th
                  class="bui-ts__th bui-ts__th--sortable"
                  scope="col"
                  role="button"
                  tabindex="0"
                  [class.bui-ts__th--clean]="divider() === 'clean'"
                  [style.padding]="cellPadding()"
                  [style.text-align]="col.numeric() ? 'right' : null"
                  [attr.aria-label]="(col.header() || col.id()) + ', ' + sortLabel(col.id())"
                  (click)="handleSort(col.id())"
                  (keydown.enter)="handleSort(col.id())"
                  (keydown.space)="handleSort(col.id())"
                >
                  <span style="position:relative;display:inline-block;padding-right:20px">
                    {{ col.header() }}
                    <span class="bui-ts__sort-icon">
                      @if (sortColumn() === col.id() && sortOrder() === 'ASC') {
                        <bui-triangle-up [size]="16" />
                      } @else if (sortColumn() === col.id() && sortOrder() === 'DESC') {
                        <bui-triangle-down [size]="16" />
                      }
                    </span>
                  </span>
                </th>
              } @else {
                <th
                  class="bui-ts__th"
                  scope="col"
                  [class.bui-ts__th--clean]="divider() === 'clean'"
                  [style.padding]="cellPadding()"
                  [style.text-align]="col.numeric() ? 'right' : null"
                >{{ col.header() }}</th>
              }
            }
          </tr>
        </thead>
        <tbody class="bui-ts__tbody">
          @if (isLoading()) {
            <tr><td [attr.colspan]="cols().length" class="bui-ts__msg">{{ loadingMessage() }}</td></tr>
          } @else if (isEmptyState()) {
            <tr><td [attr.colspan]="cols().length" class="bui-ts__msg">{{ emptyMessage() }}</td></tr>
          } @else {
            @for (row of data(); track rowIdx; let rowIdx = $index; let lastRow = $last) {
              <tr class="bui-ts__tbody-row">
                @for (col of cols(); track $index) {
                  <td
                    class="bui-ts__td"
                    [class.bui-ts__td--border-bottom]="!lastRow && builderHorizBorder()"
                    [style.padding]="cellPadding()"
                    [style.text-align]="col.numeric() ? 'right' : null"
                    [style.vertical-align]="'top'"
                  >
                    @if (col.cellTpl()) {
                      <ng-container [ngTemplateOutlet]="col.cellTpl()!" [ngTemplateOutletContext]="{ $implicit: row, index: rowIdx }" />
                    }
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class BuiTableBuilder {
  readonly data = input<unknown[]>([]);
  readonly divider = input<Divider | null>(null);
  readonly size = input<TableSize>('default');
  readonly horizontalScrollWidth = input<string | null>(null);
  readonly sortColumn = input<string | null>(null);
  readonly sortOrder = input<'ASC' | 'DESC' | null>('ASC');
  readonly isLoading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading...');
  readonly emptyMessage = input<string | null>(null);

  readonly sort = output<string>();

  protected readonly cols = contentChildren(BuiTableBuilderColumn);

  protected readonly isEmptyState = computed(() => !this.isLoading() && this.data().length === 0);

  protected readonly cellPadding = computed(() => SIZE_PADDING[this.size()]);

  protected builderHorizBorder(): boolean {
    const d = this.divider();
    return d == null || d === 'horizontal' || d === 'grid';
  }

  protected sortLabel(colId: string | undefined): string {
    if (!colId) return 'not sorted';
    if (colId === this.sortColumn()) {
      return this.sortOrder() === 'ASC' ? 'ascending sorting' : 'descending sorting';
    }
    return 'not sorted';
  }

  protected handleSort(colId: string | undefined): void {
    if (colId) this.sort.emit(colId);
  }
}
