import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Timezone { id: string; label: string; offset: string; }

/** Subconjunto representativo de timezonepicker/tzdata.ts (mesmos ids IANA). */
export const TIMEZONES: Timezone[] = [
  { id: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time', offset: '-08:00' },
  { id: 'America/Denver', label: '(GMT-07:00) Mountain Time', offset: '-07:00' },
  { id: 'America/Chicago', label: '(GMT-06:00) Central Time', offset: '-06:00' },
  { id: 'America/New_York', label: '(GMT-05:00) Eastern Time', offset: '-05:00' },
  { id: 'America/Sao_Paulo', label: '(GMT-03:00) São Paulo', offset: '-03:00' },
  { id: 'Europe/London', label: '(GMT+00:00) London', offset: '+00:00' },
  { id: 'Europe/Paris', label: '(GMT+01:00) Central European Time', offset: '+01:00' },
  { id: 'Europe/Moscow', label: '(GMT+03:00) Moscow', offset: '+03:00' },
  { id: 'Asia/Dubai', label: '(GMT+04:00) Dubai', offset: '+04:00' },
  { id: 'Asia/Kolkata', label: '(GMT+05:30) India Standard Time', offset: '+05:30' },
  { id: 'Asia/Shanghai', label: '(GMT+08:00) China Standard Time', offset: '+08:00' },
  { id: 'Asia/Tokyo', label: '(GMT+09:00) Japan Standard Time', offset: '+09:00' },
  { id: 'Australia/Sydney', label: '(GMT+11:00) Sydney', offset: '+11:00' },
];

/** TimezonePicker — fiel ao baseui/timezonepicker (select de fusos com filtro). */
@Component({
  selector: 'bui-timezone-picker',
  exportAs: 'buiTimezonePicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimezonePicker), multi: true }],
  template: `
    <div class="bui-tz" [class.bui-tz--error]="error()" [class.bui-tz--disabled]="isDisabled()">
      <span class="material-symbols-rounded bui-tz__icon">public</span>
      <input
        type="text"
        class="bui-tz__input"
        [value]="open() ? query() : (selectedLabel() || '')"
        [disabled]="isDisabled()"
        [placeholder]="placeholder()"
        [attr.aria-label]="ariaLabel()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        (focus)="onFocus()"
        (input)="onType($event)"
        (blur)="onTouched()"
      />
      <span class="material-symbols-rounded bui-tz__caret">expand_more</span>
    </div>
    @if (open()) {
      <div class="bui-tz__scrim" (mousedown)="close()"></div>
      <ul class="bui-tz__list" role="listbox">
        @for (z of filtered(); track z.id) {
          <li
            class="bui-tz__opt"
            [class.bui-tz__opt--sel]="z.id === value()"
            role="option"
            [attr.aria-selected]="z.id === value()"
            (mousedown)="pick(z)"
          >{{ z.label }}</li>
        } @empty {
          <li class="bui-tz__empty">No results</li>
        }
      </ul>
    }
  `,
  styles: `
    bui-timezone-picker { position:relative; display:inline-block; }
    .bui-tz { display:flex; align-items:center; gap:8px; height:48px; min-width:320px; padding:0 var(--bw-sizing-scale600); border-radius:var(--bw-input-border-radius, var(--bw-borders-radius300)); background:var(--bw-background-secondary); border:2px solid transparent; box-sizing:border-box; }
    .bui-tz:focus-within { border-color:var(--bw-border-accent); }
    .bui-tz--error { border-color:var(--bw-border-negative); }
    .bui-tz--disabled { opacity:.5; }
    .bui-tz__icon { font-size:20px; color:var(--bw-content-secondary); }
    .bui-tz__input { flex:1; border:none; background:transparent; outline:none; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    .bui-tz__caret { font-size:18px; color:var(--bw-content-secondary); }
    .bui-tz__scrim { position:fixed; inset:0; z-index:10; }
    .bui-tz__list { position:absolute; z-index:11; top:calc(100% + 4px); left:0; right:0; max-height:280px; overflow:auto; margin:0; padding:var(--bw-sizing-scale200) 0; list-style:none; background:var(--bw-background-primary); border-radius:var(--bw-borders-radius300); box-shadow:var(--bw-lighting-shadow600, 0 8px 24px rgba(0,0,0,.16)); }
    .bui-tz__opt { padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); cursor:pointer; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); white-space:nowrap; }
    .bui-tz__opt:hover { background:var(--bw-background-secondary); }
    .bui-tz__opt--sel { background:var(--bw-background-accent-light); font-weight:600; }
    .bui-tz__empty { padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); font:var(--bw-font-ParagraphSmall); color:var(--bw-content-tertiary); }
  `,
})
export class TimezonePicker implements ControlValueAccessor {
  readonly error = input(false);
  readonly disabled = input(false);
  readonly zones = input<Timezone[]>(TIMEZONES);
  readonly placeholder = input<string>('Select timezone');
  readonly ariaLabel = input<string>('Select a timezone');
  readonly value = model<string | null>(null);

  protected readonly open = signal(false);
  protected readonly query = signal('');
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly selectedLabel = computed(() => this.zones().find((z) => z.id === this.value())?.label ?? '');
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.zones();
    return this.zones().filter((z) => z.label.toLowerCase().includes(q) || z.id.toLowerCase().includes(q));
  });

  private onChange: (v: string | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onFocus(): void { if (!this.isDisabled()) { this.open.set(true); this.query.set(''); } }
  protected onType(e: Event): void { this.query.set((e.target as HTMLInputElement).value); this.open.set(true); }
  protected close(): void { this.open.set(false); }
  protected pick(z: Timezone): void { this.value.set(z.id); this.onChange(z.id); this.query.set(''); this.open.set(false); }

  writeValue(v: string | null): void { this.value.set(v); }
  registerOnChange(fn: (v: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.cvaDisabled.set(d); }
}

@Component({
  selector: 'bui-s-timezone-picker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [TimezonePicker],
  template: `<div style="min-height:360px;"><bui-timezone-picker [value]="'America/Sao_Paulo'" /></div>`,
})
export class TimezonePickerScenario {}
