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

export type RadioV2Align = 'vertical' | 'horizontal';
export type RadioV2LabelPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * RadioGroup v2 — clone de `baseui/radio-v2` (RadioGroupRoot). `<div role=radiogroup>` flex
 * com `columnGap scale600`/`rowGap scale300`, distribui `value`/`align`/`labelPlacement`/`name`/
 * `disabled`/`error` aos `bui-radio-v2` filhos via DI. Controlado ou stateful.
 */
@Component({
  selector: 'bui-radio-group-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './radio-v2.component.scss',
  template: `<ng-content />`,
  host: {
    role: 'radiogroup',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-invalid]': 'error() || null',
    '[class]': 'hostClass()',
  },
})
export class BuiRadioGroupV2 {
  readonly value = input<string>();
  readonly name = input<string>();
  readonly align = input<RadioV2Align>('vertical');
  readonly labelPlacement = input<RadioV2LabelPlacement>('right');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly valueChange = output<string>();

  readonly valueState = linkedSignal(() => this.value());

  protected readonly hostClass = computed(() => {
    const h = this.align() === 'horizontal';
    return (
      'bui-radio-group-v2' +
      (h ? ' bui-radio-group-v2--horizontal' : '') +
      (h && this.labelPlacement() === 'top' ? ' bui-radio-group-v2--align-end' : '')
    );
  });

  select(v: string): void {
    this.valueState.set(v);
    this.valueChange.emit(v);
  }
}

/**
 * Radio v2 — clone de `baseui/radio-v2`. Igual ao Radio mas com **backplate** (state layer
 * 32×32 + overlay hover/press), mark **17×17** (borda 2px, inner 100%→5px ao marcar), label
 * `LabelSmall` + Description num LabelWrapper, foco 4px e `labelPlacement` top/right/bottom/left.
 * Funciona dentro de `bui-radio-group-v2` (DI) **ou standalone** (`checked` próprio). Cores via
 * `contentPrimary`/`tagRedBorderSecondarySelected`(=red700)/overlays — nenhum token novo.
 */
@Component({
  selector: 'bui-radio-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './radio-v2.component.scss',
  template: `
    <label class="bui-radio-v2__root" data-baseweb="radio">
      <div class="bui-radio-v2__backplate">
        <div class="bui-radio-v2__outer"><div class="bui-radio-v2__inner"></div></div>
      </div>
      <input
        class="bui-radio-v2__input"
        type="radio"
        [checked]="checked()"
        [disabled]="effDisabled()"
        [attr.name]="name() || null"
        [attr.value]="value() || null"
        [attr.aria-invalid]="effError() || null"
        (change)="onChange()"
        (click)="$event.stopPropagation()"
      />
      <div class="bui-radio-v2__label-wrapper">
        <div class="bui-radio-v2__label" (click)="onLabelClick($event)"><ng-content /></div>
        @if (description()) {
          <div class="bui-radio-v2__description">{{ description() }}</div>
        }
      </div>
    </label>
  `,
  host: { '[class]': 'hostClass()' },
})
export class BuiRadioV2 {
  private readonly group = inject(BuiRadioGroupV2, { optional: true });

  readonly value = input<string>();
  /** `checked` próprio — usado quando o radio é standalone (sem grupo). */
  readonly checkedInput = input(false, { alias: 'checked', transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly description = input<string>();
  readonly labelPlacement = input<RadioV2LabelPlacement>();
  readonly align = input<RadioV2Align>();
  readonly containsInteractiveElement = input(false, { transform: booleanAttribute });

  protected readonly checked = computed(() =>
    this.group ? this.group.valueState() === this.value() : this.checkedInput(),
  );
  protected readonly effDisabled = computed(() => (this.group?.disabled() ?? false) || this.disabled());
  protected readonly effError = computed(() => (this.group?.error() ?? false) || this.error());
  protected readonly placement = computed(() => this.labelPlacement() ?? this.group?.labelPlacement() ?? 'right');
  protected readonly horizontal = computed(() => (this.align() ?? this.group?.align() ?? 'vertical') === 'horizontal');
  protected readonly name = computed(() => this.group?.name());

  protected readonly hostClass = computed(() =>
    [
      'bui-radio-v2',
      'bui-radio-v2--place-' + this.placement(),
      this.checked() ? 'bui-radio-v2--checked' : '',
      this.effError() ? 'bui-radio-v2--error' : '',
      this.effDisabled() ? 'bui-radio-v2--disabled' : '',
      this.horizontal() ? 'bui-radio-v2--horizontal' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onChange(): void {
    const v = this.value();
    if (this.group && v != null) this.group.select(v);
  }

  protected onLabelClick(e: Event): void {
    if (this.containsInteractiveElement()) e.preventDefault();
  }
}
