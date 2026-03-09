import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PinService } from '../../../../shared/services/pin.service';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '../../../../shared/components/infinite-scroll/infinite-scroll.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, MasonryGridComponent, SkeletonLoaderComponent, InfiniteScrollComponent, SearchBarComponent, EmptyStateComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit {
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly query = signal('');
  readonly activeFilter = signal<'all' | 'people' | 'boards'>('all');
  private page = 0;

  readonly popularSearches = ['sunset', 'minimal design', 'home decor', 'fashion', 'food photography', 'travel', 'architecture', 'art'];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pinService = inject(PinService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] ?? '';
      this.query.set(q);
      if (q) this.search(q);
    });
  }

  search(q: string): void {
    this.query.set(q);
    this.page = 0;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    this.pinService.getSearchPins(q).subscribe(pins => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }

  setFilter(filter: 'all' | 'people' | 'boards'): void {
    this.activeFilter.set(filter);
  }

  onLoadMore(): void {
    if (this.isLoadingMore() || !this.query()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getSearchPins(this.query(), this.page).subscribe(pins => {
      this.pins.update(c => [...c, ...pins]);
      this.isLoadingMore.set(false);
    });
  }
}
