import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  signal,
  computed,
} from '@angular/core';
import {
  BuiSemanticTable,
  BuiTableBuilder,
  BuiTableBuilderColumn,
  BuiStyledRoot,
  BuiStyledSemanticTable,
  BuiStyledTHeadRow,
  BuiStyledTHeadCell,
  BuiStyledTBodyRow,
  BuiStyledTBodyCell,
} from './table-semantic.component';

const COLUMNS = ['Name', 'Age', 'Address'];
const DATA = [
  ['Sarah Brown', 31, '100 Broadway St., New York City, New York'],
  ['Jane Smith', 32, '100 Market St., San Francisco, California'],
  ['Joe Black', 33, '100 Macquarie St., Sydney, Australia'],
];

/* ── table-semantic ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-semantic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSemanticTable],
  styleUrl: './table-semantic.component.scss',
  template: `<bui-semantic-table [columns]="cols" [data]="rows" />`,
})
export class TableSemanticScenario {
  protected readonly cols = COLUMNS;
  protected readonly rows = DATA;
}

/* ── builder ────────────────────────────────────────────────────────────────── */

const BUILDER_DATA = [
  { foo: 10, bar: 'banana', url: 'https://example.com/b', selected: true },
  { foo: 1,  bar: 'carrot', url: 'https://example.com/c', selected: false },
  { foo: 2,  bar: 'apple',  url: 'https://example.com/a', selected: false },
  { foo: 10, bar: 'banana', url: 'https://example.com/b', selected: true },
  { foo: 1,  bar: 'carrot', url: 'https://example.com/c', selected: false },
  { foo: 2,  bar: 'apple',  url: 'https://example.com/a', selected: false },
];

@Component({
  selector: 'bui-s-table-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTableBuilder, BuiTableBuilderColumn],
  styleUrl: './table-semantic.component.scss',
  template: `
    <bui-table-builder [data]="sortedRows()" [sortColumn]="sortCol()" [sortOrder]="sortOrd()" (sort)="handleSort($event)">
      <bui-builder-column id="bar" header="Produce" sortable>
        <ng-template let-row><a [href]="row.url">{{ row.bar }}</a></ng-template>
      </bui-builder-column>
      <bui-builder-column id="foo" header="Quantity" numeric sortable>
        <ng-template let-row>{{ row.foo }}</ng-template>
      </bui-builder-column>
    </bui-table-builder>
  `,
})
export class TableBuilderScenario {
  protected readonly rows = BUILDER_DATA;
  protected readonly sortCol = signal<string | null>('bar');
  protected readonly sortOrd = signal<'ASC' | 'DESC' | null>('ASC');

  protected readonly sortedRows = computed(() => {
    const col = this.sortCol();
    const ord = this.sortOrd();
    if (!col || !ord) return this.rows;
    return [...this.rows].sort((a, b) => {
      const av = (a as Record<string, unknown>)[col];
      const bv = (b as Record<string, unknown>)[col];
      const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
      return ord === 'ASC' ? cmp : -cmp;
    });
  });

  protected handleSort(col: string): void {
    if (this.sortCol() === col) {
      this.sortOrd.update((o) => (o === 'ASC' ? 'DESC' : o === 'DESC' ? null : 'ASC'));
    } else {
      this.sortCol.set(col);
      this.sortOrd.set('ASC');
    }
  }
}

/* ── builder-divider ────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-builder-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTableBuilder, BuiTableBuilderColumn],
  styleUrl: './table-semantic.component.scss',
  template: `
    <div style="padding:24px">
      @for (d of dividers; track d) {
        <p style="font-size:14px;font-weight:500;margin:16px 0 4px">{{ d }}</p>
        <bui-table-builder [data]="rows" [divider]="d">
          <bui-builder-column id="bar" header="Produce" sortable>
            <ng-template let-row><a [href]="row.url">{{ row.bar }}</a></ng-template>
          </bui-builder-column>
          <bui-builder-column id="foo" header="Quantity" numeric sortable>
            <ng-template let-row>{{ row.foo }}</ng-template>
          </bui-builder-column>
        </bui-table-builder>
      }
    </div>
  `,
})
export class TableBuilderDividerScenario {
  protected readonly rows = BUILDER_DATA.slice(0, 3);
  protected readonly dividers = ['horizontal', 'vertical', 'grid', 'clean'] as const;
}

/* ── builder-icon-overrides ─────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-builder-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTableBuilder, BuiTableBuilderColumn],
  styleUrl: './table-semantic.component.scss',
  template: `
    <bui-table-builder [data]="rows" [sortColumn]="'bar'" sortOrder="ASC">
      <bui-builder-column id="bar" header="Produce" sortable>
        <ng-template let-row>{{ row.bar }}</ng-template>
      </bui-builder-column>
      <bui-builder-column header="Quantity" numeric>
        <ng-template let-row>{{ row.foo }}</ng-template>
      </bui-builder-column>
    </bui-table-builder>
  `,
})
export class TableBuilderIconOverridesScenario {
  protected readonly rows = BUILDER_DATA.slice(0, 3);
}

/* ── builder-size ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-builder-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTableBuilder, BuiTableBuilderColumn],
  styleUrl: './table-semantic.component.scss',
  template: `
    <div style="padding:24px">
      @for (sz of sizes; track sz) {
        <p style="font-size:14px;font-weight:500;margin:16px 0 4px">{{ sz }}</p>
        <bui-table-builder [data]="rows" [size]="sz">
          <bui-builder-column id="bar" header="Produce" sortable>
            <ng-template let-row><a [href]="row.url">{{ row.bar }}</a></ng-template>
          </bui-builder-column>
          <bui-builder-column header="Quantity" numeric>
            <ng-template let-row>{{ row.foo }}</ng-template>
          </bui-builder-column>
        </bui-table-builder>
      }
    </div>
  `,
})
export class TableBuilderSizeScenario {
  protected readonly rows = BUILDER_DATA.slice(0, 3);
  protected readonly sizes = ['compact', 'default', 'spacious'] as const;
}

/* ── compose (raw primitives with rowSpan/colSpan) ──────────────────────────── */

