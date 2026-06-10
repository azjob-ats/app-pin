import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { BuiTriangleUp, BuiTriangleDown } from '../icon/icon.component';
import type { SortDirection } from '../table/table.component';

/* ── StyledTable (CSS grid) ────────────────────────────────────────────────── */

@Directive({
  selector: 'bui-styled-grid-table, [buiStyledGridTable]',
  host: {
    'data-baseweb': 'table-grid',
    role: 'grid',
    class: 'bui-tg__root',
    '[style.grid-template-columns]': 'gridTemplateColumns()',
  },
})
export class BuiStyledGridTable {
  readonly gridTemplateColumns = input<string>('repeat(auto-fill, 1fr)');
}

/* ── StyledHeadCell (sticky) ───────────────────────────────────────────────── */

@Directive({
  selector: 'bui-styled-grid-head-cell, [buiStyledGridHeadCell]',
  host: { role: 'columnheader', class: 'bui-tg__head-cell' },
})
export class BuiStyledGridHeadCell {}

/* ── StyledBodyCell ────────────────────────────────────────────────────────── */

@Directive({
  selector: 'bui-styled-body-cell, [buiStyledBodyCell]',
  host: {
    role: 'gridcell',
    class: 'bui-tg__body-cell',
    '[style.grid-column]': 'gridColumn()',
    '[style.grid-row]': 'gridRow()',
    '[class.bui-tg__body-cell--striped]': 'striped()',
  },
})
export class BuiStyledBodyCell {
  readonly gridColumn = input<string | null>(null);
  readonly gridRow = input<string | null>(null);
  readonly striped = input(false, { transform: booleanAttribute });
}

/* ── Grid SortableHeadCell ─────────────────────────────────────────────────── */

@Component({
  selector: 'bui-grid-sortable-head-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTriangleUp, BuiTriangleDown],
  host: {
    role: 'columnheader',
    class: 'bui-tg__head-cell',
    '[style.cursor]': 'fillClickTarget() && !disabled() ? "pointer" : null',
    '(click)': 'onHostClick()',
  },
  template: `
    <button
      class="bui-t__sortable-label"
      [disabled]="disabled() || null"
      [attr.aria-label]="resolvedAriaLabel()"
      (click)="onButtonClick($event)"
    >
      @if (direction() === 'ASC') {
        <bui-triangle-up [size]="16" title="Sort ascending" />
      } @else if (direction() === 'DESC') {
        <bui-triangle-down [size]="16" title="Sort descending" />
      }
      {{ title() }}
    </button>
    <ng-content />
  `,
})
export class BuiGridSortableHeadCell {
  readonly title = input<string>('');
  readonly direction = input<SortDirection>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fillClickTarget = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);

  readonly onSort = output<void>();

  protected readonly resolvedAriaLabel = computed(() =>
    this.ariaLabel() ?? `sorts table by ${this.title()} column`
  );

  protected onButtonClick(e: MouseEvent): void {
    if (!this.fillClickTarget()) {
      e.stopPropagation();
      if (!this.disabled()) this.onSort.emit();
    }
  }

  protected onHostClick(): void {
    if (this.fillClickTarget() && !this.disabled()) this.onSort.emit();
  }
}
