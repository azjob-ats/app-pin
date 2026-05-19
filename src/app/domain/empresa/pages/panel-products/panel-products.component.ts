import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { ProductType } from '@shared/enums/product-type.enum';
import { Product } from '@shared/interfaces/entity/empresa-product';
import {
  KanbanBoardComponent,
  KanbanColumn,
  KanbanMoveEvent,
} from '@domain/empresa/components/kanban-board/kanban-board.component';
import { ProductCardComponent } from '@domain/empresa/components/product-card/product-card.component';
import {
  DEFAULT_PRODUCT_PHASE_ORDER,
  PRODUCT_PHASE_META,
  PRODUCT_TYPES_IN_ORDER,
  PRODUCT_TYPE_META,
} from '@domain/empresa/constants/product-presets';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { ProductListFacade } from '@domain/empresa/services/product-list.facade';
import { ProductTypeFilter } from '@domain/empresa/services/product-list.store';

interface TypeTab {
  readonly value: ProductTypeFilter;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
}

@Component({
  selector: 'app-panel-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, KanbanBoardComponent, ProductCardComponent],
  templateUrl: './panel-products.component.html',
  styleUrl: './panel-products.component.scss',
})
export class PanelProductsComponent implements OnDestroy {
  private readonly context = inject(OrganizationContextService);
  private readonly facade = inject(ProductListFacade);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly filteredItems = this.facade.filteredItems;
  readonly typeFilter = this.facade.typeFilter;
  readonly countByType = this.facade.countByType;
  readonly customPhases = this.facade.customPhases;
  readonly movingIds = this.facade.movingIds;

  readonly typeTabs = computed<readonly TypeTab[]>(() => {
    const tabs: TypeTab[] = [
      { value: 'all', label: 'Todos', icon: 'grid_view', color: '#0f172a' },
    ];
    for (const type of PRODUCT_TYPES_IN_ORDER) {
      const meta = PRODUCT_TYPE_META[type];
      tabs.push({ value: type, label: meta.label, icon: meta.icon, color: meta.color });
    }
    return tabs;
  });

  readonly columns = computed<readonly KanbanColumn[]>(() => {
    const standard: KanbanColumn[] = DEFAULT_PRODUCT_PHASE_ORDER.map((phase) => {
      const meta = PRODUCT_PHASE_META[phase];
      return {
        id: phase,
        label: meta.label,
        color: meta.color,
        description: meta.description,
        canCreate: phase === 'backlog',
      };
    });
    const extras: KanbanColumn[] = this.customPhases().map((p) => ({
      id: p.id,
      label: p.label,
      color: p.color,
    }));
    return [...standard, ...extras];
  });

  readonly showNewPhaseModal = signal<boolean>(false);

  readonly newPhaseForm = this.fb.nonNullable.group({
    label: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    color: ['#0ea5e9'],
  });

  readonly getColumnKey = (item: Product): string => item.phase as string;
  readonly getItemId = (item: Product): string => item.id;
  readonly canCreateInPhase = (columnId: string): boolean => columnId === 'backlog';
  readonly isMovingItem = (itemId: string): boolean => this.movingIds().has(itemId);

  constructor() {
    effect(() => {
      const slug = this.context.organization()?.slug;
      if (slug) {
        this.facade.load(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected setTypeFilter(filter: ProductTypeFilter): void {
    this.facade.setTypeFilter(filter);
  }

  protected onItemMoved(event: KanbanMoveEvent<Product>): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    this.facade.move(slug, event.item, event.toColumnId);
  }

  protected openNewPhaseModal(): void {
    this.newPhaseForm.reset({ label: '', color: '#0ea5e9' });
    this.showNewPhaseModal.set(true);
  }

  protected closeNewPhaseModal(): void {
    this.showNewPhaseModal.set(false);
  }

  protected submitNewPhase(): void {
    if (this.newPhaseForm.invalid) {
      this.newPhaseForm.markAllAsTouched();
      return;
    }
    const { label, color } = this.newPhaseForm.getRawValue();
    const id = `custom-${Date.now()}`;
    this.facade.addCustomPhase({ id, label, color });
    this.showNewPhaseModal.set(false);
  }

  protected onCreateInPhase(_columnId: string): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    const url = `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}/produtos/novo`;
    this.router.navigateByUrl(url);
  }

  protected onProductClicked(product: Product): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    const url = `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}/produtos/${product.id}`;
    this.router.navigateByUrl(url);
  }
}
