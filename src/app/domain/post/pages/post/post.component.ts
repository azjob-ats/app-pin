import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  signal,
  computed,
  viewChild,
  ElementRef,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PostApi } from '@shared/apis/post.api';
import { Post } from '@shared/interfaces/entity/post';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ButtonInscriptionComponent } from '@shared/components/button-inscription/button-inscription.component';
import { UserAvatarComponent } from '@shared/components/user-avatar/user-avatar.component';
import { CommentInputComponent } from '@shared/components/comment-input/comment-input.component';
import { CommentSubmitComponent } from '@shared/components/comment-submit/comment-submit.component';
import { ButtonLikeComponent } from '@shared/components/button-like/button-like.component';

@Component({
  selector: 'app-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    EmptyStateComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    ButtonInscriptionComponent,
    UserAvatarComponent,
    CommentInputComponent,
    CommentSubmitComponent,
    ButtonLikeComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly post = signal<Post | null>(null);
  readonly relatedPosts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly commentText = signal('');

  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly isMuted = signal(false);
  readonly volume = signal(1);
  readonly tooltipVisible = signal(false);
  readonly tooltipX = signal(0);
  readonly tooltipTime = signal('');
  readonly isFullscreen = signal(false);
  readonly autoplay = signal(false);

  readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  readonly playerWrap = viewChild<ElementRef<HTMLDivElement>>('playerWrap');

  readonly videoProgress = computed(() => {
    const d = this.duration();
    return d ? (this.currentTime() / d) * 100 : 0;
  });

  readonly volumeIcon = computed(() => {
    if (this.isMuted() || this.volume() === 0) return 'volume_off';
    if (this.volume() < 0.5) return 'volume_down';
    return 'volume_up';
  });

  readonly volumeSliderBg = computed(() => {
    const pct = (this.isMuted() ? 0 : this.volume()) * 100;
    return `linear-gradient(to right, #fff ${pct}%, rgba(128,128,128,0.3) ${pct}%)`;
  });

  readonly filteredRelated = computed(() => {
    const current = this.post();
    return this.relatedPosts().filter((p) => p.id !== current?.id).slice(0, 20);
  });

  constructor() {
    afterNextRender(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.router.navigate(['/']);
        return;
      }
      this.loadData(id);

      const onFullscreenChange = () => this.isFullscreen.set(!!document.fullscreenElement);
      document.addEventListener('fullscreenchange', onFullscreenChange);
      this.destroyRef.onDestroy(() =>
        document.removeEventListener('fullscreenchange', onFullscreenChange),
      );
    });
  }

  private loadData(id: string): void {
    forkJoin({
      post: this.postApi.detail(id),
      related: this.postApi.list(1, 20),
    }).subscribe({
      next: ({ post, related }) => {
        if (!post.data) {
          this.hasError.set(true);
          return;
        }
        this.post.set(post.data);
        this.relatedPosts.set(related.data?.data ?? []);
      },
      error: () => this.hasError.set(true),
      complete: () => this.isLoading.set(false),
    });
  }

  togglePlay(): void {
    const video = this.videoEl()?.nativeElement;
    if (!video) {
      this.isPlaying.update((v) => !v);
      return;
    }
    if (video.paused) {
      video.play();
      this.isPlaying.set(true);
    } else {
      video.pause();
      this.isPlaying.set(false);
    }
  }

  onVideoCanPlay(): void {
    if (this.isPlaying()) {
      this.videoEl()?.nativeElement.play();
    }
  }

  onVideoLoadedMetadata(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.duration.set(video.duration);
    this.volume.set(video.volume);
    this.isMuted.set(video.muted);
  }

  onVideoTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (!video.duration) return;
    this.currentTime.set(video.currentTime);
    this.duration.set(video.duration);
  }

  onVideoEnded(): void {
    this.isPlaying.set(false);
  }

  toggleMute(): void {
    const video = this.videoEl()?.nativeElement;
    const next = !this.isMuted();
    this.isMuted.set(next);
    if (video) video.muted = next;
  }

  onVolumeChange(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    const video = this.videoEl()?.nativeElement;
    this.volume.set(val);
    this.isMuted.set(val === 0);
    if (video) {
      video.volume = val;
      video.muted = val === 0;
    }
  }

  onSeekbarInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.currentTime.set(val);
    const video = this.videoEl()?.nativeElement;
    if (video) video.currentTime = val;
  }

  onSeekbarHover(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    this.tooltipX.set(event.clientX - rect.left);
    this.tooltipTime.set(this.formatTime(ratio * this.duration()));
    this.tooltipVisible.set(true);
  }

  onSeekbarLeave(): void {
    this.tooltipVisible.set(false);
  }

  toggleFullscreen(): void {
    const wrap = this.playerWrap()?.nativeElement;
    if (!wrap) return;
    if (!document.fullscreenElement) {
      wrap.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} dia${days > 1 ? 's' : ''} atrás`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months > 1 ? 'meses' : 'mês'} atrás`;
    const years = Math.floor(months / 12);
    return `${years} ano${years > 1 ? 's' : ''} atrás`;
  }

  commentTimeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  addComment(): void {
    this.commentText.set('');
  }
}
