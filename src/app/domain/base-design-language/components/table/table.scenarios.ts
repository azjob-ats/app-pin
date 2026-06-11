import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { BuiTable, BuiStyledTable, BuiStyledHead, BuiStyledHeadCell, BuiStyledBody, BuiStyledRow, BuiStyledCell, BuiStyledAction, BuiSortableHeadCell, BuiTableFilter } from './table.component';
import type { SortDirection } from './table.component';
import { Checkbox } from '../checkbox/checkbox.component';
import { Pagination } from '../pagination/pagination.component';
import { Button } from '../button/button.component';
import { Panel } from '../accordion/panel.component';
import { BuiSearch, BuiPlus, BuiDelete, BuiOverflowIcon, BuiArrowUp, BuiArrowDown } from '../icon/icon.component';
import { BuiPopover } from '../popover/popover.component';
import { BuiMenu } from '../menu/menu.component';
import type { MenuItem } from '../menu/menu.component';

const DATA_20: Array<[string, number]> = [
  ['Marlyn', 10], ['Luther', 15], ['Kiera', 13], ['Edna', 20],
  ['Soraya', 18], ['Dorris', 32], ['Astrid', 26], ['Wendie', 17],
  ['Marna', 11], ['Malka', 14], ['Jospeh', 10], ['Roselee', 12],
  ['Justine', 35], ['Marlon', 30], ['Mellissa', 32], ['Fausto', 21],
  ['Alfredia', 22], ['Abel', 18], ['Winford', 19], ['Neil', 27],
];

/* ── Borderless ─────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-borderless',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledTable, BuiStyledHead, BuiStyledHeadCell, BuiStyledBody, BuiStyledRow, BuiStyledCell],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:500px;width:400px">
      <bui-styled-table style="border:0">
        <bui-styled-head>
          <bui-styled-head-cell>Name</bui-styled-head-cell>
          <bui-styled-head-cell>Age</bui-styled-head-cell>
        </bui-styled-head>
        <bui-styled-body>
          @for (row of data; track $index) {
            <bui-styled-row>
              <bui-styled-cell>{{ row[0] }}</bui-styled-cell>
              <bui-styled-cell>{{ row[1] }}</bui-styled-cell>
            </bui-styled-row>
          }
        </bui-styled-body>
      </bui-styled-table>
    </div>
  `,
})
export class TableBorderlessScenario {
  protected readonly data = DATA_20;
}

/* ── Cells ──────────────────────────────────────────────────────────────────── */

const CELLS_DATA: Array<[string, string, string, number, number]> = [
  ['Marlyn', 'Engineering', 'San Francisco', -100, 1234.5],
  ['Luther', 'Marketing', 'Seattle', 50, 2435.2],
  ['Kiera', 'Operations', 'Los Angeles', 40, 8348.1],
  ['Edna', 'Design', 'Atlanta', 700, 2893.4],
  ['Soraya', 'Finance', 'Denver', 99, 8787.3],
  ['Dorris', 'Legal', 'Dallas', -20, 6325.2],
  ['Astrid', 'Product', 'Tempe', 0, 7392.7],
  ['Wendie', 'Engineering', 'Pittsburgh', -15, 9283.1],
  ['Marna', 'Marketing', 'Indianapolis', -2, 7720.9],
  ['Malka', 'Operations', 'New Orleans', 30, 6273.3],
];

@Component({
  selector: 'bui-s-table-cells',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledTable, BuiStyledHead, BuiStyledHeadCell, BuiStyledBody, BuiStyledRow, BuiStyledCell, BuiStyledAction, BuiSearch, BuiPlus, BuiDelete, BuiOverflowIcon, BuiArrowUp, BuiArrowDown, Panel],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:500px;width:900px">
      <bui-styled-table>
        <bui-styled-head>
          <bui-styled-head-cell>Name</bui-styled-head-cell>
          <bui-styled-head-cell>Role / City</bui-styled-head-cell>
          <bui-styled-head-cell>Delta</bui-styled-head-cell>
          <bui-styled-head-cell>Amount</bui-styled-head-cell>
          <bui-styled-head-cell>Notes</bui-styled-head-cell>
          <bui-styled-head-cell>Actions</bui-styled-head-cell>
        </bui-styled-head>
        <bui-styled-body>
          @for (row of data; track $index) {
            <bui-styled-row>
              <bui-styled-cell>{{ row[0] }}</bui-styled-cell>
              <bui-styled-cell style="flex-direction:column;align-items:flex-start;justify-content:center">
                <span style="font-size:12px;color:#545454">{{ row[2] }}</span>
                <span>{{ row[1] }}</span>
              </bui-styled-cell>
              <bui-styled-cell [style.color]="row[3] < 0 ? '#ae1900' : '#027a48'" [style.align-items]="'center'">
                @if (row[3] < 0) {
                  <bui-arrow-down [size]="20" />
                } @else {
                  <bui-arrow-up [size]="20" />
                }
                {{ row[3] }}%
              </bui-styled-cell>
              <bui-styled-cell style="align-items:center;font-size:16px;font-weight:500">
                {{ row[4] }}
              </bui-styled-cell>
              <bui-styled-cell style="padding:0">
                <bui-panel [title]="'Details'" style="width:100%">Row {{ $index + 1 }} details</bui-panel>
              </bui-styled-cell>
              <bui-styled-cell>
                <button buiAction aria-label="Search"><bui-search /></button>
                <button buiAction aria-label="Add"><bui-plus /></button>
                <button buiAction aria-label="Delete"><bui-delete /></button>
                <button buiAction aria-label="More options"><bui-overflow-icon /></button>
              </bui-styled-cell>
            </bui-styled-row>
          }
        </bui-styled-body>
      </bui-styled-table>
    </div>
  `,
})
export class TableCellsScenario {
  protected readonly data = CELLS_DATA;
}

/* ── Few rows ───────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-few-rows',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTable],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:400px;width:800px">
      <bui-table [columns]="cols" [data]="rows" />
    </div>
  `,
})
export class TableFewRowsScenario {
  protected readonly cols = Array.from({ length: 3 }, () => 'Column Name');
  protected readonly rows = Array.from({ length: 4 }, () => Array.from({ length: 3 }, () => 'Cell Data'));
}

