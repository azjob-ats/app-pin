import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Country { id: string; label: string; dialCode: string; }

/** Subconjunto representativo de phone-input/constants.ts (countries são iguais à fonte). */
export const COUNTRIES: Country[] = [
  { id: 'US', label: 'United States', dialCode: '+1' },
  { id: 'BR', label: 'Brazil (Brasil)', dialCode: '+55' },
  { id: 'GB', label: 'United Kingdom', dialCode: '+44' },
  { id: 'CA', label: 'Canada', dialCode: '+1' },
  { id: 'DE', label: 'Germany (Deutschland)', dialCode: '+49' },
  { id: 'FR', label: 'France', dialCode: '+33' },
  { id: 'ES', label: 'Spain (España)', dialCode: '+34' },
  { id: 'PT', label: 'Portugal', dialCode: '+351' },
  { id: 'IN', label: 'India', dialCode: '+91' },
  { id: 'JP', label: 'Japan (日本)', dialCode: '+81' },
  { id: 'CN', label: 'China (中国)', dialCode: '+86' },
  { id: 'AU', label: 'Australia', dialCode: '+61' },
  { id: 'MX', label: 'Mexico (México)', dialCode: '+52' },
  { id: 'AR', label: 'Argentina', dialCode: '+54' },
  { id: 'IT', label: 'Italy (Italia)', dialCode: '+39' },
];

/** Deriva o emoji de bandeira a partir do ISO-3166 (regional indicator symbols). */
function flagEmoji(id: string): string {
  return id.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

/** PhoneInput — fiel ao baseui/phone-input (country picker + input de número). */
@Component({
  selector: 'bui-phone-input',
  exportAs: 'buiPhoneInput',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneInput), multi: true }],
  template: `
    <div class="bui-phone" [class.bui-phone--error]="error()" [class.bui-phone--disabled]="isDisabled()">
      <button type="button" class="bui-phone__country" [disabled]="isDisabled()" (click)="toggle()" aria-haspopup="listbox" [attr.aria-expanded]="open()">
        <span class="bui-phone__flag">{{ flag(country().id) }}</span>
        <span class="bui-phone__dial">{{ country().dialCode }}</span>
        <span class="material-symbols-rounded bui-phone__caret">expand_more</span>
      </button>
      <input
        type="tel"
        class="bui-phone__input"
        [value]="text()"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabel()"
        placeholder="Enter phone number"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </div>
    @if (open()) {
      <div class="bui-phone__scrim" (click)="close()"></div>
      <ul class="bui-phone__list" role="listbox">
        @for (c of countries(); track c.id) {
          <li
            class="bui-phone__opt"
            [class.bui-phone__opt--sel]="c.id === country().id"
            role="option"
            [attr.aria-selected]="c.id === country().id"
            (click)="pick(c)"
          >
            <span class="bui-phone__flag">{{ flag(c.id) }}</span>
            <span class="bui-phone__optlabel">{{ c.label }}</span>
            <span class="bui-phone__optdial">{{ c.dialCode }}</span>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    bui-phone-input { position:relative; display:inline-block; }
    .bui-phone { display:flex; align-items:center; height:48px; border-radius:var(--bw-input-border-radius, var(--bw-borders-radius300)); background:var(--bw-background-secondary); border:2px solid transparent; overflow:hidden; }
    .bui-phone:focus-within { border-color:var(--bw-border-accent); }
    .bui-phone--error { border-color:var(--bw-border-negative); }
    .bui-phone--disabled { opacity:.5; }
    .bui-phone__country { display:flex; align-items:center; gap:6px; height:100%; padding:0 var(--bw-sizing-scale600); border:none; border-right:1px solid var(--bw-border-opaque); background:transparent; cursor:pointer; font:var(--bw-font-LabelMedium); color:var(--bw-content-primary); }
    .bui-phone__country:disabled { cursor:not-allowed; }
    .bui-phone__flag { font-size:18px; line-height:1; }
    .bui-phone__caret { font-size:18px; color:var(--bw-content-secondary); }
    .bui-phone__input { flex:1; height:100%; min-width:160px; padding:0 var(--bw-sizing-scale600); border:none; background:transparent; outline:none; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    .bui-phone__scrim { position:fixed; inset:0; z-index:10; }
    .bui-phone__list { position:absolute; z-index:11; top:calc(100% + 4px); left:0; min-width:280px; max-height:280px; overflow:auto; margin:0; padding:var(--bw-sizing-scale200) 0; list-style:none; background:var(--bw-background-primary); border-radius:var(--bw-borders-radius300); box-shadow:var(--bw-lighting-shadow600, 0 8px 24px rgba(0,0,0,.16)); }
    .bui-phone__opt { display:flex; align-items:center; gap:10px; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); cursor:pointer; font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); }
    .bui-phone__opt:hover { background:var(--bw-background-secondary); }
    .bui-phone__opt--sel { background:var(--bw-background-accent-light); }
    .bui-phone__optlabel { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .bui-phone__optdial { color:var(--bw-content-secondary); }
  `,
})
export class PhoneInput implements ControlValueAccessor {
  readonly error = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input<string>('Please enter a phone number without the country dial code.');
  readonly countries = input<Country[]>(COUNTRIES);
  readonly country = model<Country>(COUNTRIES[0]);

  protected readonly text = signal('');
  protected readonly open = signal(false);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected readonly flag = flagEmoji;

  protected toggle(): void { if (!this.isDisabled()) this.open.update((o) => !o); }
  protected close(): void { this.open.set(false); }
  protected pick(c: Country): void { this.country.set(c); this.open.set(false); this.emit(); }
  protected onInput(e: Event): void { this.text.set((e.target as HTMLInputElement).value); this.emit(); }
  private emit(): void { this.onChange(`${this.country().dialCode} ${this.text()}`.trim()); }

  writeValue(v: string | null): void { this.text.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.cvaDisabled.set(d); }
}

@Component({
  selector: 'bui-s-phone-input', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [PhoneInput],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
    <bui-phone-input />
    <bui-phone-input [error]="true" />
    <bui-phone-input [disabled]="true" />
  </div>`,
})
export class PhoneInputScenario {}
