import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { VideoSinglePlaybackService } from '@shared/services/video-single-playback.service';

interface PhotoEntry {
  thumbnail: string;
  title: string;
  videoUrl?: string;
  postId?: string;
}

interface StackLayer extends PhotoEntry {
  rotation: number;
  tx: number;
  ty: number;
}

@Component({
  selector: 'app-polaroid-photo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './polaroid-photo-card.component.html',
  styleUrl: './polaroid-photo-card.component.scss',
  host: {
    class: 'polaroid-photo-card',
    role: 'img',
    '[attr.aria-label]': 'coverTitle()',
  },
})
export class PolaroidPhotoCardComponent implements OnDestroy {
  readonly bundle = input.required<CollectionBundle>();
  readonly rotate = input<boolean>(false);
  readonly shadow = input<boolean>(true);
  readonly stack = input<boolean | null>(null);
  readonly maxStackLayers = input<number>(4);

  private readonly dismissedCount = signal(0);

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
  private scrubWasPlaying = false;
  private rafId: number | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private suppressNextClick = false;

  protected readonly photoEntries = computed<PhotoEntry[]>(() => {
    const b = this.bundle();
    const list: PhotoEntry[] = [];
    if (b.coverUrl) {
      list.push({ thumbnail: b.coverUrl, title: b.collectionName });
    }
    for (const item of b.items ?? []) {
      if (item.thumbnailUrl && !list.some((p) => p.thumbnail === item.thumbnailUrl)) {
        list.push({
          thumbnail: item.thumbnailUrl,
          title: item.title ?? b.collectionName,
          videoUrl: item.videoUrl,
          postId: item.postId,
        });
      }
    }
    return list;
  });

  protected readonly currentEntry = computed<PhotoEntry | null>(() => {
    return this.photoEntries()[this.dismissedCount()] ?? null;
  });

  protected readonly coverImage = computed<string | null>(() => this.currentEntry()?.thumbnail ?? null);

  protected readonly coverTitle = computed<string>(
    () => this.currentEntry()?.title ?? this.bundle().collectionName,
  );

  protected readonly currentVideoUrl = computed<string | null>(
    () => this.currentEntry()?.videoUrl ?? null,
  );

  protected readonly currentVideoId = computed<string>(() => {
    const entry = this.currentEntry();
    return entry?.postId ?? `${this.bundle().id ?? 'polaroid'}-${this.dismissedCount()}`;
  });

  protected readonly hasVideo = computed(() => !!this.currentVideoUrl());

  protected readonly canDismiss = computed(() => !!this.coverImage());

  protected readonly canRestore = computed(
    () => this.dismissedCount() > 0 && this.photoEntries().length > 0,
  );

  protected readonly hasStack = computed(() => {
    const remaining = this.photoEntries().length - this.dismissedCount();
    const explicit = this.stack();
    if (explicit !== null) return explicit && remaining > 1;
    return remaining > 1;
  });

  protected readonly rotation = computed(() => {
    if (!this.rotate()) return '0deg';
    const seed = `${this.bundle().id ?? ''}-${this.dismissedCount()}`;
    const deg = this.seeded(seed, 'front', -3, 3);
    return `${deg.toFixed(2)}deg`;
  });

  protected readonly stackLayers = computed<StackLayer[]>(() => {
    if (!this.hasStack()) return [];

    const entries = this.photoEntries();
    const start = this.dismissedCount() + 1;
    const others = entries.slice(start);
    if (others.length === 0) return [];

    const seed = this.bundle().id ?? 'polaroid';
    const offset = this.dismissedCount();
    const count = Math.min(this.maxStackLayers(), others.length);

    return Array.from({ length: count }, (_, i): StackLayer => ({
      thumbnail: others[i].thumbnail,
      title: others[i].title,
      videoUrl: others[i].videoUrl,
      postId: others[i].postId,
      rotation: this.seeded(seed, `r${i + offset}`, -45, 45),
      tx: this.seeded(seed, `x${i + offset}`, -42, 42),
      ty: this.seeded(seed, `y${i + offset}`, -28, 28),
    }));
  });

  protected readonly volumeIcon = computed(() => (this.isMuted() ? 'volume_off' : 'volume_up'));

  protected readonly progressPercent = computed(() => {
    const d = this.duration();
    return d ? (this.currentTime() / d) * 100 : 0;
  });

  constructor() {
    effect(() => {
      this.bundle();
      this.dismissedCount.set(0);
    });

    effect(() => {
      const activeId = this.playback.activeId();
      untracked(() => {
        if (activeId !== this.currentVideoId() && this.isPlaying()) {
          this.pauseVideo();
        }
      });
    });

    effect(() => {
      this.coverImage();
      untracked(() => this.resetVideoState());
    });
  }

  ngOnDestroy(): void {
    this.stopRaf();
    this.clearHideTimer();
    this.playback.clearActive(this.currentVideoId());
  }

  protected dismiss(): void {
    if (!this.canDismiss()) return;
    this.dismissedCount.update((n) => n + 1);
  }

  protected restore(): void {
    if (!this.canRestore()) return;
    this.dismissedCount.set(0);
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onPlayBtnClick(event: Event): void {
    event.stopPropagation();
    if (!this.currentVideoUrl()) return;
    this.isVideoLoaded.set(true);
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
    this.playback.setActive(this.currentVideoId());
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
    this.playback.clearActive(this.currentVideoId());
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
      this.playback.setActive(this.currentVideoId());
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
      this.playback.clearActive(this.currentVideoId());
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

  private seeded(seed: string, salt: string, min: number, max: number): number {
    const key = `${seed}::${salt}`;
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const normalized = ((hash >>> 0) % 10000) / 10000;
    return min + normalized * (max - min);
  }
}
