import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { BUI_BTN_GRP } from '../button-group/button-group.token';
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
  /** Rótulo acessível (obrigatório p/ botões só-ícone; no loading, fallback "content is loading"). */
  readonly ariaLabel = input<string | null>(null);

  /** aria-label resolvido: no loading garante nome acessível (conteúdo fica oculto). */
  protected readonly resolvedAriaLabel = computed(() =>
    this.isLoading() ? (this.ariaLabel() ?? 'content is loading') : this.ariaLabel(),
  );

  readonly buttonClick = output<MouseEvent>();

  // --- Group context (optional — injected when inside bui-button-group) ---
  protected readonly _group = inject(BUI_BTN_GRP, { optional: true });
  protected readonly _groupIdx: number = this._group?.registerChild() ?? -1;

  protected readonly grpKind = computed(() => (this._group?.kind() as Kind | undefined) ?? this.kind());
  protected readonly grpSize = computed(() => (this._group?.size() as Size | undefined) ?? this.size());
  protected readonly grpShape = computed(() => (this._group?.shape() as Shape | undefined) ?? this.shape());
  protected readonly grpDisabled = computed(() => (this._group?.disabled() ?? false) || this.disabled());
  protected readonly grpIsSelected = computed(() => {
    const grp = this._group;
    if (!grp) return this.isSelected();
    const sel = grp.effectiveSelected();
    const idx = this._groupIdx;
    if (sel === undefined) return false;
    if (Array.isArray(sel)) return sel.includes(idx);
    return sel === idx;
  });

  /** Normaliza aliases novos do Base Web (xSmall→mini, small→compact, medium→default). */
  protected readonly normSize = computed<'mini' | 'compact' | 'default' | 'large'>(() => {
    switch (this.grpSize()) {
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
    switch (this.grpShape()) {
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
      `bui-button bui-button--${this.grpKind()} bui-button--size-${this.normSize()} bui-button--shape-${this.normShape()}` +
      (this.isIconShape() ? ' bui-button--icon' : '') +
      (this.backgroundSafe() ? ' bui-button--bg-safe' : '') +
      (this.minHitArea() ? ` bui-button--hit-${this.minHitArea()}` : ''),
  );

  protected readonly inactive = computed(() => this.grpDisabled() || this.isLoading());

  protected onClick(event: MouseEvent): void {
    if (this.inactive()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this._group?.onChildClick(this._groupIdx);
    this.buttonClick.emit(event);
  }
}
