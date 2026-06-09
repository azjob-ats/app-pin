import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';

export type BadgePlacement =
  | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
  | 'topLeftEdge' | 'topEdge' | 'topRightEdge'
  | 'bottomRightEdge' | 'bottomEdge' | 'bottomLeftEdge'
  | 'leftTopEdge' | 'rightTopEdge' | 'rightBottomEdge' | 'leftBottomEdge';
export type BadgeColor = 'accent' | 'primary' | 'positive' | 'negative' | 'warning';
export type BadgeShape = 'pill' | 'rectangle';
export type BadgeHierarchy = 'primary' | 'secondary';
type BadgeRole = 'badge' | 'notificationCircle' | 'hintDot';

interface Pos {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}

/** POSITION_STYLES[badge] — espelha styled-components.ts. */
const BADGE_POS: Record<BadgePlacement, Pos> = {
  topEdge: { top: '-8px', left: '50%', transform: 'translateX(-50%)' },
  bottomEdge: { bottom: '-8px', left: '50%', transform: 'translateX(-50%)' },
  topLeft: { top: '16px', left: '16px' },
  topRight: { top: '16px', right: '16px' },
  bottomRight: { bottom: '16px', right: '16px' },
  bottomLeft: { bottom: '16px', left: '16px' },
  topLeftEdge: { top: '-8px', left: '16px' },
  topRightEdge: { top: '-8px', right: '16px' },
  bottomRightEdge: { bottom: '-8px', right: '16px' },
  bottomLeftEdge: { bottom: '-8px', left: '16px' },
  leftTopEdge: { top: '16px', left: '-8px' },
  rightTopEdge: { top: '16px', right: '-8px' },
  rightBottomEdge: { bottom: '16px', right: '-8px' },
  leftBottomEdge: { bottom: '16px', left: '-8px' },
};

const TOP_PLACEMENTS = new Set<BadgePlacement>(['topLeft', 'topRight', 'topLeftEdge', 'topEdge', 'topRightEdge', 'leftTopEdge', 'rightTopEdge']);
const BOTTOM_PLACEMENTS = new Set<BadgePlacement>(['bottomLeft', 'bottomRight', 'bottomLeftEdge', 'bottomEdge', 'bottomRightEdge', 'leftBottomEdge', 'rightBottomEdge']);
const LEFT_PLACEMENTS = new Set<BadgePlacement>(['topLeft', 'topLeftEdge', 'topEdge', 'bottomLeft', 'bottomLeftEdge', 'bottomEdge', 'leftTopEdge', 'leftBottomEdge']);
const RIGHT_PLACEMENTS = new Set<BadgePlacement>(['topRight', 'topRightEdge', 'bottomRight', 'bottomRightEdge', 'rightTopEdge', 'rightBottomEdge']);

/** Calcula o estilo de posição do Positioner (top/bottom/left/right/transform). */
function positionStyle(role: BadgeRole, placement: BadgePlacement, h?: string | null, v?: string | null): Record<string, string> {
  let pos: Pos;
  if (role === 'badge') {
    pos = { ...BADGE_POS[placement] };
  } else {
    // NotificationCircle/HintDot: só topLeft tem variante; demais caem p/ topRight default
    const px = role === 'notificationCircle' ? '-10px' : '-4px';
    pos = placement === 'topLeft' ? { top: px, left: px } : { top: px, right: px };
  }
  if (v) {
    if (TOP_PLACEMENTS.has(placement)) pos.top = v;
    if (BOTTOM_PLACEMENTS.has(placement)) pos.bottom = v;
  }
  if (h) {
    if (LEFT_PLACEMENTS.has(placement)) pos.left = h;
    if (RIGHT_PLACEMENTS.has(placement)) pos.right = h;
  }
  const out: Record<string, string> = {};
  if (pos.top != null) out['top'] = pos.top;
  if (pos.bottom != null) out['bottom'] = pos.bottom;
  if (pos.left != null) out['left'] = pos.left;
  if (pos.right != null) out['right'] = pos.right;
  if (pos.transform != null) out['transform'] = pos.transform;
  return out;
}

