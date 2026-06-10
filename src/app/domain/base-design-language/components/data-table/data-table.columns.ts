/* ─────────────────────────────────────────────────────────────────────────────
 * Data Table — Column definitions (faithful port of baseweb/data-table column
 * factory functions, adapted for Angular / TypeScript without React renderer)
 * ─────────────────────────────────────────────────────────────────────────── */

export const COLUMNS = {
  ANCHOR: 'anchor',
  BOOLEAN: 'boolean',
  CATEGORICAL: 'categorical',
  CUSTOM: 'custom',
  DATETIME: 'datetime',
  NUMERICAL: 'numerical',
  ROW_INDEX: 'row-index',
  STRING: 'string',
} as const;

export type ColumnKind = (typeof COLUMNS)[keyof typeof COLUMNS];

export const SORT_DIRECTIONS = { ASC: 'ASC', DESC: 'DESC' } as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export const NUMERICAL_FORMATS = {
  DEFAULT: 'DEFAULT',
  ACCOUNTING: 'ACCOUNTING',
  PERCENTAGE: 'PERCENTAGE',
} as const;

/* ── Types ── */

export type FilterType = 'categorical' | 'numerical' | 'boolean' | 'datetime' | 'string' | 'none';

export interface CategoricalFilterParams {
  selection: Set<string>;
  exclude: boolean;
  description: string;
}
export interface NumericalFilterParams {
  comparator: 'gte' | 'lte' | 'gt' | 'lt' | 'between';
  value1: number;
  value2?: number;
  description: string;
}
export interface BooleanFilterParams {
  selection: boolean;
  description: string;
}
export interface DatetimeFilterParams {
  startDate?: Date;
  endDate?: Date;
  description: string;
}

export type FilterParams =
  | CategoricalFilterParams
  | NumericalFilterParams
  | BooleanFilterParams
  | DatetimeFilterParams;

export interface ColumnDef<V = unknown, F = FilterParams> {
  kind: ColumnKind;
  title: string;
  sortable: boolean;
  filterable: boolean;
  fillWidth: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => V;
  sortFn: (a: V, b: V) => number;
  buildFilter: (params: F) => (value: V) => boolean;
  textQueryFilter?: (query: string, value: V) => boolean;
  formatCell: (value: V) => string;
  isAnchor?: boolean;
  getHref?: (value: V) => string;
  getCellStyle?: (value: V) => Record<string, string>;
  highlight?: (value: V) => boolean;
  filterType: FilterType;
  precision?: number;
  format?: string;
}

export interface Row {
  id: number | string;
  data: unknown;
}

export interface BatchAction {
  label: string;
  onClick: (params: { clearSelection: () => void; selection: Row[]; event: Event }) => void;
  icon?: string;
}

export interface RowAction {
  label: string;
  onClick: (params: { row: Row; event: Event }) => void;
  icon?: string;
}

export interface DataTableControlRef {
  clearSelection: () => void;
  getRows: () => Row[];
}

/* ── Column factory functions ── */

/* String */
export function StringColumn(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => string;
}): ColumnDef<string> {
  return {
    kind: COLUMNS.STRING,
    title: opts.title,
    sortable: opts.sortable !== false,
    filterable: opts.filterable !== false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    mapDataToValue: opts.mapDataToValue,
    formatCell: (v) => v ?? '',
    filterType: 'string',
    sortFn: (a, b) => a.localeCompare(b),
    buildFilter: (params: FilterParams) => {
      const q = ((params as { description: string }).description ?? '').toLowerCase();
      return (v) => (v ?? '').toLowerCase().includes(q);
    },
    textQueryFilter: (query, v) => (v ?? '').toLowerCase().includes(query.toLowerCase()),
  };
}

/* Numerical */
export function NumericalColumn(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  precision?: number;
  format?: string;
  highlight?: (n: number) => boolean;
  mapDataToValue: (data: unknown) => number;
}): ColumnDef<number> {
  const fmt = opts.format ?? NUMERICAL_FORMATS.DEFAULT;
  const prec = opts.precision ?? 0;

  function formatNum(n: number): string {
    if (fmt === NUMERICAL_FORMATS.ACCOUNTING) {
      const abs = Math.abs(n);
      const formatted = abs.toLocaleString(undefined, {
        minimumFractionDigits: prec,
        maximumFractionDigits: prec,
      });
      return n < 0 ? `($${formatted})` : `$${formatted}`;
    }
    if (fmt === NUMERICAL_FORMATS.PERCENTAGE) {
      return `${(n * 100).toFixed(prec)}%`;
    }
    return n.toLocaleString(undefined, {
      minimumFractionDigits: prec,
      maximumFractionDigits: prec,
    });
  }

  return {
    kind: COLUMNS.NUMERICAL,
    title: opts.title,
    sortable: opts.sortable !== false,
    filterable: opts.filterable !== false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    precision: prec,
    format: fmt,
    mapDataToValue: opts.mapDataToValue,
    formatCell: (v) => formatNum(v),
    filterType: 'numerical',
    highlight: opts.highlight,
    getCellStyle: opts.highlight
      ? (v) => (opts.highlight!(v) ? { color: '#c70000' } : {})
      : undefined,
    sortFn: (a, b) => a - b,
    buildFilter: (params: FilterParams) => {
      const p = params as NumericalFilterParams;
      return (v) => {
        switch (p.comparator) {
          case 'gte': return v >= p.value1;
          case 'lte': return v <= p.value1;
          case 'gt': return v > p.value1;
          case 'lt': return v < p.value1;
          case 'between': return v >= p.value1 && v <= (p.value2 ?? p.value1);
          default: return true;
        }
      };
    },
    textQueryFilter: (query, v) => String(v).includes(query),
  };
}

