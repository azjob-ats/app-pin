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
export type AccessibilityType = 'tooltip' | 'menu' | 'none';

/** Mapeia placement do Base Web → posições conectadas do CDK. */
function toPositions(placement: PopoverPlacement, margin: number): ConnectedPosition[] {
  const P: Record<string, ConnectedPosition> = {
    bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: margin },
    bottomLeft: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: margin },
    bottomRight: { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: margin },
    top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -margin },
    topLeft: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -margin },
    topRight: { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -margin },
    left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -margin },
    leftTop: { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -margin },
    leftBottom: { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -margin },
    right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: margin },
    rightTop: { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: margin },
    rightBottom: { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: margin },
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
      [cdkConnectedOverlayOpen]="overlayOpen()"
      [cdkConnectedOverlayPositions]="positions()"
      [cdkConnectedOverlayHasBackdrop]="false"
      cdkConnectedOverlayPanelClass="bw-root"
      (overlayOutsideClick)="onOutsideClick($event)"
    >
      <div
        class="bui-popover__body bui-popover__body--open"
        data-baseweb="popover"
        [attr.role]="accessibilityType() === 'none' ? null : (accessibilityType() === 'menu' ? 'menu' : 'tooltip')"
        [style.visibility]="renderAll() && !open() ? 'hidden' : null"
        (mouseenter)="onEnter()"
        (mouseleave)="onLeave()"
      >
        <div class="bui-popover__inner"><ng-content select="[buiPopoverContent]" /></div>
      </div>
    </ng-template>
  `,
})
export class BuiPopover {
  readonly isOpen = input<boolean | undefined>(undefined);
  readonly triggerType = input<PopoverTrigger>('click');
  readonly placement = input<PopoverPlacement>('auto');
  readonly popoverMargin = input(8);
  readonly renderAll = input(false, { transform: booleanAttribute });
  readonly showArrow = input(false, { transform: booleanAttribute });
  readonly accessibilityType = input<AccessibilityType>('tooltip');
  readonly isOpenChange = output<boolean>();

  private readonly internalOpen = signal(false);
  protected readonly open = computed(() => this.isOpen() ?? this.internalOpen());
  protected readonly overlayOpen = computed(() => this.renderAll() || this.open());
  protected readonly positions = computed(() => toPositions(this.placement(), this.popoverMargin()));

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