/* ── Filter ─────────────────────────────────────────────────────────────────── */

const FILTER_DATA = Array.from({ length: 100 }, (_, i) => [i, 'row title']);
const FILTER_FNS = Array.from({ length: 10 }, (_, i) => (row: unknown[]) => (row[0] as number) % (i + 1) === 0);

@Component({
  selector: 'bui-s-table-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledTable, BuiStyledHead, BuiStyledHeadCell, BuiStyledBody, BuiStyledRow, BuiStyledCell, BuiTableFilter, Checkbox],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:500px">
      <bui-styled-table>
        <bui-styled-head>
          <bui-styled-head-cell>
            Number
            <bui-table-filter
              [active]="filters().length > 0"
              hasCloseButton
              (onReset)="filters.set([])"
              (onSelectAll)="filters.set(allIndexes)"
            >
              @for (fn of filterFns; track $index) {
                <label buiCheckbox
                  [checked]="filters().includes($index)"
                  (checkedChange)="toggleFilter($index)"
                  style="margin-top:8px;margin-bottom:8px"
                >
                  Divisible by {{ $index + 1 }}
                </label>
              }
            </bui-table-filter>
          </bui-styled-head-cell>
          <bui-styled-head-cell>Title</bui-styled-head-cell>
        </bui-styled-head>
        <bui-styled-body>
          @for (row of filteredData(); track $index) {
            <bui-styled-row>
              <bui-styled-cell>{{ row[0] }}</bui-styled-cell>
              <bui-styled-cell>{{ row[1] }}</bui-styled-cell>
            </bui-styled-row>
          }
        </bui-styled-body>
      </bui-styled-table>
    </div>
  `,
})
export class TableFilterScenario {
  protected readonly filterFns = FILTER_FNS;
  protected readonly allIndexes = Array.from({ length: 10 }, (_, i) => i);
  protected readonly filters = signal<number[]>([]);

  protected readonly filteredData = computed(() => {
    const active = this.filters();
    if (!active.length) return FILTER_DATA;
    return active.reduce((data: unknown[][], idx) => data.filter(FILTER_FNS[idx]), FILTER_DATA as unknown[][]);
  });

  protected toggleFilter(index: number): void {
    this.filters.update((arr) =>
      arr.includes(index) ? arr.filter((i) => i !== index) : [...arr, index]
    );
  }
}

/* ── Pagination ─────────────────────────────────────────────────────────────── */

const PAGE_COLS = Array.from({ length: 5 }, () => 'Label');
const PAGE_DATA = Array.from({ length: 45 }, (_, i) => Array.from({ length: 5 }, () => `row: ${i + 1}`));
const ROW_LIMITS: MenuItem[] = Array.from({ length: 10 }, (_, i) => ({ label: String((i + 1) * 5) }));

@Component({
  selector: 'bui-s-table-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTable, Pagination, Button, BuiPopover, BuiMenu],
  styleUrl: './table.component.scss',
  template: `
    <div style="width:968px">
      <div style="display:flex;justify-content:space-between;padding:16px 0">
        <strong>Table Example</strong>
        <bui-button>Action</bui-button>
      </div>
      <div style="height:500px">
        <bui-table [columns]="cols" [data]="window()" />
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 32px">
        <bui-popover placement="bottom">
          <bui-button kind="tertiary">{{ limit() }} Rows ▾</bui-button>
          <div buiPopoverContent>
            <bui-menu [items]="rowLimits" (itemSelect)="setLimit(+$event.label!)" />
          </div>
        </bui-popover>
        <bui-pagination
          [numPages]="numPages()"
          [current]="page()"
          (currentChange)="setPage($event)"
        />
      </div>
    </div>
  `,
})
export class TablePaginationScenario {
  protected readonly cols = PAGE_COLS;
  protected readonly rowLimits = ROW_LIMITS;
  protected readonly page = signal(1);
  protected readonly limit = signal(12);

  protected readonly numPages = computed(() => Math.ceil(PAGE_DATA.length / this.limit()));

  protected readonly window = computed(() => {
    const min = (this.page() - 1) * this.limit();
    return PAGE_DATA.slice(min, min + this.limit());
  });

  protected setPage(next: number): void {
    if (next >= 1 && next <= this.numPages()) this.page.set(next);
  }

  protected setLimit(next: number): void {
    this.limit.set(next);
    const maxPage = this.numPages();
    if (this.page() > maxPage) this.page.set(maxPage);
  }
}

/* ── Scroll ─────────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-scroll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTable],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:500px;max-width:1200px">
      <bui-table [columns]="cols" [data]="rows" horizontalScrollWidth="2200px" />
    </div>
  `,
})
export class TableScrollScenario {
  protected readonly cols = Array.from({ length: 10 }, () => 'Column Name');
  protected readonly rows = Array.from({ length: 40 }, () => Array.from({ length: 10 }, () => 'Cell Data'));
}