@Component({
  selector: 'bui-s-table-semantic-compose',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledRoot, BuiStyledSemanticTable, BuiStyledTHeadRow, BuiStyledTHeadCell, BuiStyledTBodyRow, BuiStyledTBodyCell],
  styleUrl: './table-semantic.component.scss',
  template: `
    <bui-ts-root>
      <table buiTsTable>
        <thead>
          <tr buiTsTheadRow>
            <th buiTsTh colspan="2">Parent</th>
            <th buiTsTh colspan="2">Children</th>
          </tr>
        </thead>
        <tbody>
          <tr buiTsTbodyRow>
            <td buiTsTd rowspan="3">Sarah</td>
            <td buiTsTd rowspan="3">Brown</td>
            <td buiTsTd class="bui-ts__td--border-bottom">Sally</td>
            <td buiTsTd class="bui-ts__td--border-bottom">Brown</td>
          </tr>
          <tr buiTsTbodyRow>
            <td buiTsTd class="bui-ts__td--border-bottom">Jimmy</td>
            <td buiTsTd class="bui-ts__td--border-bottom">Brown</td>
          </tr>
          <tr buiTsTbodyRow>
            <td buiTsTd class="bui-ts__td--border-bottom">Joe</td>
            <td buiTsTd class="bui-ts__td--border-bottom">Black</td>
          </tr>
          <tr buiTsTbodyRow>
            <td buiTsTd rowspan="2">Jane</td>
            <td buiTsTd rowspan="2">Smith</td>
            <td buiTsTd class="bui-ts__td--border-bottom">Molly</td>
            <td buiTsTd class="bui-ts__td--border-bottom">Smith</td>
          </tr>
          <tr buiTsTbodyRow>
            <td buiTsTd>Jesse</td>
            <td buiTsTd>Brown</td>
          </tr>
        </tbody>
      </table>
    </bui-ts-root>
  `,
})
export class TableSemanticComposeScenario {}

/* ── divider ────────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-semantic-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSemanticTable],
  styleUrl: './table-semantic.component.scss',
  template: `
    <div style="padding:24px">
      @for (item of configs; track item.label) {
        <p style="font-size:14px;font-weight:500;margin:16px 0 4px">{{ item.label }}</p>
        <bui-semantic-table [columns]="cols" [data]="rows" [divider]="item.divider" size="compact" />
      }
    </div>
  `,
})
export class TableSemanticDividerScenario {
  protected readonly cols = COLUMNS;
  protected readonly rows = DATA;
  protected readonly configs = [
    { label: 'horizontal / default', divider: 'horizontal' as const },
    { label: 'vertical', divider: 'vertical' as const },
    { label: 'grid', divider: 'grid' as const },
    { label: 'clean', divider: 'clean' as const },
  ];
}

/* ── size ───────────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-semantic-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSemanticTable],
  styleUrl: './table-semantic.component.scss',
  template: `
    <div style="padding:24px">
      @for (sz of sizes; track sz) {
        <p style="font-size:14px;font-weight:500;margin:16px 0 4px">{{ sz }}</p>
        <bui-semantic-table [columns]="cols" [data]="rows" [size]="sz" />
      }
    </div>
  `,
})
export class TableSemanticSizeScenario {
  protected readonly cols = COLUMNS;
  protected readonly rows = DATA;
  protected readonly sizes = ['compact', 'default', 'spacious'] as const;
}

/* ── spacious-sort ──────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-table-semantic-spacious-sort',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTableBuilder, BuiTableBuilderColumn],
  styleUrl: './table-semantic.component.scss',
  template: `
    <div style="padding:24px">
      <bui-table-builder [data]="rows" sortColumn="bar" sortOrder="ASC" size="spacious">
        <bui-builder-column id="bar" header="Produce" sortable>
          <ng-template let-row>{{ row[0] }}</ng-template>
        </bui-builder-column>
        <bui-builder-column header="Quantity" numeric>
          <ng-template let-row>{{ row[1] }}</ng-template>
        </bui-builder-column>
      </bui-table-builder>
    </div>
  `,
})
export class TableSemanticSpaciousSortScenario {
  protected readonly rows = DATA;
}
