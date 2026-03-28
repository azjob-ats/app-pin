import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BoardCardComponent } from '@shared/components/board-card/board-card.component';
import { ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { MasonryGridComponent } from '@shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ContentCategoryApi } from '@shared/apis/content-category.api';
import { RelevantResearchApi } from '@shared/apis/relevant-research.api';
import { Board } from '@shared/interfaces/entity/board';
import { ContentCategory } from '@shared/interfaces/entity/content-category';
import { RelevantResearch } from '@shared/interfaces/entity/relevant-research';
import { Pin } from '@shared/interfaces/entity/pin';
import { BoardService } from '@shared/services/board.service';
import { PinService } from '@shared/services/pin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MasonryGridComponent,
    SkeletonLoaderComponent,
    InfiniteScrollComponent,
    ChipScrollComponent,
    BoardCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly categories = signal<ContentCategory[]>([]);
  readonly popularSearches = signal<RelevantResearch[]>([]);
  readonly isLoadingCategories = signal(true);
  readonly isLoadingPopularSearches = signal(true);
  readonly isLoadingBoards = signal(true);
  readonly isLoadingChips = computed(() => this.isLoadingCategories() || this.isLoadingPopularSearches());

  private readonly boardService = inject(BoardService);
  private readonly contentCategoryApi = inject(ContentCategoryApi);
  private readonly relevantResearchApi = inject(RelevantResearchApi);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private page = 0;

  readonly selectedCategory = signal<string>('all');

  readonly relevantResearch = computed(() =>
    this.popularSearches().map((item) => ({ key: item.term, icon: 'trending_up', labelKey: item.term })),
  );
  readonly gridRecentContent = computed(() =>
    this.categories().map((cat) => ({ key: cat.key, icon: cat.icon ?? undefined, labelKey: '' + cat.key })),
  );

  readonly boards = signal<Board[]>([]);
  readonly query = signal('');

  private readonly boardsTrack = viewChild<ElementRef<HTMLDivElement>>('boardsTrack');

  constructor(private pinService: PinService) {
    afterNextRender(() => {
      const track = this.boardsTrack()?.nativeElement;
      if (!track) return;

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        isDragging = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
      };
      const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        track.style.cursor = 'grab';
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) isDragging = true;
        track.scrollLeft = scrollLeft - walk;
      };
      const onClickCapture = (e: Event) => {
        if (isDragging) {
          e.stopPropagation();
          e.preventDefault();
          isDragging = false;
        }
      };

      const onDragStart = (e: DragEvent) => e.preventDefault();

      track.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      track.addEventListener('click', onClickCapture, true);
      track.addEventListener('dragstart', onDragStart);

      this.destroyRef.onDestroy(() => {
        track.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        track.removeEventListener('click', onClickCapture, true);
        track.removeEventListener('dragstart', onDragStart);
      });
    });

    this.loadPins();
    this.loadHomeContent();
  }

  loadPins(): void {
    this.isLoading.set(true);
    this.pinService.getPins(this.page).subscribe((pins) => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });

    this.boardService.getUserBoards('u1').subscribe((boards) => {
      this.boards.set(boards);
      this.isLoadingBoards.set(false);
    });
  }

  private loadHomeContent(): void {
    this.contentCategoryApi.list().subscribe({
      next: (response) => this.categories.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoadingCategories.set(false),
    });

    this.relevantResearchApi.list().subscribe({
      next: (response) => this.popularSearches.set(response.data?.data ?? []),
      error: () => {},
      complete: () => this.isLoadingPopularSearches.set(false),
    });
  }

  selectCategory(key: string): void {
    this.selectedCategory.set(key);
    this.page = 0;
    this.pins.set([]);
    this.isLoading.set(true);
    if (key !== 'all') {
      this.router.navigate(['/home', key]);
    } else {
      this.router.navigate(['/home']);
    }
    this.loadPins();
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getPins(this.page).subscribe((pins) => {
      this.pins.update((current) => [...current, ...pins]);
      this.isLoadingMore.set(false);
    });
  }

  search(q: string): void {
    this.query.set(q);
    this.page = 0;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    this.pinService.getSearchPins(q).subscribe((pins) => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }
}
