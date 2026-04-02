import { Component, ChangeDetectionStrategy, input, signal, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

let selectIdCounter = 0;

@Component({
  selector: 'app-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="select-field">
      @if (label()) {
        <label class="select-field__label" [for]="selectId">
            @if (required()) {<span class="required-star" aria-hidden="true">*</span>}{{ label() }}
          </label>
      }

      <div
        class="select-field__wrapper"
        [class.select-field__wrapper--error]="!!errorMessage()"
        [class.select-field__wrapper--disabled]="_disabled()"
      >
        <select
          [id]="selectId"
          class="select-field__control"
          [disabled]="_disabled()"
          [value]="_value()"
          (change)="_onChange($event)"
          (blur)="_onTouched()"
        >
          @if (placeholder()) {
            <option value="" disabled [selected]="!_value()">{{ placeholder() }}</option>
          }
          @for (opt of options(); track opt.value) {
            <option [value]="opt.value" [selected]="opt.value === _value()">{{ opt.label }}</option>
          }
        </select>
        <span class="select-field__arrow material-symbols-rounded" aria-hidden="true"
          >expand_more</span
        >
      </div>

      @if (hint() && !errorMessage()) {
        <p class="select-field__hint">{{ hint() }}</p>
      }

      @if (errorMessage()) {
        <p class="select-field__error" role="alert">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styleUrl: './select.component.scss',
})
export class SelectComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly required = input(false);
  readonly placeholder = input('');
  readonly options = input<SelectOption[]>([]);
  readonly hint = input('');
  readonly errorMessage = input('');

  readonly _disabled = signal(false);
  readonly _value = signal('');

  readonly selectId = `app-select-${++selectIdCounter}`;

  private _onChangeFn: (value: string) => void = () => {};
  _onTouched: () => void = () => {};

  _onChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this._value.set(val);
    this._onChangeFn(val);
  }

  writeValue(val: string): void {
    this._value.set(val ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  enable(): void {
    this._disabled.set(false);
  }

  disable(): void {
    this._disabled.set(true);
  }

  resetToInitialState(): void {
    this._value.set('');
    this._disabled.set(false);
  }

  isRequired(): boolean {
    return false;
  }
}
