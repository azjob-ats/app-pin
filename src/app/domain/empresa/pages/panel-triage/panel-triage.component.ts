import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { ProductType } from '@shared/enums/product-type.enum';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import {
  KanbanBoardComponent,
  KanbanColumn,
  KanbanMoveEvent,
} from '@domain/empresa/components/kanban-board/kanban-board.component';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import { SubmissionCardComponent } from '@domain/empresa/components/submission-card/submission-card.component';
import {
  PRODUCT_TYPES_IN_ORDER,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import { pipelineFor } from '@domain/empresa/constants/submission-pipelines';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { SubmissionListFacade } from '@domain/empresa/services/submission-list.facade';
import { SubmissionTypeFilter } from '@domain/empresa/services/submission-list.store';

interface TypeTab {
  readonly value: SubmissionTypeFilter;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
}

@Component({
  selector: 'app-panel-triage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [KanbanBoardComponent, SubmissionCardComponent, EmpresaPageHeaderComponent],
  templateUrl: './panel-triage.component.html',
  styleUrl: './panel-triage.component.scss',
})
export class PanelTriageComponent implements OnDestroy {
  private readonly context = inject(OrganizationContextService);
  private readonly facade = inject(SubmissionListFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly items = this.facade.items;
  readonly filteredItems = this.facade.filteredItems;
  readonly typeFilter = this.facade.typeFilter;
  readonly productIdFilter = this.facade.productIdFilter;
  readonly searchTerm = this.facade.searchTerm;
  readonly countByType = this.facade.countByType;
  readonly productOptions = this.facade.productOptions;
  readonly movingIds = this.facade.movingIds;

  readonly typeTabs = computed<readonly TypeTab[]>(() => {
    const tabs: TypeTab[] = [
      { value: 'all', label: 'Todas', icon: 'grid_view', color: '#0f172a' },
    ];
    for (const type of PRODUCT_TYPES_IN_ORDER) {
      const meta = PRODUCT_TYPE_META[type];
      tabs.push({ value: type, label: meta.label, icon: meta.icon, color: meta.color });
    }
    return tabs;
  });

  readonly hasTypeSelected = computed<boolean>(() => this.typeFilter() !== 'all');

  readonly columns = computed<readonly KanbanColumn[]>(() => {
    const type = this.typeFilter();
    if (type === 'all') return [];
    return pipelineFor(type as ProductType).map((meta) => ({
      id: meta.id,
      label: meta.label,
      color: meta.color,
    }));
  });

  readonly getColumnKey = (item: Submission): string => item.phase as string;
  readonly getItemId = (item: Submission): string => item.id;
  readonly canCreateInPhase = (_: string): boolean => false;
  readonly isMovingItem = (id: string): boolean => this.movingIds().has(id);

  constructor() {
    // Load + apply query param ?productId=
    effect(() => {
      const slug = this.context.organization()?.slug;
      if (slug && this.items().length === 0 && !this.isLoading()) {
        this.facade.load(slug);
      }
    });

    // Apply ?productId= once items are loaded; infer type filter from the matched product.
    effect(() => {
      const productIdParam = this.route.snapshot.queryParamMap.get('productId');
      if (!productIdParam) return;
      const items = this.items();
      if (items.length === 0) return;
      if (this.productIdFilter() === productIdParam) return;
      const matched = items.find((s) => s.productId === productIdParam);
      this.facade.setProductIdFilter(productIdParam);
      if (matched && this.typeFilter() === 'all') {
        this.facade.setTypeFilter(matched.productType);
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected setTypeFilter(filter: SubmissionTypeFilter): void {
    this.facade.setTypeFilter(filter);
  }

  protected onSearchInput(event: Event): void {
    this.facade.setSearchTerm((event.target as HTMLInputElement).value);
  }

  protected onProductSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.facade.setProductIdFilter(value || null);
  }

  protected clearFilters(): void {
    this.facade.setTypeFilter('all');
    this.facade.setProductIdFilter(null);
    this.facade.setSearchTerm('');
  }

  protected onItemMoved(event: KanbanMoveEvent<Submission>): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    this.facade.move(slug, event.item, event.toColumnId as SubmissionPhase);
  }

  protected onSubmissionClicked(submission: Submission): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    const url = `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}/triagens/${submission.id}`;
    this.router.navigateByUrl(url);
  }
}
