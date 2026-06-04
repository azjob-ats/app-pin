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
import { LabelPlacement, StyleType } from './checkbox.model';

/**
 * Checkbox — clone fiel do baseui/checkbox. CVA booleano. Checkmark 20×20, borda 3px,
 * radius 0 (default) ou toggle. Estados: checked, indeterminate, error, disabled.
 * Tokens `tick*`. Seletor `bui-checkbox`; classe `Checkbox`.
 */
@Component({
  selector: 'bui-checkbox',
  exportAs: 'buiCheckbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true },
  ],
  host: { class: 'bui-checkbox-host' },
})
export class Checkbox implements ControlValueAccessor {
  readonly disabled = input(false);
  readonly error = input(false);
  readonly isIndeterminate = input(false);
  readonly labelPlacement = input<LabelPlacement>('right');
  readonly checkmarkType = input<StyleType>('default');

  protected readonly checked = signal(false);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly classes = computed(
    () =>
      `bui-checkbox bui-checkbox--${this.checkmarkType()} bui-checkbox--label-${this.labelPlacement()}` +
      (this.error() ? ' bui-checkbox--error' : '') +
      (this.isDisabled() ? ' bui-checkbox--disabled' : ''),
  );

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: boolean | null): void {
    this.checked.set(!!v);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }

  protected onToggle(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
