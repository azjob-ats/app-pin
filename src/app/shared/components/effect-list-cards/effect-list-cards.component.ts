import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  untracked,
  inject,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { VideoSinglePlaybackService } from '@shared/services/video-single-playback.service';
import { EffectListCardMedia } from './effect-list-cards.interface';

const CARD_WIDTH = 280;
const MAX_DRAG = CARD_WIDTH * 0.85;
const THRESHOLD = CARD_WIDTH * 0.35;
const VELOCITY_THRESHOLD = 0.4;
const MAX_VISIBLE = 4;
const ANIMATION_MS = 300;

@Component({
  selector: 'app-effect-list-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './effect-list-cards.component.html',
  styleUrl: './effect-list-cards.component.scss',
})
export class EffectListCardsComponent implements OnDestroy {
  readonly media = input.required<EffectListCardMedia>();
  readonly titleClick = output<string>();

  readonly activeIndex = signal(0);
  readonly dragX = signal(0);
  readonly isDragging = signal(false);
  readonly isAnimating = signal(false);

  readonly isVideoLoaded = signal(false);
  readonly isPlaying = signal(false);
  readonly isMuted = signal(false);
  readonly volume = signal(0.5);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly isScrubbing = signal(false);
  readonly tooltipTime = signal(0);
  readonly tooltipLeft = signal(0);
  readonly showTooltip = signal(false);
  readonly controlsVisible = signal(true);

  readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

  private readonly playback = inject(VideoSinglePlaybackService);

  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private isHorizontalDrag: boolean | null = null;

  private scrubWasPlaying = false;
  private rafId: number | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private suppressNextClick = false;
  private dragOccurred = false;

  private boundOnPointerMove = this.onPointerMove.bind(this);
  private boundOnPointerUp = this.onPointerUp.bind(this);

  readonly items = computed(() => this.media().items);
  readonly totalItems = computed(() => this.items().length);
  readonly activeItem = computed(() => this.items()[this.activeIndex()]);
  readonly activeItemId = computed(() => this.activeItem()?.postId ?? '');

  readonly volumeIcon = computed(() => (this.isMuted() ? 'volume_off' : 'volume_up'));

  readonly progressPercent = computed(() => {
    const d = this.duration();
    return d ? (this.currentTime() / d) * 100 : 0;
  });

  constructor() {
    effect(() => {
      const activeId = this.playback.activeId();
      untracked(() => {
        if (activeId !== this.activeItemId() && this.isPlaying()) {
          this.pauseVideo();
        }
      });
    });

    effect(() => {
      this.activeIndex();
      untracked(() => this.resetVideoState());
    });
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onTitleClick(): void {
    const item = this.activeItem();
    if (item) {
      this.titleClick.emit(item.postId);
    }
  }

  onThumbnailPlayClick(event: Event): void {
    event.stopPropagation();
    if (!this.activeItem()?.short) return;
    this.isVideoLoaded.set(true);
  }

  onThumbnailPlayPointerDown(event: Event): void {
    event.stopPropagation();
  }

  onVideoLoadedMetadata(): void {
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    this.duration.set(video.duration);
    video.volume = this.volume();
    video.muted = this.isMuted();
  }

  onVideoCanPlay(): void {
    const video = this.videoRef()?.nativeElement;
    if (!video || !video.paused) return;
    video.play().catch(() => {
      video.muted = true;
      this.isMuted.set(true);
      video.play().catch(() => {});
    });
  }

  onVideoPlay(): void {
    this.playback.setActive(this.activeItemId());
    this.isPlaying.set(true);
    this.startRaf();
    this.scheduleHide();
  }

  onVideoPause(): void {
    this.isPlaying.set(false);
    this.stopRaf();
    this.clearHideTimer();
    this.controlsVisible.set(true);
  }

  onVideoEnded(): void {
    this.playback.clearActive(this.activeItemId());
    this.isPlaying.set(false);
    this.stopRaf();
    this.clearHideTimer();
    this.controlsVisible.set(true);
  }

  togglePlayPause(event: Event): void {
    event.stopPropagation();
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    if (this.isPlaying()) {
      this.pauseVideo();
    } else {
      this.playback.setActive(this.activeItemId());
      video.play().catch(() => {});
    }
  }

  toggleMute(event: Event): void {
    event.stopPropagation();
    const next = !this.isMuted();
    this.isMuted.set(next);
    const video = this.videoRef()?.nativeElement;
    if (video) video.muted = next;
  }

  onOverlayTouchStart(event: TouchEvent): void {
    if (!this.controlsVisible()) {
      event.stopPropagation();
      this.suppressNextClick = true;
      this.showControls();
    }
  }

  onOverlayInteract(event: Event): void {
    event.stopPropagation();
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }
    if (this.dragOccurred) {
      this.dragOccurred = false;
      return;
    }
    if (!this.controlsVisible()) {
      this.showControls();
    }
  }

