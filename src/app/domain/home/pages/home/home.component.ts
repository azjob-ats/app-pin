import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ContentCategoryApi } from '@shared/apis/content-category.api';
import { RelevantResearchApi } from '@shared/apis/relevant-research.api';
import { Board } from '@shared/interfaces/entity/board';
import { ContentCategory } from '@shared/interfaces/entity/content-category';
import { Pin } from '@shared/interfaces/entity/pin';
import { BoardService } from '@shared/services/board.service';
import { PinService } from '@shared/services/pin.service';
import { DailyStoryComponent } from '../../components/daily-story/daily-story.component';
import { DynamicInterestTabsComponent } from '../../components/dynamic-interest-tabs/dynamic-interest-tabs.component';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { TrendingTopicComponent } from '../../components/trending-topic/trending-topic.component';
import { DailyStory } from '../../interfaces/daily-story';
import { MediaContent } from '../../interfaces/media-content';
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
  readonly mediaItems = signal<MediaContent[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly interestTabs = signal<ContentCategory[]>([]);
  readonly trendingTopics = signal<TrendingTopic[]>([]);
  readonly isLoadingInterestTabs = signal(true);
  readonly isLoadingTrendingTopics = signal(true);
  readonly isLoadingDailyStories = signal(true);
  readonly selectedCategory = signal<string>('all');
  readonly dailyStories = signal<DailyStory[]>([]);
  readonly query = signal('');

  readonly isLoadingChips = computed(
    () => this.isLoadingInterestTabs() || this.isLoadingTrendingTopics(),
  );

  private readonly boardService = inject(BoardService);
  private readonly contentCategoryApi = inject(ContentCategoryApi);
  private readonly relevantResearchApi = inject(RelevantResearchApi);
  private readonly router = inject(Router);
  private page = 0;

  constructor(private pinService: PinService) {
    this.loadMediaItems();
    this.loadHomeContent();
  }

  loadMediaItems(): void {
    this.isLoading.set(true);
    this.pinService.getPins(this.page).subscribe((pins) => {
      this.mediaItems.set(pins as unknown as MediaContent[]);
      this.isLoading.set(false);
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
    this.page = 0;
    this.mediaItems.set([]);
    this.isLoading.set(true);
    if (key !== 'all') {
      this.router.navigate(['/home', key]);
    } else {
      this.router.navigate(['/home']);
    }
    this.loadMediaItems();
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getPins(this.page).subscribe((pins) => {
      this.mediaItems.update((current) => [
        ...current,
        ...(pins as unknown as MediaContent[]),
      ]);
      this.isLoadingMore.set(false);
    });
  }

  search(q: string): void {
    this.query.set(q);
    this.page = 0;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    this.pinService.getSearchPins(q).subscribe((pins) => {
      this.mediaItems.set(pins as unknown as MediaContent[]);
      this.isLoading.set(false);
    });
  }
}