/* ── Sortable ───────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-sortable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledTable, BuiStyledHead, BuiStyledBody, BuiStyledRow, BuiStyledCell, BuiSortableHeadCell],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:500px;width:400px">
      <bui-styled-table>
        <bui-styled-head>
          <bui-sortable-head-cell
            title="Name"
            [direction]="nameDir()"
            (onSort)="handleSort('name')"
          />
          <bui-sortable-head-cell
            title="Age"
            [direction]="ageDir()"
            disabled
            (onSort)="handleSort('age')"
          />
        </bui-styled-head>
        <bui-styled-body>
          @for (row of sortedData(); track $index) {
            <bui-styled-row>
              <bui-styled-cell>{{ row[0] }}</bui-styled-cell>
              <bui-styled-cell>{{ row[1] }}</bui-styled-cell>
            </bui-styled-row>
          }
        </bui-styled-body>
      </bui-styled-table>
    </div>
  `,
})
export class TableSortableScenario {
  protected readonly nameDir = signal<SortDirection>(null);
  protected readonly ageDir = signal<SortDirection>(null);

  protected handleSort(col: 'name' | 'age'): void {
    const prev = col === 'name' ? this.nameDir() : this.ageDir();
    const next: SortDirection = prev === null ? 'ASC' : prev === 'ASC' ? 'DESC' : null;
    if (col === 'name') { this.nameDir.set(next); this.ageDir.set(null); }
    else { this.ageDir.set(next); this.nameDir.set(null); }
  }

  protected sortedData(): Array<[string, number]> {
    const nd = this.nameDir(), ad = this.ageDir();
    if (nd) {
      const s = [...DATA_20].sort((a, b) => a[0].localeCompare(b[0]));
      return nd === 'ASC' ? s : s.reverse();
    }
    if (ad) {
      const s = [...DATA_20].sort((a, b) => a[1] - b[1]);
      return ad === 'ASC' ? s : s.reverse();
    }
    return DATA_20;
  }
}

/* ── Sortable fill-click ────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-sortable-fill-click',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledTable, BuiStyledHead, BuiStyledBody, BuiStyledRow, BuiStyledCell, BuiSortableHeadCell],
  styleUrl: './table.component.scss',
  template: `
    <div style="height:500px;width:400px">
      <bui-styled-table>
        <bui-styled-head>
          <bui-sortable-head-cell
            title="Name"
            [direction]="nameDir()"
            fillClickTarget
            (onSort)="handleSort('name')"
          />
          <bui-sortable-head-cell
            title="Age"
            [direction]="ageDir()"
            disabled
            fillClickTarget
            (onSort)="handleSort('age')"
          />
        </bui-styled-head>
        <bui-styled-body>
          @for (row of sortedData(); track $index) {
            <bui-styled-row>
              <bui-styled-cell tabindex="0">{{ row[0] }}</bui-styled-cell>
              <bui-styled-cell tabindex="0">{{ row[1] }}</bui-styled-cell>
            </bui-styled-row>
          }
        </bui-styled-body>
      </bui-styled-table>
    </div>
  `,
})
export class TableSortableFillClickScenario {
  protected readonly nameDir = signal<SortDirection>(null);
  protected readonly ageDir = signal<SortDirection>(null);

  protected handleSort(col: 'name' | 'age'): void {
    const prev = col === 'name' ? this.nameDir() : this.ageDir();
    const next: SortDirection = prev === null ? 'ASC' : prev === 'ASC' ? 'DESC' : null;
    if (col === 'name') { this.nameDir.set(next); this.ageDir.set(null); }
    else { this.ageDir.set(next); this.nameDir.set(null); }
  }

  protected sortedData(): Array<[string, number]> {
    const nd = this.nameDir(), ad = this.ageDir();
    if (nd) {
      const s = [...DATA_20].sort((a, b) => a[0].localeCompare(b[0]));
      return nd === 'ASC' ? s : s.reverse();
    }
    if (ad) {
      const s = [...DATA_20].sort((a, b) => a[1] - b[1]);
      return ad === 'ASC' ? s : s.reverse();
    }
    return DATA_20;
  }
}
