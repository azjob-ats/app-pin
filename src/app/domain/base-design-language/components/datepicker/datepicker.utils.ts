/* ─────────────────────────────────────────────────────────────────────────────
 * Native-Date helpers — faithful port of baseweb DateHelpers (date-fns adapter)
 * ───────────────────────────────────────────────────────────────────────────── */

export const DEFAULT_FORMAT = 'yyyy/MM/dd';
export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

/* ── formatting ─────────────────────────────────────────────────────────────── */

const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_NAMES_MIN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatDate(date: Date, fmt: string, locale?: Intl.Locale | null): string {
  if (locale) {
    return formatDateLocale(date, fmt, locale);
  }
  const y = date.getFullYear();
  const M = date.getMonth(); // 0-based
  const d = date.getDate();
  const H = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const dow = date.getDay();

  return fmt
    .replace('EEEEEE', WEEKDAY_NAMES_MIN[dow])
    .replace('EEEE', WEEKDAY_NAMES_FULL[dow])
    .replace('EEE', WEEKDAY_NAMES_SHORT[dow])
    .replace('MMMM', MONTH_NAMES_FULL[M])
    .replace('MMM', MONTH_NAMES_SHORT[M])
    .replace('yyyy', String(y))
    .replace('yy', String(y).slice(-2))
    .replace('MM', zp(M + 1))
    .replace('M', String(M + 1))
    .replace('dd', zp(d))
    .replace('d', String(d))
    .replace('HH', zp(H))
    .replace('H', String(H))
    .replace('hh', zp(H % 12 || 12))
    .replace('h', String(H % 12 || 12))
    .replace('mm', zp(m))
    .replace('ss', zp(s))
    .replace('aa', H < 12 ? 'AM' : 'PM')
    .replace('a', H < 12 ? 'am' : 'pm');
}

function formatDateLocale(date: Date, fmt: string, locale: Intl.Locale): string {
  const locStr = locale.toString();
  const monthFull = new Intl.DateTimeFormat(locStr, { month: 'long' }).format(date);
  const monthShort = new Intl.DateTimeFormat(locStr, { month: 'short' }).format(date);
  const weekdayFull = new Intl.DateTimeFormat(locStr, { weekday: 'long' }).format(date);
  const weekdayShort = new Intl.DateTimeFormat(locStr, { weekday: 'short' }).format(date);
  const weekdayMin = new Intl.DateTimeFormat(locStr, { weekday: 'narrow' }).format(date);

  const y = date.getFullYear();
  const M = date.getMonth();
  const d = date.getDate();
  const H = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const dow = date.getDay();

  return fmt
    .replace('EEEEEE', weekdayMin)
    .replace('EEEE', weekdayFull)
    .replace('EEE', weekdayShort)
    .replace('MMMM', monthFull)
    .replace('MMM', monthShort)
    .replace('yyyy', String(y))
    .replace('yy', String(y).slice(-2))
    .replace('MM', zp(M + 1))
    .replace('M', String(M + 1))
    .replace('dd', zp(d))
    .replace('d', String(d))
    .replace('HH', zp(H))
    .replace('H', String(H))
    .replace('hh', zp(H % 12 || 12))
    .replace('h', String(H % 12 || 12))
    .replace('mm', zp(m))
    .replace('ss', zp(s))
    .replace('aa', H < 12 ? 'AM' : 'PM')
    .replace('a', H < 12 ? 'am' : 'pm')
    .replace(void 0 as unknown as string, void 0 as unknown as string); // noop to avoid unused var
}

export function getWeekdayMinNames(locale?: Intl.Locale | null): string[] {
  if (!locale) return WEEKDAY_NAMES_MIN;
  const locStr = locale.toString();
  const base = new Date(2021, 0, 3); // Sunday
  return WEEKDAYS.map((i) => {
    const d = new Date(base);
    d.setDate(3 + i);
    return new Intl.DateTimeFormat(locStr, { weekday: 'narrow' }).format(d);
  });
}

export function getMonthName(month: number, locale?: Intl.Locale | null): string {
  if (!locale) return MONTH_NAMES_FULL[month];
  return new Intl.DateTimeFormat(locale.toString(), { month: 'long' }).format(new Date(2021, month, 1));
}

function zp(n: number): string { return String(n).padStart(2, '0'); }

/* ── parsing ────────────────────────────────────────────────────────────────── */

