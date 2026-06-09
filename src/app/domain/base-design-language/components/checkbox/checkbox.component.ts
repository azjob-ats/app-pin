import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';

export type CheckmarkType = 'default' | 'toggle';
export type CheckboxLabelPlacement = 'top' | 'right' | 'bottom' | 'left';

/** SVG do "check" (marca de selecionado), com a cor `tickMark` resolvida em runtime. */
function checkSvg(color: string): string {
  const svg = encodeURIComponent(
    `<svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.50002 12.6L0.400024 6.60002L2.60002 4.40002L6.50002 8.40002L13.9 0.900024L16.1 3.10002L6.50002 12.6Z" fill="${color}"/></svg>`,
  );
  return `url('data:image/svg+xml,${svg}')`;
}

/** SVG do traço "indeterminate". */
function indeterminateSvg(color: string): string {
  const svg = encodeURIComponent(
    `<svg width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0.5H0V3.5H14V0.5Z" fill="${color}"/></svg>`,
  );
  return `url('data:image/svg+xml,${svg}')`;
}

/**
 * Checkbox — clone fiel do `baseui/checkbox` (StatelessCheckbox). `<label>` com
 * Checkmark (ou ToggleTrack+Toggle quando `checkmarkType="toggle"`) + `<input
 * type=checkbox>` oculto + Label projetado. Suporta `checked`/`isIndeterminate`/
 * `error`/`disabled`, `labelPlacement` (top/right/bottom/left) e estados hover/active/
 * focus-visible via CSS. Cores via tokens `tick*`/`toggle*` (nenhum token novo além
 * de `--bw-red-800`, aditivo). Controlado (`checked`/`checkedChange`) ou stateful.
 */
@Component({
  selector: 'label[buiCheckbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './checkbox.component.scss',
  template: `
    @if (checkmarkType() === 'toggle') {
      <div class="bui-checkbox__toggle-track">
        <div class="bui-checkbox__toggle"></div>
      </div>
    } @else {
      <span class="bui-checkbox__checkmark" [style.background-image]="markBg()"></span>
    }
    <input
      #input
      class="bui-checkbox__input"
      type="checkbox"
      [checked]="checkedState()"
      [disabled]="disabled()"
      [attr.value]="value() || null"
      [attr.name]="name() || null"
      [attr.id]="id() || null"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-invalid]="error() || null"
      [attr.aria-required]="required() || null"
      (change)="onChange($event)"
      (click)="$event.stopPropagation()"
    />
    <div class="bui-checkbox__label" (click)="onLabelClick($event)"><ng-content /></div>
  `,
  host: {
    'data-baseweb': 'checkbox',
    '[attr.title]': 'title() || null',
    '[class]': 'hostClass()',
  },
})
export class Checkbox {
  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly isIndeterminate = input(false, { transform: booleanAttribute });
  readonly checkmarkType = input<CheckmarkType>('default');
  readonly labelPlacement = input<CheckboxLabelPlacement>();
  readonly containsInteractiveElement = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly title = input<string>();
  readonly value = input<string>();
  readonly name = input<string>();
  readonly id = input<string>();
  readonly checkedChange = output<boolean>();

  /** Estado interno (segue `checked`; alterável p/ uso stateful). */
  protected readonly checkedState = linkedSignal(() => this.checked());
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly host = inject(ElementRef);

  /** Placement default: toggle = left, checkmark = right (igual ao baseweb). */
  protected readonly placement = computed<CheckboxLabelPlacement>(
    () => this.labelPlacement() ?? (this.checkmarkType() === 'toggle' ? 'left' : 'right'),
  );

  protected readonly hostClass = computed(() => {
    const selected = this.checkedState() || this.isIndeterminate();
    return [
      'bui-checkbox',
      'bui-checkbox--' + this.checkmarkType(),
      'bui-checkbox--place-' + this.placement(),
      this.checkedState() ? 'bui-checkbox--checked' : '',
      this.isIndeterminate() ? 'bui-checkbox--indeterminate' : '',
      selected ? 'bui-checkbox--selected' : '',
      this.error() ? 'bui-checkbox--error' : '',
      this.disabled() ? 'bui-checkbox--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  /** Cores da marca resolvidas em runtime (tickMarkFill / tickMarkFillError). */
  private readonly markFill = linkedSignal<string>(() => '#fff');
  private readonly markError = linkedSignal<string>(() => '#fff');

  protected readonly markBg = computed(() => {
    if (!this.checkedState() && !this.isIndeterminate()) return 'none';
    const color = this.disabled() ? this.markFill() : this.error() ? this.markError() : this.markFill();
    return this.isIndeterminate() ? indeterminateSvg(color) : checkSvg(color);
  });

  constructor() {
    afterNextRender(() => {
      const cs = getComputedStyle(this.host.nativeElement as HTMLElement);
      this.markFill.set(cs.getPropertyValue('--bw-content-inverse-primary').trim() || '#fff');
      this.markError.set(cs.getPropertyValue('--bw-content-on-color').trim() || '#fff');
      if (this.autoFocus()) this.inputRef()?.nativeElement.focus();
    });
    // Espelha o `indeterminate` no DOM (propriedade, não atributo).
    effect(() => {
      const el = this.inputRef()?.nativeElement;
      if (el) el.indeterminate = this.isIndeterminate();
    });
  }

  protected onChange(e: Event): void {
    const v = (e.target as HTMLInputElement).checked;
    this.checkedState.set(v);
    this.checkedChange.emit(v);
  }

  /** Evita mover o foco/togglar ao clicar num elemento interativo dentro do label. */
  protected onLabelClick(e: Event): void {
    if (this.containsInteractiveElement()) e.preventDefault();
  }
}
