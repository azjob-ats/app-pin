import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface CheckboxOption {
  value: string;
  label: string;
}

let checkboxGroupIdCounter = 0;

@Component({
  selector: 'app-checkbox-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="checkbox-group"
      role="group"
      [attr.aria-labelledby]="label() ? groupLabelId : null"
    >
      @if (label()) {
        <span [id]="groupLabelId" class="checkbox-group__label">{{ label() }}</span>
      }

      <ul class="checkbox-group__list" role="list">
        @for (opt of options(); track opt.value) {
          <li class="checkbox-group__item">
            <label
              class="checkbox-group__option"
              [class.checkbox-group__option--disabled]="_disabled()"
            >
              <input
                class="checkbox-group__input"
                type="checkbox"
                [value]="opt.value"
                [checked]="_isChecked(opt.value)"
                [disabled]="_disabled()"
                (change)="_onToggle(opt.value, $event)"
                (blur)="_onTouched()"
              />
              <span class="checkbox-group__box" aria-hidden="true">
                @if (_isChecked(opt.value)) {
                  <span class="material-symbols-rounded checkbox-group__check">check</span>
                }
              </span>
              <span class="checkbox-group__text">{{ opt.label }}</span>
            </label>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './checkbox-group.component.scss',
})
export class CheckboxGroupComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly options = input<CheckboxOption[]>([]);

  readonly _disabled = signal(false);
  readonly _values = signal<string[]>([]);

  readonly groupLabelId = `app-checkbox-group-${++checkboxGroupIdCounter}-label`;

  private _onChangeFn: (value: string[]) => void = () => {};
  _onTouched: () => void = () => {};

  _isChecked(value: string): boolean {
    return this._values().includes(value);
  }

  _onToggle(value: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this._values();
    const next = checked ? [...current, value] : current.filter((v) => v !== value);
    this._values.set(next);
    this._onChangeFn(next);
  }

  writeValue(val: string[]): void {
    this._values.set(val ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
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
    this._values.set([]);
    this._disabled.set(false);
  }

  isRequired(): boolean {
    return false;
  }
}
