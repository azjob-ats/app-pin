import { Injectable, computed, inject, signal } from '@angular/core';
import { CreatorPortfolioApi } from '@shared/apis/creator-portfolio.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

export type PortfolioErrorKind = 'not-found' | 'unknown';

@Injectable({ providedIn: 'root' })
export class CreatorPortfolioFacade {
  private readonly api = inject(CreatorPortfolioApi);

  readonly portfolio = signal<CreatorPortfolio | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorKind = signal<PortfolioErrorKind | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly currentHandle = signal<string | null>(null);

  readonly isPublished = computed(() => this.portfolio()?.isPublished ?? false);

  load(handle: string): void {
    if (!handle) return;

    this.currentHandle.set(handle);
    this.isLoading.set(true);
    this.errorKind.set(null);
    this.errorMessage.set(null);
    this.portfolio.set(null);

    this.api
      .getByHandle(handle)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.portfolio.set(response.data);
          } else {
            this.errorKind.set('unknown');
            this.errorMessage.set(response.message || 'Erro ao carregar portfólio.');
          }
        }),
        catchError((err: ApiResponse) => {
          if (err?.statusCode === 404) {
            this.errorKind.set('not-found');
            this.errorMessage.set('Creator não encontrado.');
          } else {
            this.errorKind.set('unknown');
            this.errorMessage.set(err?.message || 'Erro ao carregar portfólio.');
          }
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }

  reset(): void {
    this.portfolio.set(null);
    this.errorKind.set(null);
    this.errorMessage.set(null);
    this.currentHandle.set(null);
    this.isLoading.set(false);
  }
}
