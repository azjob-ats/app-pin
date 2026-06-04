import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, forwardRef, input, model, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface DayCell { date: Date | null; outside: boolean; }

function pad(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
function fmt(d: Date | null): string { return d ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}` : ''; }
function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Calendar — fiel ao baseui/datepicker/calendar (grade de dias, dia selecionado em círculo). */
@Component({
  selector: 'bui-calendar',
  exportAs: 'buiCalendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-cal" role="application" aria-roledescription="datepicker">
      <div class="bui-cal__header">
        <button type="button" class="bui-cal__nav" aria-label="Previous month" (click)="move(-1)"><span class="material-symbols-rounded">chevron_left</span></button>
        <span class="bui-cal__title">{{ monthName() }} {{ viewYear() }}</span>
        <button type="button" class="bui-cal__nav" aria-label="Next month" (click)="move(1)"><span class="material-symbols-rounded">chevron_right</span></button>
      </div>
      <div class="bui-cal__week" role="row">
        @for (w of weekdays; track w) { <span class="bui-cal__wd" role="columnheader">{{ w }}</span> }
      </div>
      <div class="bui-cal__grid" role="grid">
        @for (cell of cells(); track $index) {
          @if (cell.date) {
            <button
              type="button"
              class="bui-cal__day"
              [class.bui-cal__day--sel]="isSelected(cell.date)"
              [class.bui-cal__day--today]="isToday(cell.date)"
              role="gridcell"
              [attr.aria-selected]="isSelected(cell.date)"
              (click)="select(cell.date)"
            >{{ cell.date.getDate() }}</button>
          } @else { <span class="bui-cal__day bui-cal__day--empty"></span> }
        }
      </div>
    </div>
  `,
  styles: `
    .bui-cal { display:inline-block; padding:var(--bw-sizing-scale600); background:var(--bw-background-primary); }
    .bui-cal__header { display:flex; align-items:center; justify-content:space-between; height:48px; }
    .bui-cal__title { font:var(--bw-font-LabelMedium); color:var(--bw-content-primary); }
    .bui-cal__nav { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border:none; border-radius:50%; background:transparent; color:var(--bw-content-primary); cursor:pointer; }
    .bui-cal__nav:hover { background:var(--bw-background-secondary); }
    .bui-cal__week { display:grid; grid-template-columns:repeat(7, 1fr); }
    .bui-cal__wd { display:flex; align-items:center; justify-content:center; height:36px; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-tertiary); }
    .bui-cal__grid { display:grid; grid-template-columns:repeat(7, 1fr); }
    .bui-cal__day { position:relative; display:flex; align-items:center; justify-content:center; height:52px; border:none; background:transparent; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); cursor:pointer; }
    .bui-cal__day::after { content:''; position:absolute; z-index:-1; width:48px; height:48px; border-radius:50%; border:2px solid transparent; box-sizing:border-box; }
    .bui-cal__day:not(.bui-cal__day--empty):hover::after { border-color:var(--bw-border-selected, var(--bw-content-primary)); }
    .bui-cal__day--today { font-weight:700; }
    .bui-cal__day--sel { color:var(--bw-content-inverse-primary); }
    .bui-cal__day--sel::after { background:var(--bw-content-primary); border-color:var(--bw-content-primary); }
    .bui-cal__day--empty { cursor:default; }
  `,
})
export class Calendar {
  readonly value = model<Date | null>(null);
  readonly dateSelected = output<Date | null>();
  protected readonly weekdays = WEEKDAYS;

  private readonly today = new Date();
  protected readonly viewMonth = signal(this.today.getMonth());
  protected readonly viewYear = signal(this.today.getFullYear());
  protected readonly monthName = computed(() => MONTHS[this.viewMonth()]);

  constructor() {
    effect(() => {
      const v = this.value();
      if (v) { this.viewMonth.set(v.getMonth()); this.viewYear.set(v.getFullYear()); }
    });
  }

