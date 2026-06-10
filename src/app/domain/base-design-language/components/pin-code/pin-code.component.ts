import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';

export type PinCodeSize = 'mini' | 'compact' | 'default' | 'large';

const CELL_WIDTH: Record<PinCodeSize, string> = {
  mini: '32px',
  compact: '36px',
  default: '48px',
  large: '56px',
};

@Component({
  selector: 'bui-pin-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './pin-code.component.scss',
  template: `
    <div
      class="bui-pin-code"
      data-baseweb="pin-code"
      [attr.aria-label]="ariaLabel()"
    >
      @for (v of values(); track $index; let i = $index) {
        <div
          class="bui-input"
          [class.bui-input--mini]="size() === 'mini'"
          [class.bui-input--compact]="size() === 'compact'"
          [class.bui-input--default]="size() === 'default'"
          [class.bui-input--large]="size() === 'large'"
          [class.bui-input--disabled]="disabled()"
          [class.bui-input--error]="error()"
          [class.bui-input--positive]="positive()"
          [style.width]="cellWidth()"
          [style.margin-right]="i < values().length - 1 ? '8px' : null"
        >
          <div class="bui-input__root">
            <div class="bui-input__container">
              <input
                #cell
                class="bui-input__field bui-pin-code__input"
                inputmode="numeric"
                autocomplete="one-time-code"
                pattern="\\d*"
                maxlength="2"
                [value]="displayValue(i)"
                [disabled]="disabled()"
                [attr.placeholder]="focused() ? '' : placeholder()"
                [attr.aria-label]="ariaLabel()"
                (focus)="onFocus()"
                (blur)="onBlur()"
                (input)="onInput($event, i)"
                (keydown)="onKeydown($event, i)"
              />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class BuiPinCode {
  readonly size = input<PinCodeSize>('default');
  readonly values = input<string[]>(['', '', '', '']);
  readonly mask = input<string | boolean>(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly placeholder = input('○');
  readonly manageFocus = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Please enter your pin code');

  readonly valuesChange = output<string[]>();

  readonly cellWidth = computed(() => CELL_WIDTH[this.size()]);

  private readonly cells = viewChildren<ElementRef<HTMLInputElement>>('cell');
  protected readonly focused = signal(false);

  protected displayValue(i: number): string {
    const v = this.values()[i];
    if (v !== '' && typeof this.mask() === 'string') return this.mask() as string;
    return v;
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
  }

  protected onInput(e: Event, i: number): void {
    const input = e.target as HTMLInputElement;
    const eventValue = input.value;

    if (eventValue.length > 2) {
      if (eventValue.length === this.values().length && /^\d+$/.test(eventValue)) {
        const newValues = eventValue.split('');
        this.valuesChange.emit(newValues);
        if (this.manageFocus()) {
          const refs = this.cells();
          refs[refs.length - 1]?.nativeElement.focus();
        }
      }
      return;
    }

    if (eventValue === '') {
      const newValues = [...this.values()];
      newValues[i] = '';
      this.valuesChange.emit(newValues);
      return;
    }

    const currentValue = this.values()[i];
    let newChar = eventValue;
    if (currentValue[0] === eventValue[0]) {
      newChar = eventValue[1];
    } else if (currentValue[0] === eventValue[1]) {
      newChar = eventValue[0];
    }

    if (/^\d$/.test(newChar)) {
      const newValues = [...this.values()];
      newValues[i] = newChar;
      this.valuesChange.emit(newValues);
      if (this.manageFocus() && i < this.values().length - 1) {
        this.cells()[i + 1]?.nativeElement.focus();
      }
    }
  }

  protected onKeydown(e: KeyboardEvent, i: number): void {
    if (this.manageFocus() && e.key === 'Backspace' && this.values()[i] === '' && i > 0) {
      this.cells()[i - 1]?.nativeElement.focus();
    }
  }
}

@Component({
  selector: 'bui-stateful-pin-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPinCode],
  template: `
    <bui-pin-code
      [values]="values()"
      [size]="size()"
      [mask]="mask()"
      [disabled]="disabled()"
      [error]="error()"
      [positive]="positive()"
      [placeholder]="placeholder()"
      [manageFocus]="manageFocus()"
      [ariaLabel]="ariaLabel()"
      (valuesChange)="values.set($event)"
    />
  `,
})
export class BuiStatefulPinCode {
  readonly size = input<PinCodeSize>('default');
  readonly mask = input<string | boolean>(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly placeholder = input('○');
  readonly manageFocus = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Please enter your pin code');

  readonly values = signal<string[]>(['', '', '', '']);

  readonly valuesChange = output<string[]>();
}