/**
 * Badge — clone fiel de `baseui/badge`. Chip retangular/pill com 5 cores × 2 hierarquias.
 * **Inline** (sem âncora projetada) renderiza só o chip; **anexado** (com conteúdo projetado)
 * embrulha a âncora num Root relativo + Positioner absoluto posicionado por `placement`
 * (+ `horizontalOffset`/`verticalOffset`). Modo inline/anexado detectado por CSS (`:has`).
 */
@Component({
  selector: 'bui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './badge.component.scss',
  template: `
    <span class="bui-badge__anchor"><ng-content /></span>
    <div class="bui-badge__positioner" [style]="posStyle()">
      <div class="bui-badge__chip" [class]="chipClass()" [class.bui-badge--hidden]="hidden()">
        {{ content() }}<ng-content select="[badgeContent]" />
      </div>
    </div>
  `,
  host: { 'data-baseweb': 'badge', class: 'bui-badge' },
})
export class BuiBadge {
  readonly content = input<string>('');
  readonly color = input<BadgeColor>('accent');
  readonly shape = input<BadgeShape>('rectangle');
  readonly placement = input<BadgePlacement>('topRight');
  readonly hierarchy = input<BadgeHierarchy>('primary');
  readonly horizontalOffset = input<string>();
  readonly verticalOffset = input<string>();
  readonly hidden = input(false, { transform: booleanAttribute });

  protected readonly chipClass = computed(
    () => `bui-badge__chip--${this.shape()} bui-badge-c--${this.hierarchy()}-${this.color()}`,
  );
  protected readonly posStyle = computed(() =>
    positionStyle('badge', this.placement(), this.horizontalOffset(), this.verticalOffset()),
  );
}

/**
 * NotificationCircle — clone de `baseui/badge/NotificationCircle`. Círculo 20×20 com número
 * (>9 → "9+") ou ícone projetado (`[badgeContent]`). Inline ou anexado (topLeft/topRight).
 */
@Component({
  selector: 'bui-notification-circle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './badge.component.scss',
  template: `
    <span class="bui-badge__anchor"><ng-content /></span>
    <div class="bui-badge__positioner" [style]="posStyle()">
      <div class="bui-badge__circle bui-badge-c--primary-{{ color() }}" [class.bui-badge--hidden]="hidden()">
        {{ display() }}<ng-content select="[badgeContent]" />
      </div>
    </div>
  `,
  host: { 'data-baseweb': 'notification-circle', class: 'bui-badge' },
})
export class BuiNotificationCircle {
  readonly content = input<number | string>();
  readonly color = input<BadgeColor>('accent');
  readonly placement = input<BadgePlacement>('topRight');
  readonly horizontalOffset = input<string>();
  readonly verticalOffset = input<string>();
  readonly hidden = input(false, { transform: booleanAttribute });

  protected readonly display = computed(() => {
    const c = this.content();
    return typeof c === 'number' && c > 9 ? '9+' : (c ?? '');
  });
  protected readonly posStyle = computed(() =>
    positionStyle('notificationCircle', this.placement(), this.horizontalOffset(), this.verticalOffset()),
  );
}

/**
 * HintDot — clone de `baseui/badge/HintDot`. Ponto 8px (+ borda 4px backgroundPrimary) anexado
 * topRight. Âncora textual ganha offsets default (-14px/-4px). Sempre anexado.
 */
@Component({
  selector: 'bui-hint-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './badge.component.scss',
  template: `
    <span class="bui-badge__anchor"><ng-content /></span>
    <div class="bui-badge__positioner" [style]="posStyle()">
      <div class="bui-badge__dot bui-badge-c--primary-{{ color() }}" [class.bui-badge--hidden]="hidden()"></div>
    </div>
  `,
  host: { 'data-baseweb': 'hint-dot', class: 'bui-badge' },
})
export class BuiHintDot {
  readonly color = input<BadgeColor>('accent');
  readonly horizontalOffset = input<string>();
  readonly verticalOffset = input<string>();
  /** Quando a âncora é texto puro, o original aplica offsets default (-14px/-4px). */
  readonly stringAnchor = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });

  protected readonly posStyle = computed(() => {
    const h = this.horizontalOffset() ?? (this.stringAnchor() ? '-14px' : undefined);
    const v = this.verticalOffset() ?? (this.stringAnchor() ? '-4px' : undefined);
    return positionStyle('hintDot', 'topRight', h, v);
  });
}
