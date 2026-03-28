import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface RadioOption {
  value: string;
  label: string;
}

let radioGroupIdCounter = 0;

@Component({
  selector: 'app-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="radio-group"
      role="radiogroup"
      [attr.aria-labelledby]="label() ? groupLabelId : null"
    >
      @if (label()) {
        <span [id]="groupLabelId" class="radio-group__label">{{ label() }}</span>
      }

      <ul class="radio-group__list" role="list">
        @for (opt of options(); track opt.value) {
          <li class="radio-group__item">
            <label class="radio-group__option" [class.radio-group__option--disabled]="_disabled()">
              <input
                class="radio-group__input"
                type="radio"
                [name]="groupName"
                [value]="opt.value"
                [checked]="_value() === opt.value"
                [disabled]="_disabled()"
                (change)="_onChange(opt.value)"
                (blur)="_onTouched()"
              />
              <span class="radio-group__circle" aria-hidden="true"></span>
              <span class="radio-group__text">{{ opt.label }}</span>
            </label>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './radio-group.component.scss',
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly options = input<RadioOption[]>([]);

  readonly _disabled = signal(false);
  readonly _value = signal('');

  readonly groupName = `app-radio-group-${++radioGroupIdCounter}`;
  readonly groupLabelId = `${this.groupName}-label`;

  private _onChangeFn: (value: string) => void = () => {};
  _onTouched: () => void = () => {};

  _onChange(value: string): void {
    this._value.set(value);
    this._onChangeFn(value);
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
