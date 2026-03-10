import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-code-digits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="code-inputs" role="group" aria-label="Verification code">
      @for (i of indices(); track i) {
        <input
          #codeInput
          class="code-input"
          type="text"
          inputmode="numeric"
          maxlength="1"
          [attr.aria-label]="'Digit ' + (i + 1) + ' of ' + length()"
          [value]="codeDigits()[i]"
          [disabled]="isDisabled()"
          (input)="onDigitInput($event, i)"
          (keydown.backspace)="onBackspace(i)"
          (paste)="onPaste($event)"
        />
      }
    </div>
  `,
  styleUrl: './code-digits.component.scss',
})
export class CodeDigitsComponent {
  readonly length = input<number>(6);

  readonly valueChange = output<string>();

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  readonly codeDigits = signal<string[]>(Array(6).fill(''));
  readonly isDisabled = signal(false);

  readonly indices = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  enable(): void {
    this.isDisabled.set(false);
  }

  disable(): void {
    this.isDisabled.set(true);
  }

  resetToInitialState(): void {
    this.codeDigits.set(Array(this.length()).fill(''));
    this.valueChange.emit('');
  }

  isRequired(): boolean {
    return false;
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    const digits = [...this.ensureDigits()];
    digits[index] = val;
    this.codeDigits.set(digits);
    this.valueChange.emit(digits.join(''));
    if (val && index < this.length() - 1) {
      this.codeInputs.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onBackspace(index: number): void {
    const digits = [...this.ensureDigits()];
    if (!digits[index] && index > 0) {
      this.codeInputs.toArray()[index - 1]?.nativeElement.focus();
    }
    digits[index] = '';
    this.codeDigits.set(digits);
    this.valueChange.emit(digits.join(''));
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, this.length()).split('');
    const filled = Array.from({ length: this.length() }, (_, i) => digits[i] ?? '');
    this.codeDigits.set(filled);
    this.valueChange.emit(filled.join(''));
  }

  private ensureDigits(): string[] {
    const d = this.codeDigits();
    return d.length === this.length() ? d : Array(this.length()).fill('');
  }
}
