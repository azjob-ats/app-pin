import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface TimeStep { seconds: number; label: string; }

function secondsToLabel(s: number, format: '12' | '24'): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const mm = m < 10 ? `0${m}` : `${m}`;
  if (format === '24') return `${h < 10 ? '0' + h : h}:${mm}`;
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${period}`;
}

/** Timepicker — fiel ao baseui/timepicker (select de horários; format 12/24, step 900s). */
@Component({
  selector: 'bui-timepicker',
  exportAs: 'buiTimepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Timepicker), multi: true }],
  template: `
    <div class="bui-tp" [class.bui-tp--error]="error()" [class.bui-tp--disabled]="isDisabled()">
      <span class="material-symbols-rounded bui-tp__icon">schedule</span>
      <button type="button" class="bui-tp__control" [disabled]="isDisabled()" (click)="toggle()" aria-haspopup="listbox" [attr.aria-expanded]="open()">
        <span [class.bui-tp__placeholder]="seconds() == null">{{ display() || placeholder() }}</span>
        <span class="material-symbols-rounded bui-tp__caret">expand_more</span>
      </button>
    </div>
    @if (open()) {
      <div class="bui-tp__scrim" (click)="close()"></div>
      <ul class="bui-tp__list" role="listbox">
        @for (s of steps(); track s.seconds) {
          <li
            class="bui-tp__opt"
            [class.bui-tp__opt--sel]="s.seconds === seconds()"
            role="option"
            [attr.aria-selected]="s.seconds === seconds()"
            (click)="pick(s)"
          >{{ s.label }}</li>
        }
      </ul>
    }
  `,
  styles: `
    bui-timepicker { position:relative; display:inline-block; }
    .bui-tp { display:flex; align-items:center; gap:8px; height:48px; min-width:200px; padding:0 var(--bw-sizing-scale600); border-radius:var(--bw-input-border-radius, var(--bw-borders-radius300)); background:var(--bw-background-secondary); border:2px solid transparent; box-sizing:border-box; }
    .bui-tp:focus-within { border-color:var(--bw-border-accent); }
    .bui-tp--error { border-color:var(--bw-border-negative); }
    .bui-tp--disabled { opacity:.5; }
    .bui-tp__icon { font-size:20px; color:var(--bw-content-secondary); }
    .bui-tp__control { flex:1; display:flex; align-items:center; justify-content:space-between; height:100%; border:none; background:transparent; cursor:pointer; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    .bui-tp__placeholder { color:var(--bw-content-tertiary); }
    .bui-tp__caret { font-size:18px; color:var(--bw-content-secondary); }
    .bui-tp__scrim { position:fixed; inset:0; z-index:10; }
    .bui-tp__list { position:absolute; z-index:11; top:calc(100% + 4px); left:0; right:0; max-height:280px; overflow:auto; margin:0; padding:var(--bw-sizing-scale200) 0; list-style:none; background:var(--bw-background-primary); border-radius:var(--bw-borders-radius300); box-shadow:var(--bw-lighting-shadow600, 0 8px 24px rgba(0,0,0,.16)); }
    .bui-tp__opt { padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); cursor:pointer; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); }
    .bui-tp__opt:hover { background:var(--bw-background-secondary); }
    .bui-tp__opt--sel { background:var(--bw-background-accent-light); font-weight:600; }
  `,
})
export class Timepicker implements ControlValueAccessor {
  readonly error = input(false);
  readonly disabled = input(false);
  readonly format = input<'12' | '24'>('12');
  readonly step = input<number>(900);
  readonly placeholder = input<string>('Select time');
  readonly seconds = model<number | null>(null);

  protected readonly open = signal(false);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly steps = computed<TimeStep[]>(() => {
    const out: TimeStep[] = [];
    for (let s = 0; s < 86400; s += this.step()) out.push({ seconds: s, label: secondsToLabel(s, this.format()) });
    return out;
  });
  protected readonly display = computed(() => {
    const s = this.seconds();
    return s == null ? '' : secondsToLabel(s, this.format());
  });

  private onChange: (v: number | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected toggle(): void { if (!this.isDisabled()) this.open.update((o) => !o); }
  protected close(): void { this.open.set(false); }
  protected pick(s: TimeStep): void { this.seconds.set(s.seconds); this.onChange(s.seconds); this.open.set(false); }

  writeValue(v: number | null): void { this.seconds.set(v); }
  registerOnChange(fn: (v: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.cvaDisabled.set(d); }
}

@Component({
  selector: 'bui-s-timepicker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Timepicker],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start; min-height:360px;">
    <bui-timepicker [seconds]="34200" />
    <bui-timepicker format="24" [seconds]="54000" [step]="1800" />
  </div>`,
})
export class TimepickerScenario {}
