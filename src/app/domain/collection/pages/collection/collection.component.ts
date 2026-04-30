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
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { CollectionBundleApi } from '@shared/apis/collection-bundle.api';
import { PostApi } from '@shared/apis/post.api';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { LearnMoreComponent } from '@shared/components/learn-more/learn-more.component';
import { BottomSheetComponent } from '@shared/components/bottom-sheet/bottom-sheet.component';
import { PostDetailsComponent } from '@shared/components/post-details/post-details.component';
import { CollectionBundle, CollectionItem } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';
import { Pin } from '@shared/interfaces/entity/pin';

export interface ItemPlayState {
  status: 'idle' | 'playing' | 'done';
  progress: number;
}

@Component({
  selector: 'app-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    EmptyStateComponent,
    ButtonComponent,
    DrawerComponent,
    LearnMoreComponent,
    BottomSheetComponent,
    PostDetailsComponent,
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
})
export class CollectionPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionApi = inject(CollectionBundleApi);
  private readonly postApi = inject(PostApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly bundle = signal<CollectionBundle | null>(null);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly currentIndex = signal(0);
  readonly isPlaying = signal(false);
  readonly itemStates = signal<ItemPlayState[]>([]);
  readonly showLearnMoreDrawer = signal(false);
  readonly showDetailsSheet = signal(false);
  readonly pin = signal<Pin | null>(null);

  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly isMuted = signal(false);
  readonly volume = signal(1);
  readonly tooltipVisible = signal(false);
  readonly tooltipX = signal(0);
  readonly tooltipTime = signal('');
  readonly isFullscreen = signal(false);
  readonly autoplay = signal(true);

  readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  readonly playerWrap = viewChild<ElementRef<HTMLDivElement>>('playerWrap');

  readonly currentItem = computed<CollectionItem | null>(
    () => this.bundle()?.items[this.currentIndex()] ?? null,
  );

  readonly currentPost = computed<Post | null>(() => {
    const item = this.currentItem();
    const allPosts = this.posts();
    if (!item || !allPosts.length) return null;

    if (item.postId) {
      const byId = allPosts.find((p) => p.id === item.postId);
      if (byId) return byId;
    }

    if (item.videoUrl) {
      return (
        allPosts.find(
          (p) => p.media.long === item.videoUrl || p.media.short === item.videoUrl,
        ) ?? null
      );
    }

    return null;
  });

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

  readonly hasPrev = computed(() => this.currentIndex() > 0);
  readonly hasNext = computed(() => {
    const b = this.bundle();
    return b ? this.currentIndex() < b.items.length - 1 : false;
  });

  readonly overallProgress = computed(() => {
    const states = this.itemStates();
    if (!states.length) return 0;
    const total = states.reduce((s, i) => s + i.progress, 0);
    return Math.round(total / states.length);
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const collectionNameKey = params.get('collectionNameKey');
      if (!collectionNameKey) {
        this.router.navigate(['/']);
        return;
      }
      this.loadData(collectionNameKey);
    });

    afterNextRender(() => {
      const onFullscreenChange = () => this.isFullscreen.set(!!document.fullscreenElement);
      document.addEventListener('fullscreenchange', onFullscreenChange);
      this.destroyRef.onDestroy(() => document.removeEventListener('fullscreenchange', onFullscreenChange));
    });
  }

  private loadData(collectionNameKey: string): void {
    forkJoin({
      bundle: this.collectionApi.detail(collectionNameKey),
      posts: this.postApi.list(1, 100),
    }).subscribe({
      next: ({ bundle, posts }) => {
        const b = bundle.data;
        if (!b) { this.hasError.set(true); return; }
        this.bundle.set(b);
        this.itemStates.set(b.items.map(() => ({ status: 'idle', progress: 0 })));
        this.posts.set(posts.data?.data ?? []);
      },
      error: () => this.hasError.set(true),
      complete: () => this.isLoading.set(false),
    });
  }

  selectItem(index: number): void {
    this.currentIndex.set(index);
    this.isPlaying.set(true);
    this.markPlaying(index);
  }

  togglePlay(): void {
    const video = this.videoEl()?.nativeElement;
    if (!video) { this.isPlaying.update((v) => !v); return; }
    if (video.paused) {
      video.play();
      this.isPlaying.set(true);
    } else {
      video.pause();
      this.isPlaying.set(false);
    }
    this.markPlaying(this.currentIndex());
  }

  prev(): void {
    if (!this.hasPrev()) return;
    this.currentIndex.update((i) => i - 1);
    this.isPlaying.set(false);
  }

  next(): void {
    if (!this.hasNext()) return;
    this.currentIndex.update((i) => i + 1);
    this.isPlaying.set(false);
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
    const progress = Math.round((video.currentTime / video.duration) * 100);
    this.updateItemProgress(this.currentIndex(), 'playing', progress);
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

  toggleAutoplay(): void {
    this.autoplay.update((v) => !v);
  }

  onVideoEnded(): void {
    const index = this.currentIndex();
    this.updateItemProgress(index, 'done', 100);
    if (this.hasNext() && this.autoplay()) {
      setTimeout(() => {
        this.currentIndex.update((i) => i + 1);
        this.isPlaying.set(true);
        this.markPlaying(this.currentIndex());
      }, 800);
    } else {
      this.isPlaying.set(false);
    }
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatDuration(seconds: number | undefined): string {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  private markPlaying(index: number): void {
    this.itemStates.update((states) => {
      const copy = [...states];
      if (copy[index]?.status !== 'done') {
        copy[index] = { ...copy[index], status: 'playing' };
      }
      return copy;
    });
  }

  private updateItemProgress(
    index: number,
    status: ItemPlayState['status'],
    progress: number,
  ): void {
    this.itemStates.update((states) => {
      const copy = [...states];
      copy[index] = { status, progress };
      return copy;
    });
  }
}
