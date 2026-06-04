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

/** PaymentCard — fiel ao baseui/payment-card (input com máscara #### #### #### #### + ícone). CVA string. */
@Component({
  selector: 'bui-payment-card',
  exportAs: 'buiPaymentCard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-paycard" [attr.data-disabled]="disabled() ? '' : null">
      <span class="material-symbols-rounded bui-paycard__icon">credit_card</span>
      <input
        class="bui-paycard__field"
        type="text"
        inputmode="numeric"
        autocomplete="cc-number"
        placeholder="1234 5678 9012 3456"
        [value]="formatted()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      @if (brand()) { <span class="bui-paycard__brand">{{ brand() }}</span> }
    </div>
  `,
  styles: `
    .bui-paycard { display:flex; align-items:center; gap:var(--bw-sizing-scale300); min-height:48px; padding:0 var(--bw-sizing-scale500); border-radius:var(--bw-input-border-radius); background:var(--bw-background-secondary); box-shadow:inset 0 0 0 2px transparent; }
    .bui-paycard:focus-within { background:var(--bw-background-primary); box-shadow:inset 0 0 0 2px var(--bw-border-selected); }
    .bui-paycard[data-disabled] { background:var(--bw-background-state-disabled); }
    .bui-paycard__icon { font-size:20px; color:var(--bw-content-tertiary); }
    .bui-paycard__field { flex:1; min-width:0; border:none; background:transparent; color:var(--bw-content-primary); font:var(--bw-font-ParagraphMedium); letter-spacing:1px; outline:none; }
    .bui-paycard__field::placeholder { color:var(--bw-content-tertiary); }
    .bui-paycard__brand { font:var(--bw-font-LabelXSmall); text-transform:uppercase; color:var(--bw-content-secondary); }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PaymentCard), multi: true }],
})
export class PaymentCard implements ControlValueAccessor {
  readonly disabled = input(false);

  protected readonly raw = signal('');
  protected readonly formatted = computed(() => (this.raw().match(/.{1,4}/g) ?? []).join(' '));
  protected readonly brand = computed(() => {
    const n = this.raw();
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return '';
  });

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};
  writeValue(v: string | null): void { this.raw.set((v ?? '').replace(/\D/g, '')); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void { /* via input */ }
  protected onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 19);
    this.raw.set(v); this.onChange(v);
  }
}

@Component({
  selector: 'bui-s-payment-card', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [PaymentCard],
  template: `<div style="width:340px;"><bui-payment-card /></div>`,
})
export class PaymentCardScenario {}
