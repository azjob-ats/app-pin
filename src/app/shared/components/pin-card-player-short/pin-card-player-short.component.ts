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
import { RouterLink } from '@angular/router';
import { Post } from './pin-card-player-short.interface';

@Component({
  selector: 'app-pin-card-player-short',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './pin-card-player-short.component.html',
  styleUrl: './pin-card-player-short.component.scss',
})
export class PinCardPlayerShortComponent implements OnDestroy {
  readonly post = input.required<Post>();

  readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

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

  private scrubWasPlaying = false;
  private rafId: number | null = null;

  readonly aspectRatioCss = computed(() =>
    this.post().media.aspectRatio.replace(':', '/')
  );

  readonly volumeIcon = computed(() => {
    if (this.isMuted()) return 'volume_off';
    const v = this.volume();
    if (v === 0) return 'volume_off';
    return v < 0.5 ? 'volume_down' : 'volume_up';
  });

  readonly progressPercent = computed(() => {
    const d = this.duration();
    return d ? (this.currentTime() / d) * 100 : 0;
  });

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onThumbnailClick(): void {
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
    if (!video || this.isPlaying()) return;
    video.play().then(() => {
      this.isPlaying.set(true);
      this.startRaf();
    }).catch(() => {});
  }

  onVideoEnded(): void {
    this.isPlaying.set(false);
    this.stopRaf();
  }

  togglePlayPause(event: Event): void {
    event.stopPropagation();
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    if (this.isPlaying()) {
      video.pause();
      this.isPlaying.set(false);
      this.stopRaf();
    } else {
      video.play().then(() => {
        this.isPlaying.set(true);
        this.startRaf();
      }).catch(() => {});
    }
  }

  toggleMute(event: Event): void {
    event.stopPropagation();
    const next = !this.isMuted();
    this.isMuted.set(next);
    const video = this.videoRef()?.nativeElement;
    if (video) video.muted = next;
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
      this.isPlaying.set(false);
      this.stopRaf();
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
        video.play().then(() => {
          this.isPlaying.set(true);
          this.startRaf();
        }).catch(() => {});
      }
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

  ngOnDestroy(): void {
    this.stopRaf();
  }
}
