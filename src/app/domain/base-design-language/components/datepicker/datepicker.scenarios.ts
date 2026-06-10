import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { BuiCalendar, BuiStatefulCalendar, BuiDatepicker, BuiStatefulDatepicker } from './datepicker.component';
import { addDays, addMonths, today } from './datepicker.utils';

const T = today();
const T_MINUS_7 = addDays(T, -7);
const T_MINUS_30 = addDays(T, -30);
const MIN_DATE = addDays(T, -60);
const MAX_DATE = addDays(T, 60);

/* ─── 1. Stateful calendar ──────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-stateful-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `<bui-stateful-calendar />`,
})
export class DatepickerStatefulCalendarScenario {}

/* ─── 2. Controlled calendar ─────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCalendar],
  template: `
    <bui-calendar
      [value]="value()"
      (change)="value.set($event.date)"
    />
  `,
})
export class DatepickerCalendarScenario {
  protected readonly value = signal<Date | null>(T);
}

/* ─── 3. Range calendar ──────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-range-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [range]="true"
      [initialState]="{ value: [start, end] }"
    />
  `,
})
export class DatepickerRangeCalendarScenario {
  readonly start = T_MINUS_7;
  readonly end = T;
}

/* ─── 4. Multi-month calendar ───────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-multi-month',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [range]="true"
      [monthsShown]="2"
    />
  `,
})
export class DatepickerMultiMonthScenario {}

/* ─── 5. Quick select ────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-quick-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [range]="true"
      [quickSelect]="true"
    />
  `,
})
export class DatepickerQuickSelectScenario {}

/* ─── 6. Time select ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-time-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [timeSelectStart]="true"
      [initialState]="{ value: date }"
    />
  `,
})
export class DatepickerTimeSelectScenario {
  readonly date = T;
}

/* ─── 7. Time select range ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-time-select-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [range]="true"
      [timeSelectStart]="true"
      [timeSelectEnd]="true"
      [initialState]="{ value: [start, end] }"
    />
  `,
})
export class DatepickerTimeSelectRangeScenario {
  readonly start = T_MINUS_7;
  readonly end = T;
}

/* ─── 8. Min/max dates ───────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-min-max',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [minDate]="min"
      [maxDate]="max"
    />
  `,
})
export class DatepickerMinMaxScenario {
  readonly min = MIN_DATE;
  readonly max = MAX_DATE;
}

/* ─── 9. Exclude dates ───────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-exclude-dates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [excludeDates]="excludeDates"
    />
  `,
})
export class DatepickerExcludeDatesScenario {
  readonly excludeDates = [
    addDays(T, 1), addDays(T, 3), addDays(T, 5), addDays(T, 7),
  ];
}

/* ─── 10. Filter dates ───────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-filter-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [filterDate]="onlyWeekdays"
    />
  `,
})
export class DatepickerFilterDateScenario {
  readonly onlyWeekdays = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6;
}

/* ─── 11. Highlighted date ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-highlighted-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [highlightedDate]="highlighted"
    />
  `,
})
export class DatepickerHighlightedDateScenario {
  readonly highlighted = addDays(T, 3);
}

/* ─── 12. Date label ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-date-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [dateLabel]="getLabel"
    />
  `,
})
export class DatepickerDateLabelScenario {
  readonly getLabel = (d: Date): string | null => {
    const day = d.getDay();
    if (day === 6) return 'Sa';
    if (day === 0) return 'Su';
    return null;
  };
}

/* ─── 13. Peek next month ────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-peek-next-month',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar [peekNextMonth]="true" />
  `,
})
export class DatepickerPeekNextMonthScenario {}

/* ─── 14. Dense calendar ─────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-dense',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar density="high" />
  `,
})
export class DatepickerDenseScenario {}

/* ─── 15. Locale ─────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-locale',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px">
      <div>
        <div style="font-size: 12px; color: #aaa; margin-bottom: 8px">en-US</div>
        <bui-stateful-calendar />
      </div>
      <div>
        <div style="font-size: 12px; color: #aaa; margin-bottom: 8px">pt-BR</div>
        <bui-stateful-calendar [locale]="ptBR" />
      </div>
    </div>
  `,
})
export class DatepickerLocaleScenario {
  readonly ptBR = new Intl.Locale('pt-BR');
}

/* ─── 16. Stateful datepicker ────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-stateful',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker />
    </div>
  `,
})
export class DatepickerStatefulScenario {}

/* ─── 17. Datepicker with initial date ───────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-initial-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker
        [initialState]="{ value: date }"
        formatString="MM/dd/yyyy"
      />
    </div>
  `,
})
export class DatepickerInitialStateScenario {
  readonly date = T;
}

/* ─── 18. Range datepicker ───────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 340px">
      <bui-stateful-datepicker
        [range]="true"
        [initialState]="{ value: [start, end] }"
      />
    </div>
  `,
})
export class DatepickerRangeScenario {
  readonly start = T_MINUS_7;
  readonly end = T;
}

/* ─── 19. Range datepicker with separate inputs ──────────────────────────────── */

