import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { BuiArrowRight, BuiCheck } from '../icon/icon.component';

export type SlidingButtonThreshold = 'low' | 'high';

const BUTTON_SIZE = 56; // GRABBER_ICON_SIZE(24) + PADDING(16)*2
const TAP_OFFSET = 16;
const THRESHOLD_VALUES: Record<SlidingButtonThreshold, number> = { low: 0.2, high: 0.8 };

/**
 * Sliding button — clone fiel de `baseui/sliding-button` ("slide to confirm"). Track (56px de
 * altura) com label centralizado e um grabber preto (56×56, seta) à esquerda; arrastar o grabber
 * para a direita expande o slider e, ao passar do `threshold` (high 0.8 / low 0.2), conclui
 * (slider 100%, label de conclusão + check, `complete`). `isLoading` mostra overlay + spinner;
 * `isDisabled` desabilita. **Independência Angular:** o drag (react usa estado + listeners de
 * document) foi reimplementado com **Pointer Events** + `setPointerCapture`. Teclado: Enter/Espaço
 * conclui. `slideBackAfterMs` volta sozinho. Nenhum token novo.
 */
@Component({
  selector: 'bui-sliding-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiArrowRight, BuiCheck],
  styleUrl: './sliding-button.component.scss',
  template: `
    <div #track class="bui-sliding-button__track" [class.bui-sliding-button__track--disabled]="isDisabled()">
      @if (isLoading()) {
        <div class="bui-sliding-button__loading"><div class="bui-sliding-button__spinner"></div></div>
      } @else {
        <div
          class="bui-sliding-button__label"
          [class.bui-sliding-button__label--muted]="isDisabled() || isActuallySliding()"
          [class.bui-sliding-button__label--completed]="isCompleted()"
        >
          {{ label() }}
        </div>
        <div
          class="bui-sliding-button__slider"
          [class.bui-sliding-button__slider--completed]="isCompleted()"
          [style.width]="sliderWidth()"
          [style.transition]="sliderTransition()"
        >
          @if (isCompleted()) {
            <div class="bui-sliding-button__completed-label">{{ label() }}</div>
          }
          <div
            class="bui-sliding-button__grabber"
            data-baseweb="sliding-button-grabber"
            (pointerdown)="onPointerDown($event)"
            (pointermove)="onPointerMove($event)"
            (pointerup)="resetDrag()"
            (pointercancel)="resetDrag()"
          >
            @if (isCompleted()) {
              <bui-check size="24" title="" />
            } @else {
              <bui-arrow-right size="24" title="" />
            }
          </div>
        </div>
      }
    </div>
  `,
  host: {
    'data-baseweb': 'sliding-button',
    class: 'bui-sliding-button',
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-busy]': 'isLoading() || null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class BuiSlidingButton {
  readonly label = input<string>('');
  readonly threshold = input<SlidingButtonThreshold>('high');
  readonly isLoading = input(false, { transform: booleanAttribute });
  readonly isDisabled = input(false, { transform: booleanAttribute });
  readonly slideBackAfterMs = input<number>();
  readonly complete = output<void>();

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected readonly isDragging = signal(false);
  protected readonly dragOffset = signal(0);
  protected readonly isCompleted = signal(false);
  private dragStart = 0;
  private slideBackTimer: ReturnType<typeof setTimeout> | undefined;

  private readonly isInteractive = computed(() => !this.isDisabled() && !this.isLoading() && !this.isCompleted());
  protected readonly isActuallySliding = computed(() => this.isDragging() && this.dragOffset() > TAP_OFFSET);
  protected readonly sliderWidth = computed(() => (this.isCompleted() ? '100%' : `${BUTTON_SIZE + this.dragOffset()}px`));
  protected readonly sliderTransition = computed(() =>
    this.isDragging() && this.dragOffset() !== TAP_OFFSET ? 'none' : 'width 200ms ease-out',
  );

  protected onPointerDown(e: PointerEvent): void {
    if (!this.isInteractive()) return;
    this.isDragging.set(true);
    this.dragOffset.set(TAP_OFFSET);
    this.dragStart = e.clientX - TAP_OFFSET;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  protected onPointerMove(e: PointerEvent): void {
    if (!this.isDragging() || this.isCompleted()) return;
    const delta = e.clientX - this.dragStart;
    if (delta <= 0) return;
    const containerWidth = this.track().nativeElement.offsetWidth;
    const maxOffset = containerWidth - BUTTON_SIZE;
    const thresholdPixels = containerWidth * THRESHOLD_VALUES[this.threshold()];
    if (delta > thresholdPixels) {
      this.dragOffset.set(maxOffset);
      this.isDragging.set(false);
      this.setCompleted();
    } else {
      this.dragOffset.set(Math.min(delta, maxOffset));
    }
  }

  protected resetDrag(): void {
    this.isDragging.set(false);
    if (!this.isCompleted()) this.dragOffset.set(0);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (!this.isInteractive()) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.setCompleted();
    }
  }

  private setCompleted(): void {
    this.isCompleted.set(true);
    this.complete.emit();
    const ms = this.slideBackAfterMs();
    if (ms != null && ms > 0) {
      clearTimeout(this.slideBackTimer);
      this.slideBackTimer = setTimeout(() => {
        this.isCompleted.set(false);
        this.dragOffset.set(0);
      }, ms);
    }
  }
}
