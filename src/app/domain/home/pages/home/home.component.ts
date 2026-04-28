import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionBundleApi } from '@shared/apis/collection-bundle.api';
import { ContentCategoryApi } from '@shared/apis/content-category.api';
import { PostApi } from '@shared/apis/post.api';
import { RelevantResearchApi } from '@shared/apis/relevant-research.api';
import { ShopWindowApi } from '@shared/apis/shop-window.api';
import { WinningSlotsApi } from '@shared/apis/winning-slots.api';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { ContentCategory } from '@shared/interfaces/entity/content-category';
import { Post } from '@shared/interfaces/entity/post';
import { ShopWindow } from '@shared/interfaces/entity/shop-window';
import { WinningSlot } from '@shared/interfaces/entity/winning-slot';
import { FeedComposerService } from '@shared/services/feed-composer.service';
import { DailyStoryComponent } from '../../components/daily-story/daily-story.component';
import { DynamicInterestTabsComponent } from '../../components/dynamic-interest-tabs/dynamic-interest-tabs.component';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { TrendingTopicComponent } from '../../components/trending-topic/trending-topic.component';
import { FeedItem } from '../../interfaces/feed-item';
import { TrendingTopic } from '../../interfaces/trending-topic';

const MOBILE_BREAKPOINT_PX = 768;
const COLUMNS_DESKTOP = 6;
const COLUMNS_MOBILE = 2;

@Component({
  selector: 'app-home',
  imports: [
    TrendingTopicComponent,
    DailyStoryComponent,
    DynamicInterestTabsComponent,
    MediaCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly posts = signal<Post[]>([]);
  readonly collections = signal<CollectionBundle[]>([]);
  readonly winningSlots = signal<WinningSlot[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly interestTabs = signal<ContentCategory[]>([]);
  readonly trendingTopics = signal<TrendingTopic[]>([]);
  readonly isLoadingInterestTabs = signal(true);
  readonly isLoadingTrendingTopics = signal(true);
  readonly isLoadingDailyStories = signal(true);
  readonly selectedCategory = signal<string>('all');
  readonly dailyStories = signal<ShopWindow[]>([]);

  private readonly columnCount = signal(this.detectColumns());

  readonly feedItems = computed<FeedItem[]>(() => {
    const composed = this.composer.composeFeedWithWinningSlots(
      this.posts(),
      this.winningSlots(),
      { columns: this.columnCount() },
    );
    return this.interleaveCollections(composed, this.collections());
  });

  private readonly postApi = inject(PostApi);
  private readonly collectionBundleApi = inject(CollectionBundleApi);
  private readonly shopWindowApi = inject(ShopWindowApi);
  private readonly contentCategoryApi = inject(ContentCategoryApi);
  private readonly relevantResearchApi = inject(RelevantResearchApi);
  private readonly winningSlotsApi = inject(WinningSlotsApi);
  private readonly composer = inject(FeedComposerService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private page = 1;

  constructor() {
    this.loadFeed(this.selectedCategory());
    this.loadHomeContent();
    this.loadWinningSlots();
    this.observeViewport();
  }

  loadFeed(category = 'all'): void {
    this.isLoading.set(true);

    this.postApi.list(this.page, 20, category).subscribe({
      next: (response) => this.posts.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoading.set(false),
    });

    this.collectionBundleApi.list(1, 20, category).subscribe({
      next: (response) => this.collections.set(response.data?.data ?? []),
      error: () => {},
    });

    this.shopWindowApi.list().subscribe({
      next: (response) => this.dailyStories.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoadingDailyStories.set(false),
    });
  }

  private loadWinningSlots(): void {
    this.winningSlotsApi.list({ pageSize: 40 }).subscribe({
      next: (response) => this.winningSlots.set(response.data?.data ?? []),
      error: () => {},
    });
  }

  private loadHomeContent(): void {
    this.contentCategoryApi.list().subscribe({
      next: (response) => this.interestTabs.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoadingInterestTabs.set(false),
    });

    this.relevantResearchApi.list().subscribe({
      next: (response) =>
        this.trendingTopics.set(
          (response.data?.data ?? []).map((r) => ({ term: r.term } satisfies TrendingTopic)),
        ),
      error: () => {},
      complete: () => this.isLoadingTrendingTopics.set(false),
    });
  }

  selectCategory(key: string): void {
    this.selectedCategory.set(key);
    this.page = 1;
    this.posts.set([]);
    if (key !== 'all') {
      this.router.navigate(['/home', key]);
    } else {
      this.router.navigate(['/home']);
    }
    this.loadFeed(key);
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.postApi.list(this.page, 20, this.selectedCategory()).subscribe({
      next: (response) =>
        this.posts.update((current) => [...current, ...(response.data?.data ?? [])]),
      error: () => {},
      complete: () => this.isLoadingMore.set(false),
    });
  }

  onOpenCollection(bundle: CollectionBundle): void {
    this.router.navigate([`/${bundle.username}/collection/${bundle.collectionNameKey}`]);
  }

  search(q: string): void {
    this.page = 1;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    this.postApi.list(this.page).subscribe({
      next: (response) => this.posts.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoading.set(false),
    });
  }

  private detectColumns(): number {
    if (typeof window === 'undefined') return COLUMNS_DESKTOP;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
      ? COLUMNS_MOBILE
      : COLUMNS_DESKTOP;
  }

  private observeViewport(): void {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
    const onChange = (e: MediaQueryListEvent) =>
      this.columnCount.set(e.matches ? COLUMNS_MOBILE : COLUMNS_DESKTOP);
    mql.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => mql.removeEventListener('change', onChange));
  }

  private interleaveCollections(
    composed: FeedItem[],
    collections: CollectionBundle[],
  ): FeedItem[] {
    if (!collections.length) return composed;
    const out: FeedItem[] = [];
    let collectionIndex = 0;

    for (let i = 0; i < composed.length; i++) {
      out.push(composed[i]);
      if ((i + 1) % 2 === 0 && collectionIndex < collections.length) {
        out.push({ kind: 'collection', data: collections[collectionIndex++] });
      }
    }
    while (collectionIndex < collections.length) {
      out.push({ kind: 'collection', data: collections[collectionIndex++] });
    }
    return out;
  }
}
