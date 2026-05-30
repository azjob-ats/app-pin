import { computed, inject, Injectable, signal } from '@angular/core';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { EmpresaSubmissionApi } from '@shared/apis/empresa-submission.api';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ProductType } from '@shared/enums/product-type.enum';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import { catchError, EMPTY, finalize, forkJoin, tap } from 'rxjs';

export interface TypePerformance {
  readonly type: ProductType;
  readonly products: number;
  readonly activeProducts: number;
  readonly views: number;
  readonly submissions: number;
  readonly conversionRate: number; // submissions / views (0-1)
}

export interface ProductPerformance {
  readonly product: Product;
  readonly submissions: number;
  readonly conversionRate: number;
}

export interface FunnelKpis {
  readonly totalProducts: number;
  readonly activeProducts: number;
  readonly totalViews: number;
  readonly totalSubmissions: number;
  readonly overallConversionRate: number;
}

/** Minimal eligibility for paid promotion: active + min views + min submissions. */
const ELIGIBLE_MIN_VIEWS = 100;
const ELIGIBLE_MIN_SUBMISSIONS = 1;

@Injectable({ providedIn: 'root' })
export class MetricsFacade {
  private readonly productApi = inject(EmpresaProductApi);
  private readonly submissionApi = inject(EmpresaSubmissionApi);

  readonly products = signal<Product[]>([]);
  readonly submissions = signal<Submission[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly funnel = computed<FunnelKpis>(() => {
    const products = this.products();
    const active = products.filter((p) => p.phase === ProductPhase.InCampaign).length;
    const views = products.reduce((acc, p) => acc + p.metrics.views, 0);
    const submissions = this.submissions().length;
    return {
      totalProducts: products.length,
      activeProducts: active,
      totalViews: views,
      totalSubmissions: submissions,
      overallConversionRate: views > 0 ? submissions / views : 0,
    };
  });

  readonly performanceByType = computed<readonly TypePerformance[]>(() => {
    const subsByType = new Map<ProductType, number>();
    for (const s of this.submissions()) {
      subsByType.set(s.productType, (subsByType.get(s.productType) ?? 0) + 1);
    }
    const result: TypePerformance[] = [];
    const seen = new Set<ProductType>();
    for (const p of this.products()) {
      if (seen.has(p.type)) continue;
      seen.add(p.type);
      const typed = this.products().filter((x) => x.type === p.type);
      const activeCount = typed.filter((x) => x.phase === ProductPhase.InCampaign).length;
      const views = typed.reduce((acc, x) => acc + x.metrics.views, 0);
      const submissions = subsByType.get(p.type) ?? 0;
      result.push({
        type: p.type,
        products: typed.length,
        activeProducts: activeCount,
        views,
        submissions,
        conversionRate: views > 0 ? submissions / views : 0,
      });
    }
    return result.sort((a, b) => b.submissions - a.submissions);
  });

  readonly performanceByProduct = computed<readonly ProductPerformance[]>(() => {
    const subsByProduct = new Map<string, number>();
    for (const s of this.submissions()) {
      subsByProduct.set(s.productId, (subsByProduct.get(s.productId) ?? 0) + 1);
    }
    return this.products()
      .map((product) => {
        const submissions = subsByProduct.get(product.id) ?? 0;
        const views = product.metrics.views;
        return {
          product,
          submissions,
          conversionRate: views > 0 ? submissions / views : 0,
        };
      })
      .sort((a, b) => b.submissions - a.submissions);
  });

  readonly eligibleForSponsored = computed<readonly ProductPerformance[]>(() => {
    return this.performanceByProduct().filter(
      ({ product, submissions }) =>
        product.phase === ProductPhase.InCampaign &&
        product.metrics.views >= ELIGIBLE_MIN_VIEWS &&
        submissions >= ELIGIBLE_MIN_SUBMISSIONS,
    );
  });

  load(slug: string, departmentSlug?: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    const department = departmentSlug || undefined;
    forkJoin({
      products: this.productApi.list(slug, { page: 1, pageSize: 200, department }),
      submissions: this.submissionApi.list(slug, { page: 1, pageSize: 500, department }),
    })
      .pipe(
        tap(({ products, submissions }) => {
          if (products.success && products.data) {
            this.products.set(products.data.data ?? []);
          }
          if (submissions.success && submissions.data) {
            this.submissions.set(submissions.data.data ?? []);
          }
        }),
        catchError(() => {
          this.error.set('Não foi possível carregar as métricas.');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }

  reset(): void {
    this.products.set([]);
    this.submissions.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