  protected readonly cells = computed<DayCell[]>(() => {
    const m = this.viewMonth(), y = this.viewYear();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const out: DayCell[] = [];
    for (let i = 0; i < first; i++) out.push({ date: null, outside: true });
    for (let d = 1; d <= days; d++) out.push({ date: new Date(y, m, d), outside: false });
    return out;
  });

  protected move(delta: number): void {
    let m = this.viewMonth() + delta, y = this.viewYear();
    if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
    this.viewMonth.set(m); this.viewYear.set(y);
  }
  protected select(d: Date): void { this.value.set(d); this.dateSelected.emit(d); }
  protected isSelected(d: Date): boolean { return sameDay(d, this.value()); }
  protected isToday(d: Date): boolean { return sameDay(d, this.today); }
}

/** Datepicker — fiel ao baseui/datepicker (input + popover de calendário). */
@Component({
  selector: 'bui-datepicker',
  exportAs: 'buiDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Calendar],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Datepicker), multi: true }],
  template: `
    <div class="bui-dp" [class.bui-dp--error]="error()" [class.bui-dp--disabled]="isDisabled()">
      <span class="material-symbols-rounded bui-dp__icon">calendar_today</span>
      <input
        type="text"
        class="bui-dp__input"
        readonly
        [value]="display()"
        [disabled]="isDisabled()"
        [placeholder]="placeholder()"
        [attr.aria-label]="ariaLabel()"
        (click)="toggle()"
        (focus)="onTouched()"
      />
    </div>
    @if (open()) {
      <div class="bui-dp__scrim" (click)="close()"></div>
      <div class="bui-dp__pop"><bui-calendar [value]="value()" (dateSelected)="onPick($event)" /></div>
    }
  `,
  styles: `
    bui-datepicker { position:relative; display:inline-block; }
    .bui-dp { display:flex; align-items:center; gap:8px; height:48px; min-width:240px; padding:0 var(--bw-sizing-scale600); border-radius:var(--bw-input-border-radius, var(--bw-borders-radius300)); background:var(--bw-background-secondary); border:2px solid transparent; box-sizing:border-box; }
    .bui-dp:focus-within { border-color:var(--bw-border-accent); }
    .bui-dp--error { border-color:var(--bw-border-negative); }
    .bui-dp--disabled { opacity:.5; }
    .bui-dp__icon { font-size:20px; color:var(--bw-content-secondary); }
    .bui-dp__input { flex:1; border:none; background:transparent; outline:none; cursor:pointer; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    .bui-dp__scrim { position:fixed; inset:0; z-index:10; }
    .bui-dp__pop { position:absolute; z-index:11; top:calc(100% + 4px); left:0; border-radius:var(--bw-borders-radius300); box-shadow:var(--bw-lighting-shadow600, 0 8px 24px rgba(0,0,0,.16)); }
  `,
})
export class Datepicker implements ControlValueAccessor {
  readonly error = input(false);
  readonly disabled = input(false);
  readonly placeholder = input<string>('MM/DD/YYYY');
  readonly ariaLabel = input<string>('Select a date');
  readonly value = model<Date | null>(null);

  protected readonly open = signal(false);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly display = computed(() => fmt(this.value()));

  private onChange: (v: Date | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected toggle(): void { if (!this.isDisabled()) this.open.update((o) => !o); }
  protected close(): void { this.open.set(false); }
  protected onPick(d: Date | null): void { this.value.set(d); this.onChange(d); this.open.set(false); }

  writeValue(v: Date | null): void { this.value.set(v); }
  registerOnChange(fn: (v: Date | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.cvaDisabled.set(d); }
}

@Component({
  selector: 'bui-s-datepicker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Datepicker],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start; min-height:420px;">
    <bui-datepicker [value]="seed" />
    <bui-datepicker [error]="true" />
  </div>`,
})
export class DatepickerScenario {
  protected readonly seed = new Date(2026, 5, 12);
}
