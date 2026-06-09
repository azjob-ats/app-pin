import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type PopoverPlacement =
  | 'auto' | 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom';
export type PopoverTrigger = 'click' | 'hover';

const MARGIN = 8; // POPOVER_MARGIN

/** Mapeia placement do Base Web → posições conectadas do CDK. */
function toPositions(placement: PopoverPlacement): ConnectedPosition[] {
  const P: Record<string, ConnectedPosition> = {
    bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: MARGIN },
    bottomLeft: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: MARGIN },
    bottomRight: { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: MARGIN },
    top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -MARGIN },
    topLeft: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -MARGIN },
    topRight: { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -MARGIN },
    left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -MARGIN },
    leftTop: { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -MARGIN },
    leftBottom: { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -MARGIN },
    right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: MARGIN },
    rightTop: { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: MARGIN },
    rightBottom: { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: MARGIN },
  };
  if (placement === 'auto') return [P['bottom'], P['top'], P['right'], P['left']];
  return [P[placement] ?? P['bottom'], P['bottom'], P['top']];
}

/**
 * Popover — clone do `baseui/popover`. Camada de overlay posicionada via **Angular CDK**
 * (`CdkConnectedOverlay` substitui Layer/TetherBehavior do popper). Trigger projetado
 * (default), conteúdo em `[buiPopoverContent]`. `triggerType` click/hover, `placement`,
 * `isOpen` (controlado) ou stateful. Body com bg `backgroundTertiary`, radius e shadow600.
 */
@Component({
  selector: 'bui-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule],
  styleUrl: './popover.component.scss',
  template: `
    <span
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      class="bui-popover__trigger"
      (click)="onClick()"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <ng-content />
    </span>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions()"
      [cdkConnectedOverlayHasBackdrop]="false"
      cdkConnectedOverlayPanelClass="bw-root"
      (overlayOutsideClick)="onOutsideClick($event)"
    >
      <div class="bui-popover__body bui-popover__body--open" data-baseweb="popover" role="tooltip" (mouseenter)="onEnter()" (mouseleave)="onLeave()">
        <div class="bui-popover__inner"><ng-content select="[buiPopoverContent]" /></div>
      </div>
    </ng-template>
  `,
})
export class BuiPopover {
  readonly isOpen = input<boolean | undefined>(undefined);
  readonly triggerType = input<PopoverTrigger>('click');
  readonly placement = input<PopoverPlacement>('auto');
  readonly isOpenChange = output<boolean>();

  private readonly internalOpen = signal(false);
  protected readonly open = computed(() => this.isOpen() ?? this.internalOpen());
  protected readonly positions = computed(() => toPositions(this.placement()));

  protected onClick(): void {
    if (this.triggerType() !== 'click' || this.isOpen() !== undefined) return;
    this.internalOpen.update((o) => !o);
    this.isOpenChange.emit(this.internalOpen());
  }
  protected onEnter(): void {
    if (this.triggerType() !== 'hover' || this.isOpen() !== undefined) return;
    this.internalOpen.set(true);
    this.isOpenChange.emit(true);
  }
  protected onLeave(): void {
    if (this.triggerType() !== 'hover' || this.isOpen() !== undefined) return;
    this.internalOpen.set(false);
    this.isOpenChange.emit(false);
  }
  protected onOutsideClick(_e: MouseEvent): void {
    if (this.triggerType() === 'click' && this.isOpen() === undefined) {
      this.internalOpen.set(false);
      this.isOpenChange.emit(false);
    }
  }
}
