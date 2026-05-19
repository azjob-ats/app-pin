import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { Product } from '@shared/interfaces/entity/empresa-product';
import {
  PRODUCT_PHASE_META,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import { LearnMoreLauncherService } from '@domain/empresa/services/learn-more-launcher.service';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { ProductDetailFacade } from '@domain/empresa/services/product-detail.facade';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly context = inject(OrganizationContextService);
  private readonly facade = inject(ProductDetailFacade);
  private readonly launcher = inject(LearnMoreLauncherService);

  readonly product = this.facade.product;
  readonly isLoading = this.facade.isLoading;
  readonly isMoving = this.facade.isMoving;
  readonly error = this.facade.error;

  readonly typeMeta = computed(() => {
    const p = this.product();
    return p ? PRODUCT_TYPE_META[p.type] : null;
  });

  readonly phaseMeta = computed(() => {
    const p = this.product();
    return p && p.phase in PRODUCT_PHASE_META
      ? PRODUCT_PHASE_META[p.phase as ProductPhase]
      : null;
  });

  readonly learnMoreFields = computed(() => {
    const p = this.product();
    if (!p) return [];
    return p.learnMoreConfig.steps.flatMap((s) => s.fields);
  });

  readonly canPause = computed(() => this.product()?.phase === ProductPhase.InCampaign);
  readonly canClose = computed(() => this.product()?.phase !== ProductPhase.Closed);
  readonly canActivate = computed(() => {
    const phase = this.product()?.phase;
    return phase === ProductPhase.Paused || phase === ProductPhase.Backlog;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const id = this.route.snapshot.paramMap.get('productId');
    if (!slug || !id) {
      this.facade.reset();
      return;
    }
    if (this.context.organization()?.slug !== slug) {
      this.context.load(slug);
    }
    this.facade.load(slug, id);
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected basePath(): string {
    const slug = this.context.organization()?.slug ?? this.route.snapshot.paramMap.get('slug');
    return slug ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}` : '/empresa';
  }

  protected backToProductsLink(): string {
    return `${this.basePath()}/produtos`;
  }

  protected manageTriageLink(): string {
    const id = this.product()?.id ?? '';
    return `${this.basePath()}/triagens?productId=${id}`;
  }

  protected editLink(): string {
    return `${this.basePath()}/produtos/novo`;
  }

  protected pause(): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    this.facade.move(slug, ProductPhase.Paused);
  }

  protected close(): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    this.facade.move(slug, ProductPhase.Closed);
  }

  protected activate(): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    this.facade.move(slug, ProductPhase.InCampaign);
  }

  protected previewLearnMore(): void {
    const slug = this.context.organization()?.slug;
    const product = this.product();
    if (!slug || !product) return;
    this.launcher.open({ slug, productId: product.id, productTitle: product.title });
  }

  protected requiredLabel(required: boolean): string {
    return required ? 'obrigatório' : 'opcional';
  }

  protected trackByBlock = (_: number, block: Product['description'][number]) => block.id;
  protected trackByField = (_: number, field: { id: string }) => field.id;
  protected trackByQuestion = (
    _: number,
    q: Product['screeningQuestions'][number],
  ) => q.id;
}