  onOverlayMouseMove(): void {
    this.showControls();
  }

  onProgressClick(event: MouseEvent): void {
    event.stopPropagation();
    this.seekToEvent(event);
  }

  onProgressMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isScrubbing.set(true);
    this.scrubWasPlaying = this.isPlaying();
    const video = this.videoRef()?.nativeElement;
    if (video && this.isPlaying()) {
      video.pause();
    }
    this.seekToEvent(event);
  }

  onProgressMouseUp(event: MouseEvent): void {
    if (!this.isScrubbing()) return;
    event.stopPropagation();
    this.finishScrub();
  }

  onProgressMouseMove(event: MouseEvent): void {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    this.tooltipLeft.set(event.clientX - rect.left);
    this.tooltipTime.set(ratio * this.duration());
    this.showTooltip.set(true);
    if (this.isScrubbing()) {
      const time = ratio * this.duration();
      this.currentTime.set(time);
      const video = this.videoRef()?.nativeElement;
      if (video) video.currentTime = time;
    }
  }

  onProgressMouseLeave(): void {
    this.showTooltip.set(false);
    if (this.isScrubbing()) {
      this.finishScrub();
    }
  }

  private seekToEvent(event: MouseEvent): void {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const time = ratio * this.duration();
    this.currentTime.set(time);
    const video = this.videoRef()?.nativeElement;
    if (video) video.currentTime = time;
  }

  private finishScrub(): void {
    this.isScrubbing.set(false);
    const video = this.videoRef()?.nativeElement;
    if (video) {
      video.currentTime = this.currentTime();
      if (this.scrubWasPlaying) {
        video.play().catch(() => {});
      }
    }
  }

  private showControls(): void {
    this.controlsVisible.set(true);
    this.scheduleHide();
  }

  private scheduleHide(): void {
    this.clearHideTimer();
    if (!this.isPlaying()) return;
    this.hideTimer = setTimeout(() => {
      this.controlsVisible.set(false);
    }, 5000);
  }

  private clearHideTimer(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private startRaf(): void {
    this.stopRaf();
    const tick = () => {
      const video = this.videoRef()?.nativeElement;
      if (video && !this.isScrubbing()) {
        this.currentTime.set(video.currentTime);
      }
      if (this.isPlaying()) {
        this.rafId = requestAnimationFrame(tick);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopRaf(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private pauseVideo(): void {
    const video = this.videoRef()?.nativeElement;
    if (video) video.pause();
  }

  private resetVideoState(): void {
    if (this.isPlaying()) {
      this.playback.clearActive(this.activeItemId());
    }
    this.stopRaf();
    this.clearHideTimer();
    this.isVideoLoaded.set(false);
    this.isPlaying.set(false);
    this.currentTime.set(0);
    this.duration.set(0);
    this.controlsVisible.set(true);
    this.showTooltip.set(false);
    this.isScrubbing.set(false);
  }

  getCardTransform(visualIndex: number): string {
    const dx = this.dragX();
    const dragging = this.isDragging();
    const total = this.totalItems();

    if (total === 0) return '';

    if (visualIndex === 0) {
      const rotation = dragging ? (dx / CARD_WIDTH) * 8 : 0;
      return `translate3d(${dx}px, 0, 0) rotate(${rotation}deg)`;
    }

    const absDx = Math.abs(dx);
    const baseX = visualIndex * 8;

    if (absDx <= THRESHOLD) {
      const progress = absDx / THRESHOLD;
      const translateX = baseX - 8 * progress;
      return `translate3d(${translateX}px, 0, 0)`;
    }

    const beyondProgress = Math.min((absDx - THRESHOLD) / (MAX_DRAG - THRESHOLD), 1);
    const targetX = (visualIndex - 1) * 8;
    const translateX = targetX * (1 - beyondProgress);

    if (visualIndex === 1) {
      const scale = 1 + 0.03 * beyondProgress;
      const liftY = -6 * beyondProgress;
      const rotateY = -4 * beyondProgress * (dx > 0 ? 1 : -1);
      return `translate3d(${translateX}px, ${liftY}px, 0) scale(${scale}) rotateY(${rotateY}deg)`;
    }

    return `translate3d(${translateX}px, 0, 0)`;
  }

  getCardZIndex(visualIndex: number): number {
    const absDx = Math.abs(this.dragX());
    if (absDx > THRESHOLD && visualIndex === 0) {
      return MAX_VISIBLE - 1;
    }
    if (absDx > THRESHOLD && visualIndex === 1) {
      return MAX_VISIBLE;
    }
    return MAX_VISIBLE - visualIndex;
  }

  isCardRising(visualIndex: number): boolean {
    return visualIndex === 1 && Math.abs(this.dragX()) > THRESHOLD;
  }

  getCardShadow(visualIndex: number): string {
    const absDx = Math.abs(this.dragX());
    if (visualIndex === 1 && absDx > THRESHOLD) {
      const beyondProgress = Math.min((absDx - THRESHOLD) / (MAX_DRAG - THRESHOLD), 1);
      const blur = 16 + 24 * beyondProgress;
      const spread = 4 + 8 * beyondProgress;
      const opacity = 0.08 + 0.14 * beyondProgress;
      return `0 ${spread}px ${blur}px rgba(0, 0, 0, ${opacity})`;
    }
    return '';
  }

  getCardOpacity(visualIndex: number): number {
    if (visualIndex >= MAX_VISIBLE) return 0;
    if (visualIndex === 0 && this.isAnimating()) return 1;
    return 1;
  }

  getCardTransition(visualIndex: number): string {
    if (this.isDragging()) return 'none';
    if (visualIndex === 0 && this.isAnimating()) {
      return 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
    }
    return 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
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
    if (this.isAnimating()) {
      this.isAnimating.set(false);
    }
    event.preventDefault();

    this.isDragging.set(true);
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startTime = Date.now();
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

    const clamped = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, deltaX));
    this.dragX.set(clamped);
  }

  private onPointerUp(): void {
    if (!this.isDragging()) return;

    const dx = this.dragX();
    const absDx = Math.abs(dx);
    const elapsed = Date.now() - this.startTime;
    const velocity = elapsed > 0 ? absDx / elapsed : 0;

    if (absDx > 5) {
      this.dragOccurred = true;
    }

    if (absDx >= THRESHOLD || velocity >= VELOCITY_THRESHOLD) {
      this.cycleCard(dx < 0 ? 1 : -1);
    } else {
      this.snapBack();
    }

    this.finishDrag();
  }

  private cycleCard(direction: number): void {
    const total = this.totalItems();
    if (total <= 1) {
      this.snapBack();
      return;
    }

    this.isAnimating.set(true);
    this.dragX.set(0);
    this.activeIndex.update((i) => (i + direction + total) % total);

    setTimeout(() => {
      this.isAnimating.set(false);
    }, ANIMATION_MS);
  }

  private snapBack(): void {
    this.isAnimating.set(true);
    this.dragX.set(0);

    setTimeout(() => {
      this.isAnimating.set(false);
    }, ANIMATION_MS);
  }

  private finishDrag(): void {
    this.isDragging.set(false);
    this.isHorizontalDrag = null;
    document.removeEventListener('pointermove', this.boundOnPointerMove);
    document.removeEventListener('pointerup', this.boundOnPointerUp);
  }

  ngOnDestroy(): void {
    this.finishDrag();
    this.stopRaf();
    this.clearHideTimer();
    this.playback.clearActive(this.activeItemId());
  }
}
