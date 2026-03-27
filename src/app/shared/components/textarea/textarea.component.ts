import { Component, ChangeDetectionStrategy, input, signal, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

let textareaIdCounter = 0;

@Component({
  selector: 'app-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="textarea-field">
      @if (label()) {
        <label class="textarea-field__label" [for]="textareaId">{{ label() }}</label>
      }

      <textarea
        [id]="textareaId"
        class="textarea-field__control"
        [class.textarea-field__control--error]="!!errorMessage()"
        [class.textarea-field__control--disabled]="_disabled()"
        [placeholder]="placeholder()"
        [disabled]="_disabled()"
        [rows]="rows()"
        [attr.maxlength]="maxlength()"
        [value]="_value()"
        (input)="_onInput($event)"
        (blur)="_onTouched()"
      ></textarea>

      @if (hint() && !errorMessage()) {
        <p class="textarea-field__hint">{{ hint() }}</p>
      }

      @if (errorMessage()) {
        <p class="textarea-field__error" role="alert">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly errorMessage = input('');
  readonly rows = input(4);
  readonly maxlength = input<number | null>(null);

  readonly _disabled = signal(false);
  readonly _value = signal('');

  readonly textareaId = `app-textarea-${++textareaIdCounter}`;

  private _onChange: (value: string) => void = () => {};
  _onTouched: () => void = () => {};

  _onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
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
  }

  isRequired(): boolean {
    return false;
  }
}
