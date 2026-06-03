import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { Kind, Shape, Size } from './button.model';

/**
 * Button — clone fiel do `baseui/button`. API pública preservada (kind/size/shape/
 * isLoading/isSelected/disabled, enhancers). Estilo via tokens `--bw-*`; nada de Styletron.
 * Seletor `bui-button`; classe `Button`.
 */
@Component({
  selector: 'bui-button',
  exportAs: 'buiButton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    class: 'bui-button-host',
    '[class.bui-button-host--block]': 'block()',
  },
})
export class Button {
  readonly kind = input<Kind>('primary');
  readonly size = input<Size>('default');
  readonly shape = input<Shape>('default');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly isLoading = input(false);
  readonly isSelected = input(false);
  /** Ocupa 100% da largura (Base Web WIDTH_TYPE=fill). */
  readonly block = input(false);
  /** Quando definido, renderiza como âncora (Base Web $as="a"). */
  readonly href = input<string | null>(null);
  /** Cores customizadas (Base Web prop `colors`). */
  readonly colors = input<{ backgroundColor?: string; color?: string } | null>(null);
  /** Sombra sutil para uso sobre fundos coloridos (Base Web `backgroundSafe`). */
  readonly backgroundSafe = input(false);
  /** Área mínima de toque (Base Web MIN_HIT_AREA: tap=48px, click=28px). */
  readonly minHitArea = input<'tap' | 'click' | null>(null);

  readonly buttonClick = output<MouseEvent>();

  /** Normaliza aliases novos do Base Web (xSmall→mini, small→compact, medium→default). */
  protected readonly normSize = computed<'mini' | 'compact' | 'default' | 'large'>(() => {
    switch (this.size()) {
      case 'xSmall':
      case 'mini':
        return 'mini';
      case 'small':
      case 'compact':
        return 'compact';
      case 'large':
        return 'large';
      default:
        return 'default';
    }
  });

  /** Normaliza shape (rectangular→default, rounded→pill). */
  protected readonly normShape = computed<'default' | 'pill' | 'round' | 'circle' | 'square'>(() => {
    switch (this.shape()) {
      case 'rectangular':
        return 'default';
      case 'rounded':
      case 'pill':
        return 'pill';
      case 'round':
        return 'round';
      case 'circle':
        return 'circle';
      case 'square':
        return 'square';
      default:
        return 'default';
    }
  });

  protected readonly isIconShape = computed(
    () => ['round', 'circle', 'square'].includes(this.normShape()),
  );

  protected readonly classes = computed(
    () =>
      `bui-button bui-button--${this.kind()} bui-button--size-${this.normSize()} bui-button--shape-${this.normShape()}` +
      (this.isIconShape() ? ' bui-button--icon' : '') +
      (this.backgroundSafe() ? ' bui-button--bg-safe' : '') +
      (this.minHitArea() ? ` bui-button--hit-${this.minHitArea()}` : ''),
  );

  protected readonly inactive = computed(() => this.disabled() || this.isLoading());

  protected onClick(event: MouseEvent): void {
    if (this.inactive()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.buttonClick.emit(event);
  }
}
