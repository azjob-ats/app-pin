import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { BuiDeleteAlt, BuiHide, BuiShow } from '../icon/icon.component';

export type InputSize = 'mini' | 'compact' | 'default' | 'large';

/** Marcadores dos slots de enhancer/adornos. */
@Directive({ selector: '[buiInputStart]' })
export class BuiInputStart {}
@Directive({ selector: '[buiInputEnd]' })
export class BuiInputEnd {}
@Directive({ selector: '[buiInputBefore]' })
export class BuiInputBefore {}
@Directive({ selector: '[buiInputAfter]' })
export class BuiInputAfter {}

/**
 * Input — clone fiel do `baseui/input`. Root com borda 2px (cor por estado:
 * default/focus/error/positive/disabled), `InputContainer` + `<input>` transparente, e
 * enhancers `[buiInputStart]`/`[buiInputEnd]` + adornos `[buiInputBefore]`/`[buiInputAfter]`.
 * `clearable` mostra o ✕ (DeleteAlt) quando há valor; `type=password` adiciona o toggle Hide/Show.
 * Foco via `:focus-within`.
 */
@Component({
  selector: 'bui-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDeleteAlt, BuiHide, BuiShow],
  styleUrl: './input.component.scss',
  template: `
    <div class="bui-input__root">
      <ng-content select="[buiInputBefore]" />
      @if (start()) {
        <div class="bui-input__enhancer"><ng-content select="[buiInputStart]" /></div>
      }
      <div class="bui-input__container">
        <input
          #field
          class="bui-input__field"
          [type]="effectiveType()"
          [value]="value()"
          [attr.placeholder]="placeholder()"
          [disabled]="disabled()"
          [readOnly]="readOnly()"
          [attr.aria-label]="ariaLabel()"
          (input)="onInput($event)"
        />
      </div>
      @if (clearable() && value() && !disabled()) {
        <button type="button" class="bui-input__icon-btn" aria-label="Clear value" (click)="clear()">
          <bui-delete-alt />
        </button>
      }
      @if (type() === 'password') {
        <button type="button" class="bui-input__icon-btn" [attr.aria-label]="reveal() ? 'Hide value' : 'Show value'" (click)="toggleReveal()">
          @if (reveal()) {
            <bui-hide />
          } @else {
            <bui-show />
          }
        </button>
      }
      @if (end()) {
        <div class="bui-input__enhancer"><ng-content select="[buiInputEnd]" /></div>
      }
      <ng-content select="[buiInputAfter]" />
    </div>
  `,
  host: {
    'data-baseweb': 'input',
    '[class]': 'classes()',
  },
})
export class BuiInput {
  readonly size = input<InputSize>('default');
  readonly value = linkedSignal(() => this.valueIn());
  readonly valueIn = input('', { alias: 'value' });
  readonly placeholder = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly type = input<string>('text');
  readonly ariaLabel = input<string>();
  readonly valueChange = output<string>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');
  protected readonly start = contentChild(BuiInputStart);
  protected readonly end = contentChild(BuiInputEnd);

  constructor() {
    afterNextRender(() => {
      if (this.autoFocus()) this.field().nativeElement.focus();
    });
  }
  /** Revela o valor (type=password → text). */
  protected readonly reveal = signal(false);
  protected readonly effectiveType = computed(() => (this.type() === 'password' && this.reveal() ? 'text' : this.type()));

  protected readonly classes = computed(() =>
    [
      'bui-input',
      `bui-input--${this.size()}`,
      this.disabled() ? 'bui-input--disabled' : '',
      this.error() ? 'bui-input--error' : '',
      this.positive() ? 'bui-input--positive' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this.valueChange.emit(v);
  }
  protected clear(): void {
    this.value.set('');
    this.valueChange.emit('');
  }
  protected toggleReveal(): void {
    this.reveal.update((r) => !r);
  }
}
