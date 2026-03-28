import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAttribute, ICatalog } from '@shared/interfaces/entity/search-filter';
import { SearchFilterApi } from '@shared/apis/training-filter.api';

@Injectable({ providedIn: 'root' })
export class SearchFilterService {
  private readonly searchFilterApi = inject(SearchFilterApi);
  private readonly _catalogsCache = signal<ICatalog[] | null>(null);
  private readonly _attrsCache = signal<Record<string, IAttribute[]>>({});

  getCatalogs(): Observable<ICatalog[]> {
    const cached = this._catalogsCache();
    if (cached) return of(cached);

    return this.searchFilterApi.getCatalogs().pipe(
      map((res) => res.data ?? []),
      tap((catalogs) => this._catalogsCache.set(catalogs)),
    );
  }

  getFilterAttributes(catalogKey: string): Observable<IAttribute[]> {
    const cached = this._attrsCache()[catalogKey];
    if (cached) return of(cached);

    return this.searchFilterApi.getFilterAttributes(catalogKey).pipe(
      map((res) => res.data ?? []),
      tap((attrs) => this._attrsCache.update((c) => ({ ...c, [catalogKey]: attrs }))),
    );
  }
}
