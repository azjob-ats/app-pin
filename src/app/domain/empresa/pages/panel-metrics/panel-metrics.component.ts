import { DecimalPipe, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { ProductType } from '@shared/enums/product-type.enum';
import { PRODUCT_TYPE_META } from '@domain/empresa/constants/product-presets';
import { MetricsFacade } from '@domain/empresa/services/metrics.facade';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';

@Component({
  selector: 'app-panel-metrics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DecimalPipe, PercentPipe, RouterLink],
  templateUrl: './panel-metrics.component.html',
  styleUrl: './panel-metrics.component.scss',
})
export class PanelMetricsComponent implements OnDestroy {
  protected readonly context = inject(OrganizationContextService);
  private readonly facade = inject(MetricsFacade);

  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly funnel = this.facade.funnel;
  readonly performanceByType = this.facade.performanceByType;
  readonly performanceByProduct = this.facade.performanceByProduct;
  readonly eligibleForSponsored = this.facade.eligibleForSponsored;

  readonly typeMeta = PRODUCT_TYPE_META;

  constructor() {
    effect(() => {
      const slug = this.context.organization()?.slug;
      if (slug && this.facade.products().length === 0 && !this.isLoading()) {
        this.facade.load(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected sponsorLink(productId: string): string {
    return `/${environment.ROUTES.SPONSORED_CAMPAIGNS.NEW}?productId=${productId}`;
  }

  protected typeLabel(type: ProductType): string {
    return PRODUCT_TYPE_META[type].label;
  }

  protected trackByType = (_: number, p: { type: ProductType }) => p.type;
  protected trackByProductId = (_: number, p: { product: { id: string } }) => p.product.id;
}
