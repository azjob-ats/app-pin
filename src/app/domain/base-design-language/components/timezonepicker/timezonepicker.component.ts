import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { Select, Option } from '../select/select.component';
import type { SelectSize } from '../select/select.component';
import { zones } from './tzdata';

export type TimezoneOption = { id: string; label: string; offset: number };

function getOffsetHours(tz: string, date: Date): number {
  try {
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return (local.getTime() - utc.getTime()) / 3_600_000;
  } catch {
    return 0;
  }
}

function getAbbreviation(tz: string, date: Date): string {
  try {
    return (
      new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
        .formatToParts(date)
        .find((p) => p.type === 'timeZoneName')?.value ?? ''
    );
  } catch {
    return '';
  }
}

function buildTimezones(date: Date, includeAbbreviations: boolean, additionalTimezones: TimezoneOption[]): TimezoneOption[] {
  const list: TimezoneOption[] = [];
  for (const tz of zones) {
    try {
      const offset = getOffsetHours(tz, date);
      const sign = offset >= 0 ? '+' : '-';
      let label = `(GMT${sign}${Math.abs(offset)}) ${tz.replace(/_/g, ' ')}`;
      if (includeAbbreviations) {
        const abbr = getAbbreviation(tz, date);
        if (abbr) label += ` - ${abbr}`;
      }
      list.push({ id: tz, label, offset: offset === 0 ? 0 : offset * -60 });
    } catch {
      // ignore unsupported zones
    }
  }
  const all = [...list, ...additionalTimezones];
  return all.sort((a, b) => {
    const d = b.offset - a.offset;
    if (d !== 0) return d;
    return String(a.label) < String(b.label) ? -1 : String(a.label) > String(b.label) ? 1 : 0;
  });
}

/**
 * TimezonePicker — clone do `baseui/timezonepicker`. Wrapper em torno de `Select` que lista
 * fusos horários IANA ordenados por offset. Usa `Intl` nativo do browser (sem dependências).
 * `includeAbbreviations` adiciona a abreviação (PST, EST…) ao label. `additionalTimezones`
 * permite injetar fusos extras (ex: UTC). `value` é o ID IANA (string), `changed` emite `TimezoneOption`.
 */
@Component({
  selector: 'bui-timezone-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Select],
  template: `
    <bui-select
      [options]="tzOptions()"
      [value]="selectedValue()"
      [size]="size()"
      [error]="error()"
      [positive]="positive()"
      [disabled]="disabled()"
      [searchable]="true"
      [clearable]="false"
      [ariaLabel]="ariaLabel()"
      placeholder="Select a timezone..."
      (changed)="onChanged($event)"
    />
  `,
})
export class BuiTimezonePicker implements OnInit {
  readonly date = input<Date>(new Date(2019, 3, 1));
  readonly value = input<string | null | undefined>(undefined);
  readonly includeAbbreviations = input(false, { transform: booleanAttribute });
  readonly additionalTimezones = input<TimezoneOption[]>([]);
  readonly size = input<SelectSize>('default');
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Select timezone');

  readonly changed = output<TimezoneOption | null>();

  protected readonly internalValue = signal<string | null | undefined>(undefined);

  protected readonly tzOptions = computed((): Option[] =>
    buildTimezones(this.date(), this.includeAbbreviations(), this.additionalTimezones())
      .map((t) => ({ id: t.id, label: t.label }))
  );

  protected readonly selectedValue = computed((): Option[] => {
    const id = this.value() ?? this.internalValue();
    if (!id) return [];
    const opt = this.tzOptions().find((o) => o['id'] === id);
    return opt ? [opt] : [];
  });

  ngOnInit(): void {
    if (!this.value()) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.internalValue.set(tz);
      const opts = buildTimezones(this.date(), this.includeAbbreviations(), this.additionalTimezones());
      const opt = opts.find((o) => o.id === tz);
      if (opt) this.changed.emit(opt);
    }
  }

  protected onChanged(opts: Option[]): void {
    if (!opts.length) { this.changed.emit(null); return; }
    const id = opts[0]['id'] as string;
    this.internalValue.set(id);
    const all = buildTimezones(this.date(), this.includeAbbreviations(), this.additionalTimezones());
    const tz = all.find((t) => t.id === id) ?? null;
    this.changed.emit(tz);
  }
}
