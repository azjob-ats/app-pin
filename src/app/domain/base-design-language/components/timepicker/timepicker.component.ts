import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import { Select, Option } from '../select/select.component';
import type { SelectSize } from '../select/select.component';

export type TimeFormat = '12' | '24';

const H = 3600;
const DAY = 86400;

function zp(n: number): string { return String(n).padStart(2, '0'); }

function secsToLabel(secs: number, fmt: TimeFormat): string {
  const h = Math.floor(secs / H) % 24;
  const m = Math.floor((secs % H) / 60);
  if (fmt === '24') return `${zp(h)}:${zp(m)}`;
  const pm = h >= 12;
  const h12 = h % 12 || 12;
  return `${h12}:${zp(m)} ${pm ? 'PM' : 'AM'}`;
}

function dateToSecs(d: Date): number {
  return d.getHours() * H + d.getMinutes() * 60 + d.getSeconds();
}

function startOfDay(d: Date): Date {
  const r = new Date(d); r.setHours(0, 0, 0, 0); return r;
}

function buildTimeOptions(
  step: number, fmt: TimeFormat,
  value: Date | null | undefined,
  minTime: Date | null | undefined,
  maxTime: Date | null | undefined,
  ignoreDate: boolean,
): Option[] {
  let start = 0;
  let end = DAY;

  if (value) {
    const dayStart = startOfDay(value);
    const dayEnd = new Date(dayStart.getTime() + DAY * 1000);

    if (minTime) {
      if (!ignoreDate && minTime < dayStart) {
        start = 0;
      } else {
        start = dateToSecs(minTime);
      }
    }
    if (maxTime) {
      if (!ignoreDate && maxTime > dayEnd) {
        end = DAY;
      } else {
        end = dateToSecs(maxTime) + 1;
      }
    }
  }

  const opts: Option[] = [];
  for (let s = start; s < end; s += step) {
    opts.push({ id: String(s), label: secsToLabel(s, fmt) });
  }
  return opts;
}

/**
 * TimePicker — clone do `baseui/timepicker`. Wrapper em torno de `Select` que gera opções
 * de hora (step em segundos) no formato 12h ou 24h. Suporta minTime/maxTime, creatable e nullable.
 */
@Component({
  selector: 'bui-time-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Select],
  template: `
    <bui-select
      [options]="timeOptions()"
      [value]="selectedValue()"
      [size]="size()"
      [error]="error()"
      [positive]="positive()"
      [disabled]="disabled()"
      [placeholder]="placeholder()"
      [searchable]="creatable()"
      [clearable]="false"
      [ariaLabel]="ariaLabel()"
      (changed)="onChanged($event)"
    />
  `,
})
export class BuiTimePicker {
  readonly format = input<TimeFormat>('12');
  readonly step = input(900);
  readonly value = input<Date | null | undefined>(undefined);
  readonly nullable = input(false, { transform: booleanAttribute });
  readonly creatable = input(false, { transform: booleanAttribute });
  readonly minTime = input<Date | null | undefined>(undefined);
  readonly maxTime = input<Date | null | undefined>(undefined);
  readonly ignoreMinMaxDateComponent = input(false, { transform: booleanAttribute });
  readonly size = input<SelectSize>('default');
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly placeholder = input('HH:mm');
  readonly ariaLabel = input('');

  readonly changed = output<Date | null>();

  protected readonly timeOptions = computed(() =>
    buildTimeOptions(
      this.step(), this.format(),
      this.value(), this.minTime(), this.maxTime(),
      this.ignoreMinMaxDateComponent(),
    )
  );

  protected readonly selectedValue = computed((): Option[] => {
    const v = this.value();
    if (!v) return [];
    const secs = dateToSecs(v);
    const label = secsToLabel(secs, this.format());
    return [{ id: String(secs), label }];
  });

  protected onChanged(opts: Option[]): void {
    if (!opts.length) {
      if (this.nullable()) this.changed.emit(null);
      return;
    }
    const secs = parseInt(opts[0]['id'] as string, 10);
    const h = Math.floor(secs / H) % 24;
    const m = Math.floor((secs % H) / 60);
    const base = this.value() ?? this.minTime() ?? new Date();
    const result = new Date(base);
    result.setHours(h, m, 0, 0);
    this.changed.emit(result);
  }
}
