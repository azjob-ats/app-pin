import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
  ViewEncapsulation,
  booleanAttribute,
  input,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

export type TooltipPlacement =
  | 'auto'
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right';

function toPositions(placement: TooltipPlacement, margin: number): ConnectedPosition[] {
  const m = margin;
  const P: Record<string, ConnectedPosition> = {
    bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: m },
    bottomLeft: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: m },
    bottomRight: { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: m },
    top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -m },
    topLeft: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -m },
    topRight: { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -m },
    left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -m },
    right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: m },
  };
  if (placement === 'auto') return [P['bottom'], P['top'], P['right'], P['left']];
  return [P[placement] ?? P['bottom'], P['bottom'], P['top']];
}

@Component({
  selector: 'bui-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule, NgComponentOutlet],
  styleUrl: './tooltip.component.scss',
  template: `
    <span
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      class="bui-tooltip__trigger"
      [attr.aria-describedby]="open() ? tooltipId : null"
      (mouseenter)="open.set(true)"
      (mouseleave)="open.set(false)"
      (focus)="open.set(true)"
      (blur)="open.set(false)"
    >
      <ng-content />
    </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="false"
      cdkConnectedOverlayPanelClass="bw-root"
    >
      <div
        class="bui-tooltip__body"
        [class.bui-tooltip__body--arrow]="showArrow()"
        [id]="tooltipId"
        role="tooltip"
        data-baseweb="tooltip"
      >
        @if (contentComponent()) {
          <ng-container *ngComponentOutlet="contentComponent()!" />
        } @else {
          {{ content() }}
        }
      </div>
    </ng-template>
  `,
})
export class BuiTooltip {
  readonly content = input<string>('');
  readonly contentComponent = input<Type<unknown> | undefined>(undefined);
  readonly placement = input<TooltipPlacement>('auto');
  readonly showArrow = input(false, { transform: booleanAttribute });
  readonly popoverMargin = input(8);

  protected readonly open = signal(false);
  protected readonly tooltipId = `bui-tooltip-${Math.random().toString(36).slice(2)}`;

  protected get positions(): ConnectedPosition[] {
    return toPositions(this.placement(), this.popoverMargin());
  }
}

// BuiStatefulTooltip is an alias — tooltip always manages its own open state
export { BuiTooltip as BuiStatefulTooltip };
