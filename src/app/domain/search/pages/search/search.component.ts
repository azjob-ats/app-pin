import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { PinService } from '@shared/services/pin.service';
import { SearchFilterService } from '@shared/services/search-filter.service';
import { Pin } from '@shared/interfaces/entity/pin';
import { ICatalog } from '@shared/interfaces/entity/search-filter';
import { MasonryGridComponent } from '@shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SearchFilterMenuComponent } from '@shared/components/search-filter-menu/search-filter-menu.component';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    TranslateModule,
    MasonryGridComponent,
    SkeletonLoaderComponent,
    InfiniteScrollComponent,
    EmptyStateComponent,
    SearchFilterMenuComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pinService = inject(PinService);
  private readonly searchFilterService = inject(SearchFilterService);

  readonly catalogs = signal<ICatalog[]>([]);
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly query = signal('');
  readonly activeFilters = signal<Record<string, string | string[]>>({});
  readonly resultCount = computed(() => this.pins().length || null);

  private page = 0;

  ngOnInit(): void {
    this.searchFilterService.getCatalogs().subscribe((catalogs) =>
      this.catalogs.set(catalogs.map((c) => ({ ...c, selected: false }))),
    );

    this.route.queryParams.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ).subscribe((params) => {
      const q = params['q'] ?? '';
      this.query.set(q);
      if (q) this._fetchResults(params);
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

  private _fetchResults(params: Record<string, string>): void {
    const { q, catalog, ...rest } = params;
    const filters: Record<string, string | string[]> = {};
    if (catalog) filters['catalog'] = catalog;
    for (const [k, v] of Object.entries(rest)) {
      filters[k] = String(v).includes(',') ? String(v).split(',') : v;
    }

    this.page = 0;
    this.isLoading.set(true);
    this.pinService.getSearchPins(q, filters).subscribe((pins) => {
      this.pins.set(pins);
      this.isLoading.set(false);
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

  onFilterChange(filters: Record<string, string | string[]>): void {
    this.activeFilters.set(filters);
  }

  onLoadMore(): void {
    if (this.isLoadingMore() || !this.query()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getSearchPins(this.query(), this.activeFilters(), this.page).subscribe((pins) => {
      this.pins.update((c) => [...c, ...pins]);
      this.isLoadingMore.set(false);
    });
  }
}
