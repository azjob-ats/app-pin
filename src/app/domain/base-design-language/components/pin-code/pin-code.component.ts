import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** PinCode — fiel ao baseui/pin-code (N campos de 1 dígito; foco avança). CVA string. */
@Component({
  selector: 'bui-pin-code',
  exportAs: 'buiPinCode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-pin" [attr.data-size]="size()">
      @for (i of slots(); track i) {
        <input
          class="bui-pin__cell"
          type="text"
          inputmode="numeric"
          maxlength="1"
          [value]="digits()[i] || ''"
          [disabled]="disabled()"
          [attr.aria-label]="'Dígito ' + (i + 1)"
          (input)="onInput(i, $event)"
          (keydown)="onKeydown(i, $event)"
        />
      }
    </div>
  `,
  styles: `
    .bui-pin { display:inline-flex; gap:var(--bw-sizing-scale300); }
    .bui-pin__cell {
      width:48px; height:48px; text-align:center; box-sizing:border-box;
      border:none; border-radius:var(--bw-input-border-radius);
      background:var(--bw-background-secondary); color:var(--bw-content-primary);
      font:var(--bw-font-HeadingXSmall); outline:none;
    }
    .bui-pin[data-size="mini"] .bui-pin__cell { width:32px; height:32px; font:var(--bw-font-LabelMedium); }
    .bui-pin[data-size="compact"] .bui-pin__cell { width:40px; height:40px; }
    .bui-pin[data-size="large"] .bui-pin__cell { width:56px; height:56px; }
    .bui-pin__cell:focus { box-shadow:inset 0 0 0 2px var(--bw-border-selected); background:var(--bw-background-primary); }
    .bui-pin__cell:disabled { background:var(--bw-background-state-disabled); cursor:not-allowed; }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PinCode), multi: true }],
})
export class PinCode implements ControlValueAccessor {
  readonly length = input<number>(4);
  readonly size = input<'mini' | 'compact' | 'default' | 'large'>('default');
  readonly disabled = input(false);

  protected readonly digits = signal<string[]>([]);
  protected readonly slots = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string | null): void { this.digits.set((v ?? '').split('').slice(0, this.length())); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void { /* disabled via input */ }

  protected onInput(i: number, e: Event): void {
    const el = e.target as HTMLInputElement;
    const v = el.value.replace(/\D/g, '').slice(0, 1);
    this.digits.update((d) => { const n = [...d]; n[i] = v; return n; });
    this.onChange(this.digits().join(''));
    this.onTouched();
    if (v && el.nextElementSibling) (el.nextElementSibling as HTMLInputElement).focus();
  }
  protected onKeydown(i: number, e: KeyboardEvent): void {
    const el = e.target as HTMLInputElement;
    if (e.key === 'Backspace' && !el.value && el.previousElementSibling) {
      (el.previousElementSibling as HTMLInputElement).focus();
    }
  }
}

@Component({
  selector: 'bui-s-pin-code', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [PinCode],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
    <bui-pin-code [length]="4" />
    <bui-pin-code [length]="6" size="compact" />
  </div>`,
})
export class PinCodeScenario {}
