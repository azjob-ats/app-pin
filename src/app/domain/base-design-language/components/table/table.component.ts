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
import { OverlayModule } from '@angular/cdk/overlay';
import { Button } from '../button/button.component';
import { BuiTriangleUp, BuiTriangleDown, BuiFilterIcon } from '../icon/icon.component';

export type SortDirection = 'ASC' | 'DESC' | null;

/* ── Styled primitives (directives on host elements) ───────────────────────── */

@Directive({
  selector: 'bui-styled-table, [buiStyledTable]',
  host: { 'data-baseweb': 'table-custom', role: 'grid', class: 'bui-t__root' },
})
export class BuiStyledTable {}

@Directive({
  selector: 'bui-styled-head, [buiStyledHead]',
  host: { role: 'row', class: 'bui-t__head' },
})
export class BuiStyledHead {}

@Directive({
  selector: 'bui-styled-head-cell, [buiStyledHeadCell]',
  host: { role: 'columnheader', class: 'bui-t__head-cell' },
})
export class BuiStyledHeadCell {}

@Directive({
  selector: 'bui-styled-body, [buiStyledBody]',
  host: { role: 'rowgroup', class: 'bui-t__body' },
})
export class BuiStyledBody {}

@Directive({
  selector: 'bui-styled-row, [buiStyledRow]',
  host: { role: 'row', class: 'bui-t__row' },
})
export class BuiStyledRow {}

@Directive({
  selector: 'bui-styled-cell, [buiStyledCell]',
  host: { role: 'gridcell', class: 'bui-t__cell' },
})
export class BuiStyledCell {}

@Directive({
  selector: 'button[buiAction]',
  host: { class: 'bui-t__action', type: 'button' },
})
export class BuiStyledAction {}

/* ── SortableHeadCell ──────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-sortable-head-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTriangleUp, BuiTriangleDown],
  host: {
    role: 'columnheader',
    class: 'bui-t__head-cell',
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
export class BuiSortableHeadCell {
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

/* ── Filter ────────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-table-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule, Button, BuiFilterIcon],
  template: `
    <button
      #origin="cdkOverlayOrigin"
      cdkOverlayOrigin
      class="bui-t__filter-btn"
      [class.bui-t__filter-btn--active]="active()"
      [disabled]="disabled() || null"
      [attr.aria-expanded]="open()"
      [attr.aria-haspopup]="'dialog'"
      aria-label="Filter column"
      type="button"
      (click)="!disabled() && toggle()"
    >
      <bui-filter-icon [size]="18" />
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      cdkConnectedOverlayPanelClass="bw-root"
      (backdropClick)="close()"
      (overlayKeydown)="onKey($event)"
    >
      <div class="bui-t__filter-panel" role="dialog" aria-label="Filter column">
        <div class="bui-t__filter-heading">Filter Column</div>
        <div class="bui-t__filter-content">
          <ng-content />
        </div>
        <div class="bui-t__filter-footer">
          <bui-button kind="tertiary" size="compact" (buttonClick)="onSelectAll.emit()">
            Select All
          </bui-button>
          <bui-button kind="tertiary" size="compact" (buttonClick)="onReset.emit()">
            Reset
          </bui-button>
          @if (hasCloseButton()) {
            <bui-button kind="tertiary" size="compact" (buttonClick)="close()">
              Close
            </bui-button>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class BuiTableFilter {
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hasCloseButton = input(false, { transform: booleanAttribute });

  readonly onReset = output<void>();
  readonly onSelectAll = output<void>();
  readonly onOpen = output<void>();
  readonly onClose = output<void>();

  protected readonly open = signal(false);

  protected readonly positions = [
    { originX: 'start' as const, originY: 'bottom' as const, overlayX: 'start' as const, overlayY: 'top' as const },
  ];

  protected toggle(): void {
    const next = !this.open();
    this.open.set(next);
    next ? this.onOpen.emit() : this.onClose.emit();
  }

  protected close(): void {
    if (this.open()) {
      this.open.set(false);
      this.onClose.emit();
    }
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.close();
  }
}

/* ── High-level Table ──────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledTable, BuiStyledHead, BuiStyledHeadCell, BuiStyledBody, BuiStyledRow, BuiStyledCell],
  template: `
    <bui-styled-table
      data-baseweb="table"
      [attr.aria-colcount]="columns().length"
      [attr.aria-rowcount]="data().length"
    >
      <bui-styled-head [style.width]="horizontalScrollWidth() || null">
        @for (col of columns(); track $index) {
          <bui-styled-head-cell>{{ col }}</bui-styled-head-cell>
        }
      </bui-styled-head>
      <bui-styled-body [style.width]="horizontalScrollWidth() || null">
        @for (row of data(); track $index) {
          <bui-styled-row>
            @for (cell of row; track $index) {
              <bui-styled-cell>{{ cell }}</bui-styled-cell>
            }
          </bui-styled-row>
        }
      </bui-styled-body>
    </bui-styled-table>
  `,
})
export class BuiTable {
  readonly columns = input<string[]>([]);
  readonly data = input<unknown[][]>([[]]);
  readonly horizontalScrollWidth = input<string | null>(null);
}
