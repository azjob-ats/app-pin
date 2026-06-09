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

export type CheckboxV2LabelPlacement = 'left' | 'right';

/** SVG do "check" (v2: viewBox 24, render 17×17), cor `contentInversePrimary` em runtime. */
function checkSvg(color: string): string {
  const svg = encodeURIComponent(
    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m10 17.34-4.56-4.56 2.12-2.12L10 13.1l6.44-6.44 2.12 2.12L10 17.34Z" fill="${color}"/></svg>`,
  );
  return `url('data:image/svg+xml,${svg}')`;
}

/** SVG do traço "indeterminate" (v2). */
function indeterminateSvg(color: string): string {
  const svg = encodeURIComponent(
    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10.5H6v3h12v-3Z" fill="${color}"/></svg>`,
  );
  return `url('data:image/svg+xml,${svg}')`;
}

/**
 * Checkbox v2 — clone fiel do `baseui/checkbox-v2`. Igual ao Checkbox mas com **state
 * layer** (CheckmarkContainer 32×32 com overlay de hover/press), Checkmark 17×17 (borda
 * 2px, raio 4px), label `ParagraphSmall`, foco visível 4px (outline 2px + offset 2px) e
 * apenas `labelPlacement` left/right (sem toggle). Estados via CSS puro; cor da marca
 * (contentInversePrimary) resolvida em runtime. Controlado ou stateful.
 */
@Component({
  selector: 'label[buiCheckboxV2]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './checkbox-v2.component.scss',
  template: `
    <span class="bui-checkbox-v2__container">
      <span class="bui-checkbox-v2__checkmark" [style.background-image]="markBg()"></span>
    </span>
    <input
      #input
      class="bui-checkbox-v2__input"
      type="checkbox"
      [checked]="checkedState()"
      [disabled]="disabled()"
      [attr.value]="value() || null"
      [attr.name]="name() || null"
      [attr.id]="id() || null"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-controls]="ariaControls() || null"
      [attr.aria-invalid]="error() || null"
      [attr.aria-required]="required() || null"
      (change)="onChange($event)"
      (click)="$event.stopPropagation()"
    />
    <div class="bui-checkbox-v2__label" (click)="onLabelClick($event)"><ng-content /></div>
  `,
  host: {
    'data-baseweb': 'checkbox-v2',
    '[attr.title]': 'title() || null',
    '[class]': 'hostClass()',
  },
})
export class CheckboxV2 {
  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly isIndeterminate = input(false, { transform: booleanAttribute });
  readonly labelPlacement = input<CheckboxV2LabelPlacement>('right');
  readonly containsInteractiveElement = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly ariaControls = input<string>();
  readonly title = input<string>();
  readonly value = input<string>();
  readonly name = input<string>();
  readonly id = input<string>();
  readonly checkedChange = output<boolean>();

  protected readonly checkedState = linkedSignal(() => this.checked());
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly host = inject(ElementRef);

  protected readonly hostClass = computed(() => {
    const selected = this.checkedState() || this.isIndeterminate();
    return [
      'bui-checkbox-v2',
      'bui-checkbox-v2--place-' + this.labelPlacement(),
      this.checkedState() ? 'bui-checkbox-v2--checked' : '',
      this.isIndeterminate() ? 'bui-checkbox-v2--indeterminate' : '',
      selected ? 'bui-checkbox-v2--selected' : '',
      this.error() ? 'bui-checkbox-v2--error' : '',
      this.disabled() ? 'bui-checkbox-v2--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  private readonly tickColor = linkedSignal<string>(() => '#fff');

  protected readonly markBg = computed(() => {
    if (!this.checkedState() && !this.isIndeterminate()) return 'none';
    return this.isIndeterminate() ? indeterminateSvg(this.tickColor()) : checkSvg(this.tickColor());
  });

  constructor() {
    afterNextRender(() => {
      const cs = getComputedStyle(this.host.nativeElement as HTMLElement);
      this.tickColor.set(cs.getPropertyValue('--bw-content-inverse-primary').trim() || '#fff');
      if (this.autoFocus()) this.inputRef()?.nativeElement.focus();
    });
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

  protected onLabelClick(e: Event): void {
    if (this.containsInteractiveElement()) e.preventDefault();
  }
}
