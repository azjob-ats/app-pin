import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { BuiInput } from '../input/input.component';
import { BuiChevronLeft, BuiChevronRight, BuiChevronDown } from '../icon/icon.component';
import { BuiTimePicker } from '../timepicker/timepicker.component';
import {
  DEFAULT_FORMAT,
  QuickSelectOption,
  addDays,
  addMonths,
  endOfMonth,
  formatDate,
  formatRangeDisplay,
  formatStringToMask,
  getDefaultQuickSelectOptions,
  getMonthDays,
  getMonthName,
  getWeekdayMinNames,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  isSameMonth,
  parseDate,
  startOfDay,
  startOfMonth,
  today,
} from './datepicker.utils';

/* ─── types ─────────────────────────────────────────────────────────────────── */

export type DatepickerDensity = 'default' | 'high';
export type DatepickerOrientation = 'horizontal' | 'vertical';
export type InputRole = 'startDate' | 'endDate';

/* ─── DayCell ────────────────────────────────────────────────────────────────── */

interface DayCell {
  date: Date;
  outsideMonth: boolean;
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isHighlighted: boolean;
  pseudoHighlighted: boolean;
  startOfMonth: boolean;
  endOfMonth: boolean;
  dateLabel: string | null;
}

function buildDayCell(
  date: Date,
  monthRef: Date,
  value: (Date | null | undefined)[],
  highlightedDate: Date | null | undefined,
  hoveredDate: Date | null | undefined,
  range: boolean,
  minDate: Date | null | undefined,
  maxDate: Date | null | undefined,
  excludeDates: Date[] | null | undefined,
  filterDate: ((d: Date) => boolean) | null | undefined,
  includeDates: Date[] | null | undefined,
  peekNextMonth: boolean,
  dateLabelFn: ((d: Date) => string | null) | null | undefined,
): DayCell {
  const dom = startOfDay(date);
  const outsideMonth = !isSameMonth(date, monthRef);
  let disabled = outsideMonth && !peekNextMonth;
  if (!disabled && minDate && isBeforeDay(date, minDate)) disabled = true;
  if (!disabled && maxDate && isAfterDay(date, maxDate)) disabled = true;
  if (!disabled && excludeDates?.some((ed) => isSameDay(ed, date))) disabled = true;
  if (!disabled && includeDates && !includeDates.some((id) => isSameDay(id, date))) disabled = true;
  if (!disabled && filterDate && !filterDate(date)) disabled = true;

  const [start, end] = value;
  const selected = value.some((v) => v && isSameDay(v, date));
  const isRangeStart = !!(range && start && isSameDay(start, date));
  const isRangeEnd = !!(range && end && isSameDay(end, date));
  const inRange =
    range && !!start && !!end
      ? (() => {
          const s = startOfDay(start);
          const e = startOfDay(end);
          const [lo, hi] = s <= e ? [s, e] : [e, s];
          return dom > lo && dom < hi;
        })()
      : false;

  const isHighlighted = !!(
    (highlightedDate && isSameDay(highlightedDate, date)) ||
    (hoveredDate && isSameDay(hoveredDate, date))
  );

  const pseudoHighlighted = (() => {
    if (!range || (start && end)) return false;
    const anchor = start ?? end;
    const hov = hoveredDate ?? highlightedDate;
    if (!anchor || !hov) return false;
    const a = startOfDay(anchor);
    const h = startOfDay(hov);
    const [lo, hi] = a <= h ? [a, h] : [h, a];
    return dom > lo && dom < hi;
  })();

  const sof = isSameDay(date, startOfMonth(monthRef));
  const eof = isSameDay(date, endOfMonth(monthRef));
  const dateLabel = (!outsideMonth && dateLabelFn) ? dateLabelFn(date) : null;

  return {
    date, outsideMonth, disabled, selected, inRange,
    isRangeStart, isRangeEnd, isHighlighted, pseudoHighlighted,
    startOfMonth: sof, endOfMonth: eof, dateLabel,
  };
}