/* Categorical */
export function CategoricalColumn(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => string;
}): ColumnDef<string> {
  return {
    kind: COLUMNS.CATEGORICAL,
    title: opts.title,
    sortable: opts.sortable !== false,
    filterable: opts.filterable !== false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    mapDataToValue: opts.mapDataToValue,
    formatCell: (v) => v ?? '',
    filterType: 'categorical',
    sortFn: (a, b) => a.localeCompare(b),
    buildFilter: (params: FilterParams) => {
      const p = params as CategoricalFilterParams;
      if (!p.selection || p.selection.size === 0) return () => true;
      return (v) => {
        const match = p.selection.has(v);
        return p.exclude ? !match : match;
      };
    },
    textQueryFilter: (query, v) => (v ?? '').toLowerCase().includes(query.toLowerCase()),
  };
}

/* Boolean */
export function BooleanColumn(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => boolean;
}): ColumnDef<boolean> {
  return {
    kind: COLUMNS.BOOLEAN,
    title: opts.title,
    sortable: opts.sortable !== false,
    filterable: opts.filterable !== false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    mapDataToValue: opts.mapDataToValue,
    formatCell: (v) => (v ? 'T' : 'F'),
    filterType: 'boolean',
    sortFn: (a, b) => Number(a) - Number(b),
    buildFilter: (params: FilterParams) => {
      const p = params as BooleanFilterParams;
      return (v) => v === p.selection;
    },
  };
}

/* Datetime */
export function DatetimeColumn(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => Date;
}): ColumnDef<Date> {
  const fmt = new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  return {
    kind: COLUMNS.DATETIME,
    title: opts.title,
    sortable: opts.sortable !== false,
    filterable: opts.filterable !== false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    mapDataToValue: opts.mapDataToValue,
    formatCell: (v) => (v ? fmt.format(v) : ''),
    filterType: 'datetime',
    sortFn: (a, b) => (a?.getTime() ?? 0) - (b?.getTime() ?? 0),
    buildFilter: (params: FilterParams) => {
      const p = params as DatetimeFilterParams;
      return (v) => {
        if (!v) return false;
        const t = v.getTime();
        if (p.startDate && t < p.startDate.getTime()) return false;
        if (p.endDate && t > p.endDate.getTime()) return false;
        return true;
      };
    },
    textQueryFilter: (query, v) => (v ? fmt.format(v) : '').includes(query),
  };
}

/* Anchor */
export function AnchorColumn(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => { content: string; href: string };
}): ColumnDef<{ content: string; href: string }> {
  return {
    kind: COLUMNS.ANCHOR,
    title: opts.title,
    sortable: opts.sortable !== false,
    filterable: opts.filterable !== false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    mapDataToValue: opts.mapDataToValue,
    formatCell: (v) => v?.content ?? '',
    isAnchor: true,
    getHref: (v) => v?.href ?? '',
    filterType: 'string',
    sortFn: (a, b) => (a?.content ?? '').localeCompare(b?.content ?? ''),
    buildFilter: (params: FilterParams) => {
      const q = ((params as { description: string }).description ?? '').toLowerCase();
      return (v) => (v?.content ?? '').toLowerCase().includes(q);
    },
    textQueryFilter: (query, v) => (v?.content ?? '').toLowerCase().includes(query.toLowerCase()),
  };
}

/* Custom */
export function CustomColumn<V = unknown, F = FilterParams>(opts: {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  fillWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  mapDataToValue: (data: unknown) => V;
  formatCell?: (value: V) => string;
  getCellStyle?: (value: V) => Record<string, string>;
  sortFn?: (a: V, b: V) => number;
  buildFilter?: (params: F) => (value: V) => boolean;
  textQueryFilter?: (query: string, value: V) => boolean;
}): ColumnDef<V, F> {
  return {
    kind: COLUMNS.CUSTOM,
    title: opts.title,
    sortable: opts.sortable ?? false,
    filterable: opts.filterable ?? false,
    fillWidth: opts.fillWidth !== false,
    minWidth: opts.minWidth,
    maxWidth: opts.maxWidth,
    mapDataToValue: opts.mapDataToValue,
    formatCell: opts.formatCell ?? ((v) => String(v ?? '')),
    getCellStyle: opts.getCellStyle,
    filterType: 'none',
    sortFn: opts.sortFn ?? ((a, b) => String(a ?? '').localeCompare(String(b ?? ''))),
    buildFilter: opts.buildFilter ?? (() => () => true),
    textQueryFilter: opts.textQueryFilter,
  };
}

/* RowIndex */
export function RowIndexColumn(): ColumnDef<number> {
  return {
    kind: COLUMNS.ROW_INDEX,
    title: '',
    sortable: false,
    filterable: false,
    fillWidth: false,
    minWidth: 48,
    maxWidth: 48,
    mapDataToValue: () => 0,
    formatCell: () => '',
    filterType: 'none',
    sortFn: (a, b) => a - b,
    buildFilter: () => () => true,
  };
}
