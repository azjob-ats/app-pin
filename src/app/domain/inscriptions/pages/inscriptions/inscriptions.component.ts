import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { InscriptionStatus } from '@shared/enums/inscription-status.enum';
import { InscriptionType } from '@shared/enums/inscription-type.enum';
import { InscriptionCardComponent } from '@domain/inscriptions/components/inscription-card/inscription-card.component';
import { InscriptionFiltersComponent } from '@domain/inscriptions/components/inscription-filters/inscription-filters.component';
import { InscriptionsFacade } from '@domain/inscriptions/services/inscriptions.facade';
import { take } from 'rxjs';

@Component({
  selector: 'app-inscriptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, EmptyStateComponent, InscriptionFiltersComponent, InscriptionCardComponent],
  templateUrl: './inscriptions.component.html',
  styleUrl: './inscriptions.component.scss',
})
export class InscriptionsComponent implements OnInit {
  private readonly facade = inject(InscriptionsFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = this.facade.items;
  readonly total = this.facade.total;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly filters = this.facade.filters;
  readonly cancellingIds = this.facade.cancellingIds;
  readonly hasItems = this.facade.hasItems;
  readonly hasActiveFilters = this.facade.hasActiveFilters;

  readonly skeletonRows = [0, 1, 2, 3, 4];
  readonly homeLink = `/${environment.ROUTES.HOME.ROOT}`;

  readonly emptyMessage = computed(() =>
    this.hasActiveFilters()
      ? 'Nenhuma inscrição com esses filtros'
      : 'Você ainda não se inscreveu em nada',
  );

  readonly emptySubtitle = computed(() =>
    this.hasActiveFilters()
      ? 'Tente ajustar tipo ou status para ver outras inscrições.'
      : 'Quando clicar em "Saiba Mais" em algum conteúdo, sua inscrição aparece aqui.',
  );

  ngOnInit(): void {
    this.hydrateFiltersFromUrl();
    this.facade.load();
  }

  onTypeChange(type: InscriptionType | null): void {
    this.facade.setFilters({ ...this.filters(), type });
    this.syncUrl();
  }

  onStatusChange(status: InscriptionStatus | null): void {
    this.facade.setFilters({ ...this.filters(), status });
    this.syncUrl();
  }

  onClearFilters(): void {
    this.facade.clearFilters();
    this.syncUrl();
  }

  onCancel(id: string): void {
    this.facade.cancel(id).pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private hydrateFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParamMap;
    const rawType = params.get('type');
    const rawStatus = params.get('status');

    const type = this.toEnum<InscriptionType>(rawType, Object.values(InscriptionType));
    const status = this.toEnum<InscriptionStatus>(rawStatus, Object.values(InscriptionStatus));

    if (type !== null || status !== null) {
      this.facade.setFilters({ type, status });
    }
  }

  private syncUrl(): void {
    const { type, status } = this.filters();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: type ?? null, status: status ?? null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private toEnum<T extends string>(value: string | null, allowed: T[]): T | null {
    if (!value) return null;
    return (allowed as string[]).includes(value) ? (value as T) : null;
  }
}
