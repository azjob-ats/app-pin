import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { EffectListCardMedia } from './effect-list-cards.interface';

const CARD_WIDTH = 280;
const THRESHOLD = CARD_WIDTH * 0.5;
const MAX_VISIBLE = 4;

@Component({
  selector: 'app-effect-list-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './effect-list-cards.component.html',
  styleUrl: './effect-list-cards.component.scss',
})
export class EffectListCardsComponent implements OnDestroy {
  readonly media = input.required<EffectListCardMedia>();

  private readonly containerRef = viewChild<ElementRef<HTMLElement>>('container');

  readonly activeIndex = signal(0);
  readonly dragX = signal(0);
  readonly isDragging = signal(false);
  readonly isAnimating = signal(false);

  private startX = 0;
  private startY = 0;
  private isHorizontalDrag: boolean | null = null;

  private boundOnPointerMove = this.onPointerMove.bind(this);
  private boundOnPointerUp = this.onPointerUp.bind(this);

  readonly items = computed(() => this.media().items);
  readonly totalItems = computed(() => this.items().length);

  getCardTransform(visualIndex: number): string {
    const dx = this.dragX();
    const dragging = this.isDragging();
    const total = this.totalItems();

    if (total === 0) return '';

    if (visualIndex === 0) {
      const rotation = dragging ? (dx / CARD_WIDTH) * 8 : 0;
      return `translate3d(${dx}px, 0, 0) rotate(${rotation}deg)`;
    }

    const baseX = visualIndex * 8;

    const dragProgress = Math.abs(dx) / THRESHOLD;
    const advanceFactor = Math.min(dragProgress, 1);

    const translateX = baseX - 8 * advanceFactor;

    return `translate3d(${translateX}px, 0, 0)`;
  }

  getCardZIndex(visualIndex: number): number {
    return MAX_VISIBLE - visualIndex;
  }

  getCardOpacity(visualIndex: number): number {
    if (visualIndex >= MAX_VISIBLE) return 0;
    if (visualIndex === 0 && this.isAnimating()) return 1;
    return 1;
  }

  getCardTransition(visualIndex: number): string {
    if (this.isDragging()) return 'none';
    if (visualIndex === 0 && this.isAnimating()) {
      return 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
    }
    return 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }

  getVisualIndex(itemIndex: number): number {
    const active = this.activeIndex();
    const total = this.totalItems();
    if (total === 0) return itemIndex;
    return (itemIndex - active + total) % total;
  }

  goToCard(index: number): void {
    if (this.isAnimating() || index === this.activeIndex()) return;
    this.isAnimating.set(true);
    this.dragX.set(0);
    this.activeIndex.set(index);
    setTimeout(() => this.isAnimating.set(false), 500);
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isAnimating()) return;
    event.preventDefault();

    this.isDragging.set(true);
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isHorizontalDrag = null;
    this.dragX.set(0);

    document.addEventListener('pointermove', this.boundOnPointerMove);
    document.addEventListener('pointerup', this.boundOnPointerUp);
  }

  private onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    if (this.isHorizontalDrag === null) {
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        this.isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
        if (!this.isHorizontalDrag) {
          this.finishDrag();
          return;
        }
      } else {
        return;
      }
    }

    const clamped = Math.max(-THRESHOLD, Math.min(THRESHOLD, deltaX));
    this.dragX.set(clamped);
  }

  private onPointerUp(): void {
    if (!this.isDragging()) return;

    const dx = this.dragX();
    const absDx = Math.abs(dx);

    if (absDx >= THRESHOLD) {
      this.cycleCard();
    } else {
      this.snapBack();
    }

    this.finishDrag();
  }

  private cycleCard(): void {
    const total = this.totalItems();
    if (total <= 1) {
      this.snapBack();
      return;
    }

    this.isAnimating.set(true);
    this.dragX.set(0);
    this.activeIndex.update((i) => (i + 1) % total);

    setTimeout(() => {
      this.isAnimating.set(false);
    }, 500);
  }

  private snapBack(): void {
    this.isAnimating.set(true);
    this.dragX.set(0);

    setTimeout(() => {
      this.isAnimating.set(false);
    }, 500);
  }

  private finishDrag(): void {
    this.isDragging.set(false);
    this.isHorizontalDrag = null;
    document.removeEventListener('pointermove', this.boundOnPointerMove);
    document.removeEventListener('pointerup', this.boundOnPointerUp);
  }

  ngOnDestroy(): void {
    this.finishDrag();
  }
}