/* ─── CalendarMonth ──────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-calendar-month',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-dp__month-header">
      @for (wd of weekdays(); track wd) {
        <div class="bui-dp__weekday" aria-hidden="true">{{ wd }}</div>
      }
    </div>
    <div class="bui-dp__weeks">
      @for (row of weeks(); track $index) {
        <div class="bui-dp__week">
          @for (cell of row; track cell.date.getTime()) {
            <button
              class="bui-dp__day"
              type="button"
              [attr.tabindex]="(cell.isHighlighted || cell.selected) ? 0 : -1"
              [attr.aria-selected]="cell.selected || cell.inRange || cell.isRangeStart || cell.isRangeEnd"
              [attr.aria-disabled]="cell.disabled || null"
              [class.bui-dp__day--outside-month]="cell.outsideMonth"
              [class.bui-dp__day--disabled]="cell.disabled"
              [class.bui-dp__day--selected]="cell.selected && !cell.inRange"
              [class.bui-dp__day--range-start]="cell.isRangeStart"
              [class.bui-dp__day--range-end]="cell.isRangeEnd"
              [class.bui-dp__day--in-range]="cell.inRange"
              [class.bui-dp__day--highlighted]="cell.isHighlighted && !cell.selected"
              [class.bui-dp__day--pseudo-highlighted]="cell.pseudoHighlighted"
              [class.bui-dp__day--start-of-month]="cell.startOfMonth"
              [class.bui-dp__day--end-of-month]="cell.endOfMonth"
              (click)="!cell.disabled && dayClick.emit(cell.date)"
              (mouseenter)="dayHover.emit(cell.date)"
              (mouseleave)="dayLeave.emit()"
              (focus)="dayFocus.emit(cell.date)"
              (blur)="dayBlur.emit()"
              (keydown)="onDayKeydown($event, cell.date)"
            >
              <div class="bui-dp__day-inner">{{ cell.date.getDate() }}</div>
              @if (cell.dateLabel) {
                <div class="bui-dp__day-label">{{ cell.dateLabel }}</div>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class BuiCalendarMonth implements OnChanges {
  readonly month = input.required<Date>();
  readonly value = input<(Date | null | undefined)[]>([]);
  readonly highlightedDate = input<Date | null | undefined>(null);
  readonly hoveredDate = input<Date | null | undefined>(null);
  readonly range = input(false, { transform: booleanAttribute });
  readonly peekNextMonth = input(false, { transform: booleanAttribute });
  readonly minDate = input<Date | null | undefined>(null);
  readonly maxDate = input<Date | null | undefined>(null);
  readonly excludeDates = input<Date[] | null | undefined>(null);
  readonly filterDate = input<((d: Date) => boolean) | null | undefined>(null);
  readonly includeDates = input<Date[] | null | undefined>(null);
  readonly density = input<DatepickerDensity>('default');
  readonly locale = input<Intl.Locale | null | undefined>(null);
  readonly dateLabelFn = input<((d: Date) => string | null) | null | undefined>(null);

  readonly dayClick = output<Date>();
  readonly dayHover = output<Date>();
  readonly dayLeave = output<void>();
  readonly dayFocus = output<Date>();
  readonly dayBlur = output<void>();
  readonly dayKeydown = output<{ event: KeyboardEvent; date: Date }>();

  protected readonly weekdays = computed(() => getWeekdayMinNames(this.locale()));
  protected rows: DayCell[][] = [];

  protected get weeks(): () => DayCell[][] { return () => this.rows; }

  ngOnChanges(_: SimpleChanges): void {
    this.rebuildWeeks();
  }

  private rebuildWeeks(): void {
    const m = this.month();
    const cells = getMonthDays(m.getFullYear(), m.getMonth()).map((d) =>
      buildDayCell(
        d, m, this.value(), this.highlightedDate(), this.hoveredDate(),
        this.range(), this.minDate(), this.maxDate(),
        this.excludeDates(), this.filterDate(), this.includeDates(),
        this.peekNextMonth(), this.dateLabelFn()
      )
    );
    const rows: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    this.rows = rows;
  }

  protected onDayKeydown(event: KeyboardEvent, date: Date): void {
    this.dayKeydown.emit({ event, date });
  }
}

/* ─── CalendarHeader ─────────────────────────────────────────────────────────── */

const MIN_YEAR = 2000;
const MAX_YEAR = 2040;

