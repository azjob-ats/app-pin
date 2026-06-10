import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';

export type RadioAlign = 'vertical' | 'horizontal';
export type RadioLabelPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * RadioGroup — clone fiel de `baseui/radio` (RadioGroupRoot). `<div role="radiogroup">`
 * que distribui `value`/`name`/`align`/`disabled`/`error` aos `bui-radio` filhos via DI.
 * Controlado ou stateful (`value`/`valueChange`).
 */
@Component({
  selector: 'bui-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './radio.component.scss',
  template: `<ng-content />`,
  host: {
    role: 'radiogroup',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-invalid]': 'error() || null',
    '[class]': 'hostClass()',
  },
})
export class BuiRadioGroup {
  readonly value = input<string>();
  readonly name = input<string>();
  readonly align = input<RadioAlign>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly valueChange = output<string>();

  /** Estado interno (segue `value`; alterável p/ uso stateful). */
  readonly valueState = linkedSignal(() => this.value());

  protected readonly hostClass = computed(
    () =>
      'bui-radio-group' +
      (this.align() === 'horizontal' ? ' bui-radio-group--horizontal' : '') +
      (this.disabled() ? ' bui-radio-group--disabled' : ''),
  );

  select(v: string): void {
    this.valueState.set(v);
    this.valueChange.emit(v);
  }
}

/**
 * Radio — clone fiel de `baseui/radio` (Radio). `<label>` com RadioMarkOuter/Inner +
 * `<input type=radio>` oculto + Label projetado + Description opcional. `checked` derivado
 * do `value` do grupo (injetado); estados hover/active/focus-visible via CSS; cores via
 * tokens `tick*` (reusa o Checkbox — nenhum token novo). Keyboard/roving via radios nativos.
 */
@Component({
  selector: 'bui-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './radio.component.scss',
  template: `
    <label class="bui-radio__root" data-baseweb="radio">
      <div class="bui-radio__outer"><div class="bui-radio__inner"></div></div>
      <input
        class="bui-radio__input"
        type="radio"
        [checked]="checked()"
        [disabled]="effDisabled()"
        [attr.name]="name() || null"
        [attr.value]="value()"
        [attr.aria-invalid]="effError() || null"
        (change)="onChange()"
        (click)="$event.stopPropagation()"
      />
      <div class="bui-radio__label" (click)="onLabelClick($event)"><ng-content /></div>
    </label>
    @if (description()) {
      <div class="bui-radio__description">{{ description() }}</div>
    }
  `,
  host: { '[class]': 'hostClass()' },
})
export class BuiRadio {
  private readonly group = inject(BuiRadioGroup);

  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly description = input<string>();
  readonly labelPlacement = input<RadioLabelPlacement>('right');
  readonly containsInteractiveElement = input(false, { transform: booleanAttribute });

  protected readonly checked = computed(() => this.group.valueState() === this.value());
  protected readonly effDisabled = computed(() => this.group.disabled() || this.disabled());
  protected readonly effError = computed(() => this.group.error());
  protected readonly horizontal = computed(() => this.group.align() === 'horizontal');
  protected readonly name = computed(() => this.group.name());

  protected readonly hostClass = computed(() =>
    [
      'bui-radio',
      'bui-radio--place-' + this.labelPlacement(),
      this.checked() ? 'bui-radio--checked' : '',
      this.effError() ? 'bui-radio--error' : '',
      this.effDisabled() ? 'bui-radio--disabled' : '',
      this.horizontal() ? 'bui-radio--horizontal' : '',
      this.description() ? 'bui-radio--has-desc' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onChange(): void {
    this.group.select(this.value());
  }

  protected onLabelClick(e: Event): void {
    if (this.containsInteractiveElement()) e.preventDefault();
  }
}
