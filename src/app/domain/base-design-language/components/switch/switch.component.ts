import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';

export type SwitchSize = 'default' | 'small';
export type SwitchLabelPlacement = 'left' | 'right';

/** Checkmark do toggle (showIcon), com a cor `contentPrimary` resolvida em runtime. */
function checkmark(color: string, size: number): string {
  const svg = encodeURIComponent(`
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m8.5 19.84-6.56-6.56 2.12-2.12L8.5 15.6 19.94 4.16l2.12 2.12L8.5 19.84Z" fill="${color}"/>
    </svg>
  `);
  return `url('data:image/svg+xml,${svg}')`;
}

/**
 * Switch — clone fiel do `baseui/switch`. `<label>` com trilho + knob + `<input
 * type=checkbox role=switch>` oculto. Alterna ao clicar (controlado via `checked`/
 * `checkedChange` ou stateful). `size` (default/small), `labelPlacement`, `showIcon`
 * (checkmark quando ligado), `disabled`. Hover/foco via CSS (`:hover`/`:has(:focus-visible)`).
 */
@Component({
  selector: 'label[buiSwitch]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './switch.component.scss',
  template: `
    <div class="bui-switch__track">
      <div class="bui-switch__toggle" [style.background-image]="iconBg()"></div>
    </div>
    <input
      #input
      class="bui-switch__input"
      type="checkbox"
      role="switch"
      [checked]="checkedState()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      (change)="onToggle($event)"
      (click)="$event.stopPropagation()"
    />
    <div class="bui-switch__label"><ng-content /></div>
  `,
  host: {
    'data-baseweb': 'switch',
    '[class]':
      "'bui-switch bui-switch--' + size() + (checkedState() ? ' bui-switch--checked' : '') + (disabled() ? ' bui-switch--disabled' : '') + (labelPlacement() === 'left' ? ' bui-switch--left' : '')",
  },
})
export class Switch {
  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<SwitchSize>('default');
  readonly labelPlacement = input<SwitchLabelPlacement>('right');
  readonly showIcon = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly checkedChange = output<boolean>();

  /** Estado interno (segue `checked`; alterável p/ uso stateful). */
  protected readonly checkedState = linkedSignal(() => this.checked());
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly host = inject(ElementRef);
  private readonly contentPrimary = computed(() => this.colorSig());
  private readonly colorSig = linkedSignal<string>(() => '#000');

  protected readonly iconBg = computed(() =>
    this.showIcon() && this.checkedState() ? checkmark(this.contentPrimary(), this.size() === 'small' ? 12 : 16) : 'none',
  );

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;
      this.colorSig.set(getComputedStyle(el).getPropertyValue('--bw-content-primary').trim() || '#000');
      if (this.autoFocus()) this.input().nativeElement.focus();
    });
  }

  protected onToggle(e: Event): void {
    const v = (e.target as HTMLInputElement).checked;
    this.checkedState.set(v);
    this.checkedChange.emit(v);
  }
}
