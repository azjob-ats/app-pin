import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaOrganizationApi } from '@shared/apis/empresa-organization.api';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ProductType } from '@shared/enums/product-type.enum';
import { Organization } from '@shared/interfaces/entity/empresa-organization';
import { Product } from '@shared/interfaces/entity/empresa-product';
import {
  PRODUCT_TYPES_IN_ORDER,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import { LearnMoreDrawerComponent } from '@domain/empresa/components/learn-more-drawer/learn-more-drawer.component';
import { LearnMoreLauncherService } from '@domain/empresa/services/learn-more-launcher.service';
import { catchError, EMPTY, forkJoin, tap } from 'rxjs';

interface SectionGroup {
  readonly type: ProductType;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
  readonly products: readonly Product[];
}

@Component({
  selector: 'app-organization-public',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [LearnMoreDrawerComponent],
  templateUrl: './organization-public.component.html',
  styleUrl: './organization-public.component.scss',
})
export class OrganizationPublicPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orgApi = inject(EmpresaOrganizationApi);
  private readonly productApi = inject(EmpresaProductApi);
  private readonly launcher = inject(LearnMoreLauncherService);

  readonly organization = signal<Organization | null>(null);
  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly notFound = signal<boolean>(false);

  readonly sections = computed<readonly SectionGroup[]>(() => {
    const inCampaign = this.products().filter((p) => p.phase === ProductPhase.InCampaign);
    return PRODUCT_TYPES_IN_ORDER.map((type) => {
      const meta = PRODUCT_TYPE_META[type];
      const list = inCampaign.filter((p) => p.type === type);
      return {
        type,
        label: meta.label,
        icon: meta.icon,
        color: meta.color,
        products: list,
      };
    }).filter((s) => s.products.length > 0);
  });

  readonly totalActive = computed<number>(() =>
    this.products().filter((p) => p.phase === ProductPhase.InCampaign).length,
  );

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.notFound.set(true);
      this.isLoading.set(false);
      return;
    }
    forkJoin({
      org: this.orgApi.detail(slug),
      products: this.productApi.list(slug, { page: 1, pageSize: 100 }),
    })
      .pipe(
        tap(({ org, products }) => {
          if (!org.success || !org.data) {
            this.notFound.set(true);
            this.isLoading.set(false);
            return;
          }
          this.organization.set(org.data);
          if (products.success && products.data) {
            this.products.set(products.data.data ?? []);
          }
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.notFound.set(true);
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  protected openLearnMore(product: Product): void {
    const slug = this.organization()?.slug;
    if (!slug) return;
    this.launcher.open({ slug, productId: product.id, productTitle: product.title });
  }

  protected ctaLabel(product: Product): string {
    return product.learnMoreConfig.submitButtonLabel;
  }

  protected trackProduct = (_: number, p: Product) => p.id;
}