@Component({
  selector: 'sc-datepicker-range-separate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 480px">
      <bui-stateful-datepicker
        [range]="true"
        [separateRangeInputs]="true"
        [initialState]="{ value: [start, end] }"
      />
    </div>
  `,
})
export class DatepickerRangeSeparateScenario {
  readonly start = T_MINUS_30;
  readonly end = T;
}

/* ─── 20. Controlled datepicker ──────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-controlled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDatepicker],
  template: `
    <div style="width: 300px">
      <bui-datepicker
        [value]="value()"
        (change)="value.set($event.date as any)"
      />
      <p style="margin-top: 8px; font-size: 13px; color: #555">
        Selected: {{ value() ? (value()!.valueOf()) : 'none' }}
      </p>
    </div>
  `,
})
export class DatepickerControlledScenario {
  protected readonly value = signal<Date | null>(T);
}

/* ─── 21. Quick select datepicker ────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-quick-select-dp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 340px">
      <bui-stateful-datepicker
        [range]="true"
        [quickSelect]="true"
        [monthsShown]="2"
      />
    </div>
  `,
})
export class DatepickerQuickSelectDpScenario {}

/* ─── 22. Time select datepicker ─────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-time-dp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker
        [timeSelectStart]="true"
        [initialState]="{ value: date }"
      />
    </div>
  `,
})
export class DatepickerTimeDpScenario {
  readonly date = T;
}

/* ─── 23. Disabled datepicker ────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-disabled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker
        [disabled]="true"
        [initialState]="{ value: date }"
      />
    </div>
  `,
})
export class DatepickerDisabledScenario {
  readonly date = T;
}

/* ─── 24. Error state datepicker ─────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker [error]="true" />
    </div>
  `,
})
export class DatepickerErrorScenario {}

/* ─── 25. Positive state datepicker ──────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-positive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker
        [positive]="true"
        [initialState]="{ value: date }"
      />
    </div>
  `,
})
export class DatepickerPositiveScenario {
  readonly date = T;
}

/* ─── 26. Clearable datepicker ───────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-clearable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker
        [clearable]="true"
        [initialState]="{ value: date }"
      />
    </div>
  `,
})
export class DatepickerClearableScenario {
  readonly date = T;
}

/* ─── 27. Sizes ──────────────────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-sizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 300px">
      @for (size of sizes; track size) {
        <div>
          <div style="font-size: 12px; color: #aaa; margin-bottom: 4px">{{ size }}</div>
          <bui-stateful-datepicker [size]="size" />
        </div>
      }
    </div>
  `,
})
export class DatepickerSizesScenario {
  readonly sizes = ['mini', 'compact', 'default', 'large'] as const;
}

/* ─── 28. Min/max datepicker ─────────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-min-max-dp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulDatepicker],
  template: `
    <div style="width: 300px">
      <bui-stateful-datepicker
        [minDate]="min"
        [maxDate]="max"
      />
    </div>
  `,
})
export class DatepickerMinMaxDpScenario {
  readonly min = MIN_DATE;
  readonly max = MAX_DATE;
}

/* ─── 29. Vertical orientation ───────────────────────────────────────────────── */

@Component({
  selector: 'sc-datepicker-vertical',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulCalendar],
  template: `
    <bui-stateful-calendar
      [range]="true"
      [monthsShown]="2"
      orientation="vertical"
    />
  `,
})
export class DatepickerVerticalScenario {}