export function parseDate(str: string, fmt: string): Date | null {
  if (!str) return null;
  const fmtToRegex = fmt
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace('yyyy', '(?<year>\\d{4})')
    .replace('MM', '(?<month>\\d{1,2})')
    .replace('M', '(?<month>\\d{1,2})')
    .replace('dd', '(?<day>\\d{1,2})')
    .replace('d', '(?<day>\\d{1,2})');
  try {
    const match = new RegExp('^' + fmtToRegex + '$').exec(str.trim());
    if (!match?.groups) return null;
    const { year, month, day } = match.groups;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

/* ── date arithmetic ─────────────────────────────────────────────────────────── */

export function today(): Date { return startOfDay(new Date()); }

export function startOfDay(d: Date): Date {
  const r = new Date(d); r.setHours(0, 0, 0, 0); return r;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  const day = r.getDate();
  r.setDate(1);
  r.setMonth(r.getMonth() + n);
  r.setDate(Math.min(day, daysInMonth(r.getFullYear(), r.getMonth())));
  return r;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

export function subDays(d: Date, n: number): Date { return addDays(d, -n); }

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isBefore(a: Date, b: Date): boolean { return a.getTime() < b.getTime(); }
export function isAfter(a: Date, b: Date): boolean { return a.getTime() > b.getTime(); }
export function isBeforeDay(a: Date, b: Date): boolean { return isBefore(startOfDay(a), startOfDay(b)); }
export function isAfterDay(a: Date, b: Date): boolean { return isAfter(startOfDay(a), startOfDay(b)); }

export function clamp(d: Date, min: Date | null | undefined, max: Date | null | undefined): Date {
  let r = d;
  if (min && isBefore(r, min)) r = min;
  if (max && isAfter(r, max)) r = max;
  return r;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns all day-cells for a calendar month (including peek days from adjacent months) */
export function getMonthDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const startDow = first.getDay(); // 0=Sun
  const days: Date[] = [];
  for (let i = 0; i < startDow; i++) {
    days.push(addDays(first, -(startDow - i)));
  }
  const last = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= last; i++) {
    days.push(new Date(year, month, i));
  }
  // fill to complete the last week (always 6 rows × 7 cols = 42 cells)
  while (days.length < 42) {
    days.push(addDays(days[days.length - 1], 1));
  }
  return days;
}

/* ── range helpers ──────────────────────────────────────────────────────────── */

export function isDayInRange(day: Date, start: Date | null | undefined, end: Date | null | undefined): boolean {
  if (!start || !end) return false;
  const s = startOfDay(start), e = startOfDay(end), d = startOfDay(day);
  const [lo, hi] = s <= e ? [s, e] : [e, s];
  return d > lo && d < hi;
}

export function isDayRangeStart(day: Date, value: (Date | null | undefined)[]): boolean {
  const [start] = value;
  return !!(start && isSameDay(day, start));
}

export function isDayRangeEnd(day: Date, value: (Date | null | undefined)[]): boolean {
  const end = value[1];
  return !!(end && isSameDay(day, end));
}

/* ── mask derivation from format string ─────────────────────────────────────── */

export function formatStringToMask(fmt: string): string {
  return fmt
    .replace(/[yY]/g, '9')
    .replace(/[Md]/g, '9')
    .replace(/[a-zA-Z]/g, '*');
}

/* ── display helpers ─────────────────────────────────────────────────────────── */

export function formatRangeDisplay(
  start: Date | null | undefined,
  end: Date | null | undefined,
  fmt: string,
  locale?: Intl.Locale | null
): string {
  if (!start && !end) return '';
  const s = start ? formatDate(start, fmt, locale) : '';
  const e = end ? formatDate(end, fmt, locale) : '';
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

/* ── quick select options ────────────────────────────────────────────────────── */

export interface QuickSelectOption {
  id: string;
  label: string;
  beginDate: Date;
  endDate: Date;
}

export function getDefaultQuickSelectOptions(ref?: Date): QuickSelectOption[] {
  const base = ref ?? today();
  const t = startOfDay(base);
  return [
    { id: 'past-7-days', label: 'Past 7 days', beginDate: subDays(t, 7), endDate: t },
    { id: 'past-30-days', label: 'Past 30 days', beginDate: subDays(t, 30), endDate: t },
    { id: 'past-3-months', label: 'Past 3 months', beginDate: addMonths(t, -3), endDate: t },
    { id: 'past-6-months', label: 'Past 6 months', beginDate: addMonths(t, -6), endDate: t },
    { id: 'past-year', label: 'Past year', beginDate: addMonths(t, -12), endDate: t },
    { id: 'past-2-years', label: 'Past 2 years', beginDate: addMonths(t, -24), endDate: t },
  ];
}