@Component({
  selector: 'bui-calendar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule, BuiChevronLeft, BuiChevronRight, BuiChevronDown],
  template: `
    <div class="bui-dp__header" [class.bui-dp__header--dense]="density() === 'high'">
      @if (showPrev()) {
        <button
          class="bui-dp__nav-btn bui-dp__nav-btn--prev"
          type="button"
          aria-label="Previous month"
          [disabled]="prevDisabled()"
          (click)="prevMonth.emit()"
        >
          <bui-chevron-left size="24" />
        </button>
      } @else {
        <span></span>
      }

      <button
        #monthOrigin="cdkOverlayOrigin"
        cdkOverlayOrigin
        class="bui-dp__month-year-btn"
        type="button"
        [attr.aria-expanded]="monthOpen()"
        (click)="monthOpen.update((v) => !v)"
      >
        {{ monthName() }}
        <bui-chevron-down size="16" />
      </button>

      <button
        #yearOrigin="cdkOverlayOrigin"
        cdkOverlayOrigin
        class="bui-dp__month-year-btn"
        type="button"
        [attr.aria-expanded]="yearOpen()"
        (click)="yearOpen.update((v) => !v)"
      >
        {{ date().getFullYear() }}
        <bui-chevron-down size="16" />
      </button>

      @if (showNext()) {
        <button
          class="bui-dp__nav-btn bui-dp__nav-btn--next"
          type="button"
          aria-label="Next month"
          [disabled]="nextDisabled()"
          (click)="nextMonth.emit()"
        >
          <bui-chevron-right size="24" />
        </button>
      } @else {
        <span></span>
      }
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="monthOrigin"
      [cdkConnectedOverlayOpen]="monthOpen()"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      cdkConnectedOverlayPanelClass="bw-root"
      [cdkConnectedOverlayPositions]="dropdownPositions"
      (backdropClick)="monthOpen.set(false)"
    >
      <div class="bui-dp__dropdown" role="listbox" aria-label="Select month">
        @for (item of monthItems(); track item.month) {
          <div
            class="bui-dp__dropdown-item"
            role="option"
            tabindex="0"
            [class.bui-dp__dropdown-item--disabled]="item.disabled"
            [class.bui-dp__dropdown-item--selected]="item.month === date().getMonth()"
            (click)="!item.disabled && selectMonth(item.month)"
            (keydown.enter)="!item.disabled && selectMonth(item.month)"
          >{{ item.label }}</div>
        }
      </div>
    </ng-template>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="yearOrigin"
      [cdkConnectedOverlayOpen]="yearOpen()"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      cdkConnectedOverlayPanelClass="bw-root"
      [cdkConnectedOverlayPositions]="dropdownPositions"
      (backdropClick)="yearOpen.set(false)"
    >
      <div class="bui-dp__dropdown bui-dp__dropdown--year" role="listbox" aria-label="Select year">
        @for (yr of yearItems(); track yr.year) {
          <div
            class="bui-dp__dropdown-item"
            role="option"
            tabindex="0"
            [class.bui-dp__dropdown-item--disabled]="yr.disabled"
            [class.bui-dp__dropdown-item--selected]="yr.year === date().getFullYear()"
            (click)="!yr.disabled && selectYear(yr.year)"
            (keydown.enter)="!yr.disabled && selectYear(yr.year)"
          >{{ yr.year }}</div>
        }
      </div>
    </ng-template>
  `,
})
export class BuiCalendarHeader {
  readonly date = input.required<Date>();
  readonly density = input<DatepickerDensity>('default');
  readonly minDate = input<Date | null | undefined>(null);
  readonly maxDate = input<Date | null | undefined>(null);
  readonly locale = input<Intl.Locale | null | undefined>(null);
  readonly showPrev = input(true, { transform: booleanAttribute });
  readonly showNext = input(true, { transform: booleanAttribute });
  readonly order = input(0);

  readonly prevMonth = output<void>();
  readonly nextMonth = output<void>();
  readonly monthYearChange = output<Date>();

  protected readonly monthOpen = signal(false);
  protected readonly yearOpen = signal(false);

  protected readonly monthName = computed(() => getMonthName(this.date().getMonth(), this.locale()));

  protected readonly prevDisabled = computed(() => {
    const min = this.minDate();
    if (!min) return false;
    return !isAfterDay(startOfMonth(this.date()), min);
  });

  protected readonly nextDisabled = computed(() => {
    const max = this.maxDate();
    if (!max) return false;
    return !isBeforeDay(endOfMonth(this.date()), max);
  });

  protected readonly monthItems = computed(() => {
    const d = this.date();
    const min = this.minDate();
    const max = this.maxDate();
    const locale = this.locale();
    return Array.from({ length: 12 }, (_, i) => {
      const candidate = new Date(d.getFullYear(), i, 1);
      const disabled =
        (min ? isBeforeDay(endOfMonth(candidate), min) : false) ||
        (max ? isAfterDay(startOfMonth(candidate), max) : false);
      return { month: i, label: getMonthName(i, locale), disabled };
    });
  });

  protected readonly yearItems = computed(() => {
    const d = this.date();
    const min = this.minDate();
    const max = this.maxDate();
    return Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
      const year = MIN_YEAR + i;
      const disabled =
        (min ? year < min.getFullYear() : false) ||
        (max ? year > max.getFullYear() : false);
      return { year, disabled };
    });
  });

  protected readonly dropdownPositions = [
    { originX: 'start' as const, originY: 'bottom' as const, overlayX: 'start' as const, overlayY: 'top' as const },
    { originX: 'start' as const, originY: 'top' as const, overlayX: 'start' as const, overlayY: 'bottom' as const },
  ];

  protected selectMonth(month: number): void {
    const d = this.date();
    this.monthOpen.set(false);
    this.monthYearChange.emit(new Date(d.getFullYear(), month, 1));
  }

  protected selectYear(year: number): void {
    const d = this.date();
    this.yearOpen.set(false);
    this.monthYearChange.emit(new Date(year, d.getMonth(), 1));
  }
}

/* ─── Calendar (controlled) ──────────────────────────────────────────────────── */

