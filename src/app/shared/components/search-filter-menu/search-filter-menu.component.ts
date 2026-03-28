import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICatalog, IAttribute } from '@shared/interfaces/entity/search-filter';
import { FilterAttributeListComponent } from './filter-attribute-list/filter-attribute-list.component';
import { FilterDetailComponent } from './filter-detail/filter-detail.component';

/** Persists attribute selections per catalog key: { catalogKey → { attrKey → value } } */
type SelectionCache = Record<string, Record<string, string | string[]>>;

@Component({
  selector: 'app-search-filter-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterAttributeListComponent, FilterDetailComponent],
  templateUrl: './search-filter-menu.component.html',
  styleUrl: './search-filter-menu.component.scss',
})
export class SearchFilterMenuComponent {
  readonly catalogs = input.required<ICatalog[]>();
  readonly resultCount = input<number | null>(null);
  readonly filterChange = output<Record<string, string | string[]>>();
  readonly catalogSelect = output<ICatalog>();

  readonly selectedCatalog = signal<ICatalog | null>(null);
  readonly selectedAttribute = signal<IAttribute | null>(null);
  readonly isPanelOpen = signal(false);
  readonly currentStep = signal<0 | 1>(0);
  readonly isLoadingAttributes = signal(false);

  private readonly _selections = signal<SelectionCache>({});

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');
  private readonly chipRefs = viewChildren<ElementRef<HTMLButtonElement>>('chipBtn');

  /** Set to true during URL → state restoration to avoid writing back to URL. */
  private _restoringFromUrl = false;
  private _restoredFromUrl = false;

