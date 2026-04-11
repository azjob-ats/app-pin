import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  viewChild,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CollectionBundleApi } from '@shared/apis/collection-bundle.api';
import { PostApi } from '@shared/apis/post.api';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ButtonInscriptionComponent } from '@shared/components/button-inscription/button-inscription.component';
import { UserAvatarComponent } from '@shared/components/user-avatar/user-avatar.component';
import { CommentInputComponent } from '@shared/components/comment-input/comment-input.component';
import { CommentSubmitComponent } from '@shared/components/comment-submit/comment-submit.component';
import { CollectionBundle, CollectionItem } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';

export interface ItemPlayState {
  status: 'idle' | 'playing' | 'done';
  progress: number; // 0–100
}

@Component({
  selector: 'app-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyStateComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    ButtonInscriptionComponent,
    UserAvatarComponent,
    CommentInputComponent,
    CommentSubmitComponent,
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
})
export class CollectionPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionApi = inject(CollectionBundleApi);
  private readonly postApi = inject(PostApi);

  readonly bundle = signal<CollectionBundle | null>(null);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly currentIndex = signal(0);
  readonly isPlaying = signal(false);
  readonly itemStates = signal<ItemPlayState[]>([]);
  readonly commentText = signal('');

  readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

  readonly currentItem = computed<CollectionItem | null>(
    () => this.bundle()?.items[this.currentIndex()] ?? null,
  );

  /** Matches the current bundle item to a Post by postId, then by videoUrl */
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

  readonly coverImages = computed<string[]>(() => {
    const b = this.bundle();
    if (!b) return [];
    if (b.coverUrl) return [b.coverUrl];
    return b.items
      .filter((i): i is CollectionItem & { thumbnailUrl: string } => !!i.thumbnailUrl)
      .slice(0, 3)
      .map((i) => i.thumbnailUrl);
  });

  constructor() {
    afterNextRender(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.router.navigate(['/']);
        return;
      }
      this.loadData(id);
    });
  }

  private loadData(bundleId: string): void {
    forkJoin({
      bundle: this.collectionApi.detail(bundleId),
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

  onVideoTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (!video.duration) return;
    const progress = Math.round((video.currentTime / video.duration) * 100);
    this.updateItemProgress(this.currentIndex(), 'playing', progress);
  }

  onVideoEnded(): void {
    const index = this.currentIndex();
    this.updateItemProgress(index, 'done', 100);
    if (this.hasNext()) {
      setTimeout(() => {
        this.currentIndex.update((i) => i + 1);
        this.isPlaying.set(true);
        this.markPlaying(this.currentIndex());
      }, 800);
    } else {
      this.isPlaying.set(false);
    }
  }

  addComment(): void {
    this.commentText.set('');
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

  formatDuration(seconds: number | undefined): string {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  itemStatusIcon(state: ItemPlayState | undefined): string {
    if (!state) return 'radio_button_unchecked';
    if (state.status === 'done') return 'check_circle';
    if (state.status === 'playing') return 'play_circle';
    return 'radio_button_unchecked';
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
