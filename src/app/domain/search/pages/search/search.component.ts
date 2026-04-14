import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { PostApi } from '@shared/apis/post.api';
import { SearchFilterService } from '@shared/services/search-filter.service';
import { Post } from '@shared/interfaces/entity/post';
import { ICatalog } from '@shared/interfaces/entity/search-filter';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SearchFilterMenuComponent } from '@shared/components/search-filter-menu/search-filter-menu.component';
import { PinCardPlayerShortComponent } from '@shared/components/pin-card-player-short/pin-card-player-short.component';

@Component({
  selector: 'app-search',
  imports: [
    TranslateModule,
    SkeletonLoaderComponent,
    InfiniteScrollComponent,
    EmptyStateComponent,
    SearchFilterMenuComponent,
    PinCardPlayerShortComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postApi = inject(PostApi);
  private readonly searchFilterService = inject(SearchFilterService);

  readonly catalogs = signal<ICatalog[]>([]);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly query = signal('');
  readonly resultCount = computed(() => this.posts().length || null);

  private page = 1;

  ngOnInit(): void {
    this.searchFilterService.getCatalogs().subscribe((catalogs) =>
      this.catalogs.set(catalogs.map((c) => ({ ...c, selected: false }))),
    );

    this.route.queryParams.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ).subscribe((params) => {
      const q = params['q'] ?? '';
      this.query.set(q);
      if (q) this._fetchResults(q);
    });
  }

  search(q: string): void {
    this.query.set(q);
    this.router.navigate(['/search'], {
      queryParams: { q },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private _fetchResults(term: string): void {
    this.page = 1;
    this.isLoading.set(true);
    this.postApi.search(term, this.page).subscribe({
      next: (response) => {
        this.posts.set(response.data?.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onCatalogSelected(catalog: ICatalog): void {
    if (catalog.attributes?.length) return;

    this.searchFilterService.getFilterAttributes(catalog.key).subscribe((attrs) => {
      this.catalogs.update((list) =>
        list.map((c) => (c.key === catalog.key ? { ...c, attributes: attrs } : c)),
      );
    });
  }

  onFilterChange(_filters: Record<string, string | string[]>): void {}

  onLoadMore(): void {
    if (this.isLoadingMore() || !this.query()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.postApi.search(this.query(), this.page).subscribe({
      next: (response) => {
        this.posts.update((c) => [...c, ...(response.data?.data ?? [])]);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }
}