  constructor() {
    // Restore state from URL once catalogs are available
    effect(
      () => {
        const cats = this.catalogs();
        if (!cats.length || this._restoredFromUrl) return;

        const params = this.route.snapshot.queryParams;
        const catalogKey = params['catalog'];

        this._restoredFromUrl = true;
        if (!catalogKey) return;

        const catalog = cats.find((c) => c.key === catalogKey);
        if (!catalog) return;

        // Parse filter params from URL (all keys except 'catalog' and 'q')
        const filters: Record<string, string | string[]> = {};
        for (const [k, v] of Object.entries(params)) {
          if (k === 'catalog' || k === 'q') continue;
          const str = String(v);
          filters[k] = str.includes(',') ? str.split(',') : str;
        }

        if (Object.keys(filters).length) {
          this._selections.update((s) => ({ ...s, [catalogKey]: filters }));
        }

        // Select catalog without writing to URL (URL already has the right state)
        this._restoringFromUrl = true;
        this.selectCatalog(catalog);
        this._restoringFromUrl = false;
      },
      { allowSignalWrites: true },
    );

    // Auto-open panel when parent loads API attributes we were waiting for
    effect(() => {
      const current = this.selectedCatalog();
      if (!current || !this.isLoadingAttributes()) return;
      const updated = this.catalogs().find((c) => c.key === current.key);
      if (updated?.attributes?.length) {
        this.selectedCatalog.set(this._withSelections(updated));
        this.isLoadingAttributes.set(false);
        this.openPanel();
      }
    });

    // Scroll chip into view when selection changes
    effect(() => {
      const catalog = this.selectedCatalog();
      const chips = this.catalogs();
      const refs = this.chipRefs();
      const track = this.trackRef()?.nativeElement;
      if (!catalog || !track) return;
      const idx = chips.findIndex((c) => c.key === catalog.key);
      if (idx !== -1 && refs[idx]) {
        const chip = refs[idx].nativeElement;
        const { offsetLeft: chipLeft, offsetWidth: chipW } = chip;
        const { scrollLeft, offsetWidth } = track;
        if (chipLeft < scrollLeft) track.scrollLeft = chipLeft;
        else if (chipLeft + chipW > scrollLeft + offsetWidth)
          track.scrollLeft = chipLeft + chipW - offsetWidth;
      }
    });

    // Drag-to-scroll on chip track
    effect((onCleanup) => {
      const track = this.trackRef()?.nativeElement;
      if (!track) return;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;
      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        isDragging = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
      };
      const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        track.style.cursor = 'grab';
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const walk = e.pageX - track.offsetLeft - startX;
        if (Math.abs(walk) > 5) isDragging = true;
        track.scrollLeft = scrollLeft - walk;
      };
      const onClickCapture = (e: Event) => {
        if (isDragging) { e.stopPropagation(); isDragging = false; }
      };
      track.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      track.addEventListener('click', onClickCapture, true);
      onCleanup(() => {
        track.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        track.removeEventListener('click', onClickCapture, true);
      });
    });
  }

  // ── Public actions ────────────────────────────────────────────────────────

  selectCatalog(catalog: ICatalog): void {
    const isSame = this.selectedCatalog()?.key === catalog.key;
    this.selectedCatalog.set(this._withSelections(catalog));
    this.catalogSelect.emit(catalog);

    const hasAttributes = catalog.attributes && catalog.attributes.length > 0;

    if (!hasAttributes) {
      if (catalog.attributesSource === 'api') {
        this.isLoadingAttributes.set(true);
        this.isPanelOpen.set(true);
        this.currentStep.set(0);
        if (!this._restoringFromUrl) this._syncUrl(catalog.key);
      } else {
        this.closePanel();
      }
      return;
    }

    this.isLoadingAttributes.set(false);

    if (isSame && this.isPanelOpen()) {
      // Toggle close — keep URL so the state is preserved for sharing
      this.closePanel();
    } else {
      this.openPanel();
      if (!this._restoringFromUrl) this._syncUrl(catalog.key);
    }
  }

  openPanel(): void {
    this.currentStep.set(0);
    this.selectedAttribute.set(null);
    this.isPanelOpen.set(true);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.currentStep.set(0);
    this.selectedAttribute.set(null);
  }

  goToAttribute(attribute: IAttribute): void {
    this.selectedAttribute.set(attribute);
    this.currentStep.set(1);
  }

  goBack(): void {
    this.currentStep.set(0);
    this.selectedAttribute.set(null);
  }

  onFilterValue(value: string | string[]): void {
    const attr = this.selectedAttribute();
    if (!attr) return;
    const catalog = this.selectedCatalog();
    if (!catalog?.attributes) return;

    // Persist to selection cache
    this._selections.update((s) => ({
      ...s,
      [catalog.key]: { ...(s[catalog.key] ?? {}), [attr.key]: value },
    }));

    // Update local signals
    const updatedAttributes = catalog.attributes.map((a) =>
      a.key === attr.key ? { ...a, selectedValue: value } : a,
    );
    this.selectedCatalog.set({ ...catalog, attributes: updatedAttributes });
    this.selectedAttribute.set({ ...attr, selectedValue: value });

    // Reflect in URL
    this._syncUrl(catalog.key);

    // Emit aggregated active filters to parent
    const filters: Record<string, string | string[]> = {};
    for (const a of updatedAttributes) {
      const v = a.selectedValue;
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
      filters[a.key] = v;
    }
    this.filterChange.emit(filters);
  }

  onResetAttribute(): void {
    const attr = this.selectedAttribute();
    if (!attr) return;
    this.onFilterValue(attr.filterComponent.type === 'checkbox' ? [] : '');
  }

  isActive(catalog: ICatalog): boolean {
    return this.selectedCatalog()?.key === catalog.key && this.isPanelOpen();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /** Merges saved selections into catalog's attributes (non-mutating). */
  private _withSelections(catalog: ICatalog): ICatalog {
    const saved = this._selections()[catalog.key];
    if (!saved || !catalog.attributes?.length) return catalog;
    return {
      ...catalog,
      attributes: catalog.attributes.map((attr) => {
        const v = saved[attr.key];
        return v !== undefined ? { ...attr, selectedValue: v } : attr;
      }),
    };
  }

  /**
   * Writes current catalog key + its filter selections to the URL query params.
   * Preserves the `q` (search query) param and replaces everything else.
   */
  private _syncUrl(catalogKey: string): void {
    const q = this.route.snapshot.queryParams['q'] ?? null;
    const saved = this._selections()[catalogKey] ?? {};

    const filterParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(saved)) {
      if (Array.isArray(v) && v.length === 0) continue;
      if (v === '') continue;
      filterParams[k] = Array.isArray(v) ? v.join(',') : v;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q, catalog: catalogKey, ...filterParams },
      replaceUrl: true,
    });
  }
}
