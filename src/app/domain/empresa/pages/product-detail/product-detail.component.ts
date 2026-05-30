import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { ProductEligibilityMode } from '@shared/enums/product-eligibility-mode.enum';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { CreatorGroup, OrganizationCreator } from '@shared/interfaces/entity/empresa-creator';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import {
  PRODUCT_PHASE_META,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import { CreatorFacade } from '@domain/empresa/services/creator.facade';
import { LearnMoreLauncherService } from '@domain/empresa/services/learn-more-launcher.service';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { ProductDetailFacade } from '@domain/empresa/services/product-detail.facade';
import { SubmissionListFacade } from '@domain/empresa/services/submission-list.facade';

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
  private readonly submissionFacade = inject(SubmissionListFacade);
  private readonly creatorFacade = inject(CreatorFacade);
  private readonly launcher = inject(LearnMoreLauncherService);

  readonly product = this.facade.product;
  readonly isLoading = this.facade.isLoading;
  readonly isMoving = this.facade.isMoving;
  readonly error = this.facade.error;

  readonly EligibilityMode = ProductEligibilityMode;
  protected readonly creators = this.creatorFacade.creators;
  protected readonly creatorGroups = this.creatorFacade.groups;

  readonly sourceFilter = signal<string>('all');

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

  readonly eligibility = computed(() => this.product()?.eligibility ?? null);

  readonly eligibleCreators = computed<OrganizationCreator[]>(() => {
    const e = this.eligibility();
    if (!e || e.mode !== ProductEligibilityMode.Creators) return [];
    const set = new Set(e.creatorIds);
    return this.creators().filter((c) => set.has(c.id));
  });

  readonly eligibleGroups = computed<CreatorGroup[]>(() => {
    const e = this.eligibility();
    if (!e || e.mode !== ProductEligibilityMode.Groups) return [];
    const set = new Set(e.groupIds);
    return this.creatorGroups().filter((g) => set.has(g.id));
  });

  readonly productSubmissions = computed<Submission[]>(() => {
    const id = this.product()?.id;
    if (!id) return [];
    return this.submissionFacade.items().filter((s) => s.productId === id);
  });

  // Creators que aparecem como origem (atribuição) nas inscrições deste produto.
  readonly submissionCreators = computed<Array<{ id: string; name: string; handle: string }>>(() => {
    const map = new Map<string, { id: string; name: string; handle: string }>();
    for (const s of this.productSubmissions()) {
      if (s.source) {
        map.set(s.source.creatorId, {
          id: s.source.creatorId,
          name: s.source.creatorName,
          handle: s.source.creatorHandle,
        });
      }
    }
    return [...map.values()];
  });

  readonly filteredSubmissions = computed<Submission[]>(() => {
    const base = this.productSubmissions();
    const f = this.sourceFilter();
    if (f === 'all') return base;
    if (f.startsWith('creator:')) {
      const id = f.slice('creator:'.length);
      return base.filter((s) => s.source?.creatorId === id);
    }
    if (f.startsWith('group:')) {
      const gid = f.slice('group:'.length);
      const group = this.creatorGroups().find((g) => g.id === gid);
      const set = new Set(group?.creatorIds ?? []);
      return base.filter((s) => s.source != null && set.has(s.source.creatorId));
    }
    return base;
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
    this.submissionFacade.load(slug);
    this.creatorFacade.load(slug);
  }

  ngOnDestroy(): void {
    this.facade.reset();
    this.submissionFacade.reset();
    this.creatorFacade.reset();
  }

  protected onSourceFilterChange(event: Event): void {
    this.sourceFilter.set((event.target as HTMLSelectElement).value);
  }

  protected sourceLabel(submission: Submission): string {
    const s = submission.source;
    return s ? `${s.creatorName} (@${s.creatorHandle})` : 'Direto / sem atribuição';
  }

  protected submissionLink(id: string): string {
    return `${this.basePath()}/triagens/${id}`;
  }

  protected trackSubmission = (_: number, s: Submission): string => s.id;
  protected trackEligCreator = (_: number, c: OrganizationCreator): string => c.id;
  protected trackEligGroup = (_: number, g: CreatorGroup): string => g.id;

  protected basePath(): string {
    const slug = this.context.organization()?.slug ?? this.route.snapshot.paramMap.get('slug');
    const deptSlug = this.route.snapshot.paramMap.get('deptSlug');
    return slug && deptSlug
      ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}/${deptSlug}`
      : '/empresa';
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
