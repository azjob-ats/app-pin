import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ContentCategoryApi } from '@shared/apis/content-category.api';
import { PostApi } from '@shared/apis/post.api';
import { RelevantResearchApi } from '@shared/apis/relevant-research.api';
import { ContentCategory } from '@shared/interfaces/entity/content-category';
import { Post } from '@shared/interfaces/entity/post';
import { BoardService } from '@shared/services/board.service';
import { DailyStoryComponent } from '../../components/daily-story/daily-story.component';
import { DynamicInterestTabsComponent } from '../../components/dynamic-interest-tabs/dynamic-interest-tabs.component';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { TrendingTopicComponent } from '../../components/trending-topic/trending-topic.component';
import { DailyStory } from '../../interfaces/daily-story';
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
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly interestTabs = signal<ContentCategory[]>([]);
  readonly trendingTopics = signal<TrendingTopic[]>([]);
  readonly isLoadingInterestTabs = signal(true);
  readonly isLoadingTrendingTopics = signal(true);
  readonly isLoadingDailyStories = signal(true);
  readonly selectedCategory = signal<string>('all');
  readonly dailyStories = signal<DailyStory[]>([]);

  private readonly postApi = inject(PostApi);
  private readonly boardService = inject(BoardService);
  private readonly contentCategoryApi = inject(ContentCategoryApi);
  private readonly relevantResearchApi = inject(RelevantResearchApi);
  private readonly router = inject(Router);
  private page = 1;

  constructor() {
    this.loadPosts();
    this.loadHomeContent();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.postApi.list(this.page).subscribe({
      next: (response) => this.posts.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoading.set(false),
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
    this.loadPosts();
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

  search(q: string): void {
    this.page = 1;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    // Search uses the posts endpoint filtered by category context
    this.postApi.list(this.page).subscribe({
      next: (response) => this.posts.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoading.set(false),
    });
  }
}