@Component({
  selector: 'bui-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCalendarMonth, BuiCalendarHeader, BuiTimePicker],
  styleUrl: './datepicker.component.scss',
  host: { 'data-baseweb': 'calendar', class: 'bui-dp__calendar' },
  template: `
    <div class="bui-dp__root" [class.bui-dp__root--dense]="density() === 'high'">
      @if (quickSelect() && range()) {
        <div class="bui-dp__quick-select">
          <select
            class="bui-dp__qs-select"
            aria-label="Quick select date range"
            [value]="quickSelectId()"
            (change)="onQuickSelect($event)"
          >
            <option value="">Custom range</option>
            @for (opt of quickSelectOptions(); track opt.id) {
              <option [value]="opt.id">{{ opt.label }}</option>
            }
          </select>
        </div>
      }

      <div
        class="bui-dp__months"
        [class.bui-dp__months--vertical]="orientation() === 'vertical'"
      >
        @for (monthDate of visibleMonths(); track monthDate.getTime(); let i = $index; let last = $last) {
          <div class="bui-dp__month-wrap">
            <bui-calendar-header
              [date]="monthDate"
              [density]="density()"
              [minDate]="minDate()"
              [maxDate]="maxDate()"
              [locale]="locale()"
              [showPrev]="i === 0"
              [showNext]="last"
              [order]="i"
              (prevMonth)="shiftMonth(-1)"
              (nextMonth)="shiftMonth(1)"
              (monthYearChange)="onMonthYearChange($event, i)"
            />
            <bui-calendar-month
              [month]="monthDate"
              [value]="normalizedValue()"
              [highlightedDate]="highlightedDate()"
              [hoveredDate]="hoveredDate()"
              [range]="range()"
              [peekNextMonth]="peekNextMonth()"
              [minDate]="minDate()"
              [maxDate]="maxDate()"
              [excludeDates]="excludeDates()"
              [filterDate]="filterDate()"
              [includeDates]="includeDates()"
              [density]="density()"
              [locale]="locale()"
              [dateLabelFn]="dateLabel()"
              (dayClick)="onDayClick($event)"
              (dayHover)="hoveredDate.set($event)"
              (dayLeave)="hoveredDate.set(null)"
              (dayFocus)="onDayFocus($event)"
              (dayBlur)="onDayBlur()"
              (dayKeydown)="onDayKeydown($event.event, $event.date)"
            />
          </div>
        }
      </div>

      @if (timeSelectStart() || timeSelectEnd()) {
        <div class="bui-dp__time-row">
          @if (timeSelectStart()) {
            <div class="bui-dp__time-col">
              <div class="bui-dp__time-label">Start Time</div>
              <bui-time-picker
                [value]="timeStart()"
                (changed)="onTimeChange($event, 'start')"
              />
            </div>
          }
          @if (timeSelectEnd() && range()) {
            <div class="bui-dp__time-col">
              <div class="bui-dp__time-label">End Time</div>
              <bui-time-picker
                [value]="timeEnd()"
                (changed)="onTimeChange($event, 'end')"
              />
            </div>
          }
        </div>
      }

      @if (primaryButton() || secondaryButton()) {
        <div class="bui-dp__button-dock">
          @if (secondaryButton()) {
            <button class="bui-dp__btn bui-dp__btn--secondary" type="button" (click)="secondaryButton()!.onClick()">
              {{ secondaryButton()!.label }}
            </button>
          }
          @if (primaryButton()) {
            <button class="bui-dp__btn bui-dp__btn--primary" type="button" (click)="primaryButton()!.onClick()">
              {{ primaryButton()!.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class BuiCalendar {
  readonly value = input<Date | null | (Date | null | undefined)[] | undefined>(null);
  readonly highlightedDate = input<Date | null | undefined>(null);
  readonly range = input(false, { transform: booleanAttribute });
  readonly monthsShown = input(1);
  readonly orientation = input<DatepickerOrientation>('horizontal');
  readonly density = input<DatepickerDensity>('default');
  readonly peekNextMonth = input(false, { transform: booleanAttribute });
  readonly minDate = input<Date | null | undefined>(null);
  readonly maxDate = input<Date | null | undefined>(null);
  readonly excludeDates = input<Date[] | null | undefined>(null);
  readonly filterDate = input<((d: Date) => boolean) | null | undefined>(null);
  readonly includeDates = input<Date[] | null | undefined>(null);
  readonly locale = input<Intl.Locale | null | undefined>(null);
  readonly dateLabel = input<((d: Date) => string | null) | null | undefined>(null);
  readonly quickSelect = input(false, { transform: booleanAttribute });
  readonly quickSelectOptions = input<QuickSelectOption[]>(getDefaultQuickSelectOptions());
  readonly timeSelectStart = input(false, { transform: booleanAttribute });
  readonly timeSelectEnd = input(false, { transform: booleanAttribute });
  readonly primaryButton = input<{ label: string; onClick: () => void } | null | undefined>(null);
  readonly secondaryButton = input<{ label: string; onClick: () => void } | null | undefined>(null);

  readonly change = output<{ date: Date | null | (Date | null | undefined)[] }>();
  readonly dayClick = output<{ date: Date }>();
  readonly dayFocus = output<{ date: Date }>();

  protected readonly hoveredDate = signal<Date | null>(null);
  protected readonly quickSelectId = signal('');
  protected readonly viewDate = signal<Date>(today());

  protected readonly visibleMonths = computed((): Date[] =>
    Array.from({ length: this.monthsShown() }, (_, i) => addMonths(this.viewDate(), i))
  );

  protected readonly normalizedValue = computed((): (Date | null | undefined)[] => {
    const v = this.value();
    if (Array.isArray(v)) return v;
    return v ? [v] : [];
  });

  protected readonly timeStart = computed((): Date | undefined =>
    (this.normalizedValue()[0]) ?? undefined
  );

  protected readonly timeEnd = computed((): Date | undefined =>
    (this.normalizedValue()[1]) ?? undefined
  );

  constructor() {
    effect(() => {
      const v = this.value();
      const arr = Array.isArray(v) ? v : (v ? [v] : []);
      const first = arr[0] ?? arr[1];
      if (first) {
        this.viewDate.set(new Date(first.getFullYear(), first.getMonth(), 1));
      } else {
        const h = this.highlightedDate();
        if (h) this.viewDate.set(new Date(h.getFullYear(), h.getMonth(), 1));
      }
    });
  }

  protected shiftMonth(delta: number): void {
    this.viewDate.update((d) => addMonths(d, delta));
  }

  protected onMonthYearChange(newDate: Date, order: number): void {
    this.viewDate.set(addMonths(newDate, -order));
  }

  protected onDayClick(date: Date): void {
    this.dayClick.emit({ date });
    const rangeVal = this.normalizedValue();
    if (!this.range()) { this.change.emit({ date }); return; }
    const [start, end] = rangeVal;
    if (!start || (start && end)) {
      this.change.emit({ date: [date, null] });
    } else {
      const ordered: [Date, Date] = date < start ? [date, start] : [start, date];
      this.change.emit({ date: ordered });
    }
  }

  protected onDayFocus(date: Date): void { this.dayFocus.emit({ date }); }
  protected onDayBlur(): void {}

  protected onDayKeydown(event: KeyboardEvent, date: Date): void {
    const delta: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    const d = delta[event.key];
    if (d !== undefined) {
      event.preventDefault();
      const newDate = addDays(date, d);
      this.viewDate.set(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      this.dayFocus.emit({ date: newDate });
    }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.onDayClick(date); }
  }

  protected onTimeChange(time: Date | null, which: 'start' | 'end'): void {
    const rangeVal = [...this.normalizedValue()];
    if (which === 'start' && rangeVal[0] && time) {
      const d = new Date(rangeVal[0]!);
      d.setHours(time.getHours(), time.getMinutes());
      rangeVal[0] = d;
    } else if (which === 'end' && rangeVal[1] && time) {
      const d = new Date(rangeVal[1]!);
      d.setHours(time.getHours(), time.getMinutes());
      rangeVal[1] = d;
    }
    this.change.emit({ date: this.range() ? rangeVal : rangeVal[0] ?? null });
  }

  protected onQuickSelect(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.quickSelectId.set(id);
    if (!id) return;
    const opt = this.quickSelectOptions().find((o) => o.id === id);
    if (opt) this.change.emit({ date: [opt.beginDate, opt.endDate] });
  }
}

/* ─── StatefulCalendar ───────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-stateful-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCalendar],
  template: `
    <bui-calendar
      [value]="value()"
      [highlightedDate]="highlightedDate()"
      [range]="range()"
      [monthsShown]="monthsShown()"
      [orientation]="orientation()"
      [density]="density()"
      [peekNextMonth]="peekNextMonth()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [excludeDates]="excludeDates()"
      [filterDate]="filterDate()"
      [includeDates]="includeDates()"
      [locale]="locale()"
      [dateLabel]="dateLabel()"
      [quickSelect]="quickSelect()"
      [quickSelectOptions]="quickSelectOptions()"
      [timeSelectStart]="timeSelectStart()"
      [timeSelectEnd]="timeSelectEnd()"
      [primaryButton]="primaryButton()"
      [secondaryButton]="secondaryButton()"
      (change)="onCalendarChange($event)"
    />
  `,
})
export class BuiStatefulCalendar {
  readonly initialState = input<{ value?: Date | null | (Date | null)[] }>();
  readonly highlightedDate = input<Date | null | undefined>(null);
  readonly range = input(false, { transform: booleanAttribute });
  readonly monthsShown = input(1);
  readonly orientation = input<DatepickerOrientation>('horizontal');
  readonly density = input<DatepickerDensity>('default');
  readonly peekNextMonth = input(false, { transform: booleanAttribute });
  readonly minDate = input<Date | null | undefined>(null);
  readonly maxDate = input<Date | null | undefined>(null);
  readonly excludeDates = input<Date[] | null | undefined>(null);
  readonly filterDate = input<((d: Date) => boolean) | null | undefined>(null);
  readonly includeDates = input<Date[] | null | undefined>(null);
  readonly locale = input<Intl.Locale | null | undefined>(null);
  readonly dateLabel = input<((d: Date) => string | null) | null | undefined>(null);
  readonly quickSelect = input(false, { transform: booleanAttribute });
  readonly quickSelectOptions = input<QuickSelectOption[]>(getDefaultQuickSelectOptions());
  readonly timeSelectStart = input(false, { transform: booleanAttribute });
  readonly timeSelectEnd = input(false, { transform: booleanAttribute });
  readonly primaryButton = input<{ label: string; onClick: () => void } | null | undefined>(null);
  readonly secondaryButton = input<{ label: string; onClick: () => void } | null | undefined>(null);

  readonly change = output<{ date: Date | null | (Date | null | undefined)[] }>();

  protected readonly value = signal<Date | null | (Date | null | undefined)[]>(null);

  constructor() {
    effect(() => {
      const init = this.initialState();
      if (init?.value !== undefined) this.value.set(init.value);
    }, { allowSignalWrites: true });
  }

  protected onCalendarChange(event: { date: Date | null | (Date | null | undefined)[] }): void {
    this.value.set(event.date);
    this.change.emit(event);
  }
}

/* ─── Datepicker ─────────────────────────────────────────────────────────────── */

const INPUT_DELIMITER = '–';

@Component({
  selector: 'bui-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule, BuiCalendar, BuiInput],
  styleUrl: './datepicker.component.scss',
  host: { 'data-baseweb': 'datepicker' },
  template: `
    <div class="bui-dp__picker" [class.bui-dp__picker--separate]="separateRangeInputs() && range()">
      @if (!separateRangeInputs() || !range()) {
        <div
          class="bui-dp__input-wrap"
          cdkOverlayOrigin
          #trigger="cdkOverlayOrigin"
          (focusin)="openPicker('startDate')"
        >
          <bui-input
            [value]="displayValue()"
            [placeholder]="placeholder() || formatString()"
            [disabled]="disabled()"
            [error]="error()"
            [positive]="positive()"
            [size]="size()"
            [clearable]="clearable()"
            [mask]="activeMask() ?? undefined"
            [ariaLabel]="dpAriaLabel()"
            (valueChange)="onInputChange($event)"
          />
        </div>
      }

      @if (separateRangeInputs() && range()) {
        <div class="bui-dp__input-wrap bui-dp__input-wrap--start"
          cdkOverlayOrigin
          #triggerStart="cdkOverlayOrigin"
          (focusin)="openPicker('startDate')"
        >
          <div class="bui-dp__input-label">{{ startDateLabel() }}</div>
          <bui-input
            [value]="displayStartValue()"
            [placeholder]="placeholder() || formatString()"
            [disabled]="disabled()"
            [error]="error()"
            [positive]="positive()"
            [size]="size()"
            [clearable]="clearable()"
            [mask]="activeMask() ?? undefined"
            [ariaLabel]="startDateLabel()"
            (valueChange)="onSeparateInputChange($event, 'startDate')"
          />
        </div>
        <div class="bui-dp__input-wrap bui-dp__input-wrap--end"
          cdkOverlayOrigin
          #triggerEnd="cdkOverlayOrigin"
          (focusin)="openPicker('endDate')"
        >
          <div class="bui-dp__input-label">{{ endDateLabel() }}</div>
          <bui-input
            [value]="displayEndValue()"
            [placeholder]="placeholder() || formatString()"
            [disabled]="disabled()"
            [error]="error()"
            [positive]="positive()"
            [size]="size()"
            [clearable]="clearable()"
            [mask]="activeMask() ?? undefined"
            [ariaLabel]="endDateLabel()"
            (valueChange)="onSeparateInputChange($event, 'endDate')"
          />
        </div>
      }
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="activeOrigin()"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      cdkConnectedOverlayPanelClass="bw-root"
      [cdkConnectedOverlayPositions]="overlayPositions"
      (backdropClick)="closePicker()"
      (overlayKeydown)="onOverlayKey($event)"
    >
      <bui-calendar
        class="bui-dp__calendar-overlay"
        [value]="value()"
        [highlightedDate]="highlightedDate()"
        [range]="range()"
        [monthsShown]="monthsShown()"
        [orientation]="orientation()"
        [density]="density()"
        [peekNextMonth]="peekNextMonth()"
        [minDate]="minDate()"
        [maxDate]="maxDate()"
        [excludeDates]="excludeDates()"
        [filterDate]="filterDate()"
        [includeDates]="includeDates()"
        [locale]="locale()"
        [dateLabel]="dateLabel()"
        [quickSelect]="quickSelect()"
        [quickSelectOptions]="quickSelectOptions()"
        [timeSelectStart]="timeSelectStart()"
        [timeSelectEnd]="timeSelectEnd()"
        (change)="onCalendarChange($event)"
      />
    </ng-template>
  `,
})
export class BuiDatepicker {
  readonly value = input<Date | null | (Date | null | undefined)[] | undefined>(null);
  readonly highlightedDate = input<Date | null | undefined>(null);
  readonly formatString = input(DEFAULT_FORMAT);
  readonly placeholder = input('');
  readonly mask = input<string | null | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly size = input<'mini' | 'compact' | 'default' | 'large'>('default');
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly range = input(false, { transform: booleanAttribute });
  readonly separateRangeInputs = input(false, { transform: booleanAttribute });
  readonly startDateLabel = input('Start Date');
  readonly endDateLabel = input('End Date');
  readonly displayValueAtRangeIndex = input<number | undefined>(undefined);
  readonly monthsShown = input(1);
  readonly orientation = input<DatepickerOrientation>('horizontal');
  readonly density = input<DatepickerDensity>('default');
  readonly peekNextMonth = input(false, { transform: booleanAttribute });
  readonly minDate = input<Date | null | undefined>(null);
  readonly maxDate = input<Date | null | undefined>(null);
  readonly excludeDates = input<Date[] | null | undefined>(null);
  readonly filterDate = input<((d: Date) => boolean) | null | undefined>(null);
  readonly includeDates = input<Date[] | null | undefined>(null);
  readonly locale = input<Intl.Locale | null | undefined>(null);
  readonly dateLabel = input<((d: Date) => string | null) | null | undefined>(null);
  readonly quickSelect = input(false, { transform: booleanAttribute });
  readonly quickSelectOptions = input<QuickSelectOption[]>(getDefaultQuickSelectOptions());
  readonly timeSelectStart = input(false, { transform: booleanAttribute });
  readonly timeSelectEnd = input(false, { transform: booleanAttribute });
  readonly rangedCalendarBehavior = input<'default' | 'locked'>('default');
  readonly ariaLabel = input('');

  readonly change = output<{ date: Date | null | (Date | null | undefined)[] }>();
  readonly rangeChange = output<{ date: Date | null | (Date | null | undefined)[] }>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly isOpen = signal(false);
  protected readonly selectedInput = signal<InputRole>('startDate');

  protected readonly trigger = viewChild<CdkOverlayOrigin>('trigger');
  protected readonly triggerStart = viewChild<CdkOverlayOrigin>('triggerStart');
  protected readonly triggerEnd = viewChild<CdkOverlayOrigin>('triggerEnd');

  protected readonly activeOrigin = computed((): CdkOverlayOrigin | undefined => {
    if (this.separateRangeInputs() && this.range()) {
      return this.selectedInput() === 'endDate'
        ? (this.triggerEnd() ?? this.triggerStart())
        : (this.triggerStart() ?? this.trigger());
    }
    return this.trigger();
  });

  protected readonly dpAriaLabel = computed(() => this.ariaLabel() || undefined as unknown as string);

  protected readonly overlayPositions = [
    { originX: 'start' as const, originY: 'bottom' as const, overlayX: 'start' as const, overlayY: 'top' as const },
    { originX: 'start' as const, originY: 'top' as const, overlayX: 'start' as const, overlayY: 'bottom' as const },
  ];

  protected readonly activeMask = computed((): string | null => {
    const m = this.mask();
    if (m === null) return null;
    if (m) return m;
    const fmt = this.formatString();
    if (/^[yYMdD9aA\s\/\.\-]+$/.test(fmt)) return formatStringToMask(fmt);
    return null;
  });

  protected readonly displayValue = computed((): string => {
    const v = this.value();
    const fmt = this.formatString();
    const locale = this.locale();
    const idx = this.displayValueAtRangeIndex();
    if (Array.isArray(v)) {
      if (idx !== undefined) { const d = v[idx]; return d ? formatDate(d, fmt, locale) : ''; }
      return formatRangeDisplay(v[0] ?? null, v[1] ?? null, fmt, locale);
    }
    return v ? formatDate(v, fmt, locale) : '';
  });

  protected readonly displayStartValue = computed((): string => {
    const v = this.value();
    if (!Array.isArray(v) || !v[0]) return '';
    return formatDate(v[0], this.formatString(), this.locale());
  });

  protected readonly displayEndValue = computed((): string => {
    const v = this.value();
    if (!Array.isArray(v) || !v[1]) return '';
    return formatDate(v[1], this.formatString(), this.locale());
  });

  protected openPicker(role: InputRole): void {
    if (this.disabled()) return;
    this.selectedInput.set(role);
    this.isOpen.set(true);
    this.opened.emit();
  }

  protected closePicker(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  protected onInputChange(val: string): void {
    const fmt = this.formatString();
    if (this.range()) {
      const parts = val.split(` ${INPUT_DELIMITER} `);
      const start = parseDate(parts[0], fmt);
      const end = parseDate(parts[1] ?? '', fmt);
      this.change.emit({ date: [start, end] });
    } else {
      const date = parseDate(val, fmt);
      if (date) { this.change.emit({ date }); this.closePicker(); }
    }
  }

  protected onSeparateInputChange(val: string, role: InputRole): void {
    const date = parseDate(val, this.formatString());
    if (!date) return;
    const current = this.value();
    const arr = Array.isArray(current) ? [...current] : [null, null];
    if (role === 'startDate') arr[0] = date; else arr[1] = date;
    this.change.emit({ date: arr });
  }

  protected onCalendarChange(event: { date: Date | null | (Date | null | undefined)[] }): void {
    if (this.range() && Array.isArray(event.date)) {
      const [s, e] = event.date;
      if (s && e) { this.change.emit(event); this.closePicker(); }
      else this.change.emit(event);
      this.rangeChange.emit(event);
    } else {
      this.change.emit(event);
      if (!this.range()) this.closePicker();
    }
  }

  protected onOverlayKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closePicker();
  }
}

/* ─── StatefulDatepicker ─────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-stateful-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDatepicker],
  template: `
    <bui-datepicker
      [value]="value()"
      [highlightedDate]="highlightedDate()"
      [formatString]="formatString()"
      [placeholder]="placeholder()"
      [mask]="mask()"
      [disabled]="disabled()"
      [error]="error()"
      [positive]="positive()"
      [size]="size()"
      [clearable]="clearable()"
      [range]="range()"
      [separateRangeInputs]="separateRangeInputs()"
      [startDateLabel]="startDateLabel()"
      [endDateLabel]="endDateLabel()"
      [monthsShown]="monthsShown()"
      [orientation]="orientation()"
      [density]="density()"
      [peekNextMonth]="peekNextMonth()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [excludeDates]="excludeDates()"
      [filterDate]="filterDate()"
      [includeDates]="includeDates()"
      [locale]="locale()"
      [dateLabel]="dateLabel()"
      [quickSelect]="quickSelect()"
      [quickSelectOptions]="quickSelectOptions()"
      [timeSelectStart]="timeSelectStart()"
      [timeSelectEnd]="timeSelectEnd()"
      [rangedCalendarBehavior]="rangedCalendarBehavior()"
      [ariaLabel]="ariaLabel()"
      (change)="onDateChange($event)"
      (rangeChange)="rangeChange.emit($event)"
    />
  `,
})
export class BuiStatefulDatepicker {
  readonly initialState = input<{ value?: Date | null | (Date | null | undefined)[] }>();
  readonly highlightedDate = input<Date | null | undefined>(null);
  readonly formatString = input(DEFAULT_FORMAT);
  readonly placeholder = input('');
  readonly mask = input<string | null | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly size = input<'mini' | 'compact' | 'default' | 'large'>('default');
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly range = input(false, { transform: booleanAttribute });
  readonly separateRangeInputs = input(false, { transform: booleanAttribute });
  readonly startDateLabel = input('Start Date');
  readonly endDateLabel = input('End Date');
  readonly monthsShown = input(1);
  readonly orientation = input<DatepickerOrientation>('horizontal');
  readonly density = input<DatepickerDensity>('default');
  readonly peekNextMonth = input(false, { transform: booleanAttribute });
  readonly minDate = input<Date | null | undefined>(null);
  readonly maxDate = input<Date | null | undefined>(null);
  readonly excludeDates = input<Date[] | null | undefined>(null);
  readonly filterDate = input<((d: Date) => boolean) | null | undefined>(null);
  readonly includeDates = input<Date[] | null | undefined>(null);
  readonly locale = input<Intl.Locale | null | undefined>(null);
  readonly dateLabel = input<((d: Date) => string | null) | null | undefined>(null);
  readonly quickSelect = input(false, { transform: booleanAttribute });
  readonly quickSelectOptions = input<QuickSelectOption[]>(getDefaultQuickSelectOptions());
  readonly timeSelectStart = input(false, { transform: booleanAttribute });
  readonly timeSelectEnd = input(false, { transform: booleanAttribute });
  readonly rangedCalendarBehavior = input<'default' | 'locked'>('default');
  readonly ariaLabel = input('');

  readonly change = output<{ date: Date | null | (Date | null | undefined)[] }>();
  readonly rangeChange = output<{ date: Date | null | (Date | null | undefined)[] }>();

  protected readonly value = signal<Date | null | (Date | null | undefined)[]>(null);

  constructor() {
    effect(() => {
      const init = this.initialState();
      if (init?.value !== undefined) {
        this.value.set(init.value);
      } else if (this.range()) {
        this.value.set([]);
      }
    }, { allowSignalWrites: true });
  }

  protected onDateChange(event: { date: Date | null | (Date | null | undefined)[] }): void {
    this.value.set(event.date);
    this.change.emit(event);
  }
}
