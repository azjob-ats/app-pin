import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionBundleApi } from '@shared/apis/collection-bundle.api';
import { ContentCategoryApi } from '@shared/apis/content-category.api';
import { PostApi } from '@shared/apis/post.api';
import { RelevantResearchApi } from '@shared/apis/relevant-research.api';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { ContentCategory } from '@shared/interfaces/entity/content-category';
import { Post } from '@shared/interfaces/entity/post';
import { BoardService } from '@shared/services/board.service';
import { DailyStoryComponent } from '../../components/daily-story/daily-story.component';
import { DynamicInterestTabsComponent } from '../../components/dynamic-interest-tabs/dynamic-interest-tabs.component';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { TrendingTopicComponent } from '../../components/trending-topic/trending-topic.component';
import { DailyStory } from '../../interfaces/daily-story';
import { FeedItem } from '../../interfaces/feed-item';
import { TrendingTopic } from '../../interfaces/trending-topic';

@Component({
  selector: 'app-home',
  standalone: true,
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
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly interestTabs = signal<ContentCategory[]>([]);
  readonly trendingTopics = signal<TrendingTopic[]>([]);
  readonly isLoadingInterestTabs = signal(true);
  readonly isLoadingTrendingTopics = signal(true);
  readonly isLoadingDailyStories = signal(true);
  readonly selectedCategory = signal<string>('all');
  readonly dailyStories = signal<DailyStory[]>([]);

  /** Feed híbrido: insere 1 collection a cada 2 posts; os restantes são adicionados ao final */
  readonly feedItems = computed<FeedItem[]>(() => {
    const posts = this.posts();
    const collections = this.collections();
    const result: FeedItem[] = [];
    let collectionIndex = 0;

    for (let i = 0; i < posts.length; i++) {
      result.push({ kind: 'post', data: posts[i] });
      if ((i + 1) % 2 === 0 && collectionIndex < collections.length) {
        result.push({ kind: 'collection', data: collections[collectionIndex++] });
      }
    }

    while (collectionIndex < collections.length) {
      result.push({ kind: 'collection', data: collections[collectionIndex++] });
    }

    return result;
  });

  private readonly postApi = inject(PostApi);
  private readonly collectionBundleApi = inject(CollectionBundleApi);
  private readonly boardService = inject(BoardService);
  private readonly contentCategoryApi = inject(ContentCategoryApi);
  private readonly relevantResearchApi = inject(RelevantResearchApi);
  private readonly router = inject(Router);
  private page = 1;

  constructor() {
    this.loadFeed();
    this.loadHomeContent();
  }

  loadFeed(): void {
    this.isLoading.set(true);

    this.postApi.list(this.page).subscribe({
      next: (response) => this.posts.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoading.set(false),
    });

    this.collectionBundleApi.list().subscribe({
      next: (response) => this.collections.set(response.data?.data ?? []),
      error: () => {},
    });

    this.boardService.getUserBoards('u1').subscribe((boards) => {
      this.dailyStories.set(boards as unknown as DailyStory[]);
      this.isLoadingDailyStories.set(false);
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
    this.isLoading.set(true);
    if (key !== 'all') {
      this.router.navigate(['/home', key]);
    } else {
      this.router.navigate(['/home']);
    }
    this.loadFeed();
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.postApi.list(this.page).subscribe({
      next: (response) =>
        this.posts.update((current) => [...current, ...(response.data?.data ?? [])]),
      error: () => {},
      complete: () => this.isLoadingMore.set(false),
    });
  }

  onOpenCollection(bundle: CollectionBundle): void {
    this.router.navigate([`/${bundle.username}/collection/${bundle.id}`]);
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
}
