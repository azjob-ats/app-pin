import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'date' | 'url' | 'number' | 'tel';

let inputIdCounter = 0;

@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-field">
      @if (label()) {
        <label class="input-field__label" [for]="inputId">
            @if (required()) {<span class="required-star" aria-hidden="true">*</span>}{{ label() }}
          </label>
      }

      <div
        class="input-field__wrapper"
        [class.input-field__wrapper--with-action]="type() === 'password'"
        [class.input-field__wrapper--error]="!!errorMessage()"
        [class.input-field__wrapper--disabled]="_disabled()"
      >
        <input
          [id]="inputId"
          class="input-field__control"
          [type]="_effectiveType()"
          [placeholder]="placeholder()"
          [disabled]="_disabled()"
          [value]="_value()"
          (input)="_onInput($event)"
          (blur)="_onTouched()"
          (keydown.enter)="enter.emit()"
        />

        @if (type() === 'password') {
          <button
            class="input-field__toggle"
            type="button"
            (click)="_showPassword.update(v => !v)"
            [attr.aria-label]="_showPassword() ? 'Ocultar senha' : 'Mostrar senha'"
            tabindex="-1"
          >
            <span class="material-symbols-rounded" aria-hidden="true">
              {{ _showPassword() ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        }
      </div>

      @if (hint() && !errorMessage()) {
        <p class="input-field__hint">{{ hint() }}</p>
      }

      @if (errorMessage()) {
        <p class="input-field__error" role="alert">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly required = input(false);
  readonly type = input<InputType>('text');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly errorMessage = input('');

  readonly enter = output<void>();

  readonly _showPassword = signal(false);
  readonly _disabled = signal(false);
  readonly _value = signal('');

  readonly inputId = `app-input-${++inputIdCounter}`;

  readonly _effectiveType = computed(() =>
    this.type() === 'password' && this._showPassword() ? 'text' : this.type(),
  );

  private _onChange: (value: string) => void = () => {};
  _onTouched: () => void = () => {};

  _onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this._value.set(val);
    this._onChange(val);
  }

  writeValue(val: string): void {
    this._value.set(val ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
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
    this._showPassword.set(false);
  }

  isRequired(): boolean {
    return false;
  }
}
