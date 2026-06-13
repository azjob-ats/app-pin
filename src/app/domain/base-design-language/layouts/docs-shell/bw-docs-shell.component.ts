import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import {
  BuiAppNavBar,
  NavItem as AppNavItem,
} from '../../components/app-nav-bar/app-nav-bar.component';
import {
  BuiSideNav,
  NavChangeEvent,
  NavItem as SideNavItem,
} from '../../components/side-navigation/side-navigation.component';
import { BuiCombobox } from '../../components/combobox/combobox.component';
import { BW_NAV } from '../../navigation/nav.data';
import { BW_STORIES } from '../../ladle/stories.registry';
import { BwNavCategory } from '../../navigation/nav.model';
import { BwThemeService } from '../../shared/bw-theme.service';

interface SearchItem {
  label: string;
  itemId: string;
}

function buildSideNavItems(): SideNavItem[] {
  return BW_NAV.map((category) => {
    if (category.groups.length === 0) {
      return { title: category.label };
    }
    if (category.label === 'Components') {
      return buildComponentsCategory(category);
    }
    const hasDistinctGroups = category.groups.some((g) => g.label !== category.label);
    const subNav = hasDistinctGroups
      ? category.groups.map((g) => ({
          title: g.label,
          subNav: g.items.map((item) => ({
            title: item.label,
            itemId: item.path === '' ? '/bw' : `/bw/${item.path}`,
          })),
        }))
      : category.groups.flatMap((g) =>
          g.items.map((item) => ({
            title: item.label,
            itemId: item.path === '' ? '/bw' : `/bw/${item.path}`,
          })),
        );
    return { title: category.label, subNav };
  });
}

function buildComponentsCategory(category: BwNavCategory): SideNavItem {
  const subNav = category.groups.flatMap((g) =>
    g.items.map((item) => {
      const slug = item.path.replace('components/', '');
      const stories = BW_STORIES.filter((s) => s.group === slug);
      return {
        title: item.label,
        subNav: stories.length
          ? stories.map((s) => ({
              title: s.name,
              itemId: `/bw/components?story=${s.id}`,
            }))
          : undefined,
      } as SideNavItem;
    }),
  );
  return { title: category.label, subNav };
}

function buildSearchItems(): SearchItem[] {
  // Páginas de categorias não-componentes (têm rotas reais)
  const navItems: SearchItem[] = BW_NAV.filter((cat) => cat.label !== 'Components').flatMap(
    (cat) =>
      cat.groups.flatMap((g) =>
        g.items.map((item) => ({
          label: item.label,
          itemId: item.path === '' ? '/bw' : `/bw/${item.path}`,
        })),
      ),
  );

  // Componentes: mapeia para a primeira story disponível do grupo
  const componentItems: SearchItem[] = BW_NAV.filter((cat) => cat.label === 'Components').flatMap(
    (cat) =>
      cat.groups.flatMap((g) =>
        g.items.flatMap((item) => {
          const slug = item.path.replace('components/', '');
          const firstStory = BW_STORIES.find((s) => s.group === slug);
          return firstStory
            ? [{ label: item.label, itemId: `/bw/components?story=${firstStory.id}` }]
            : [];
        }),
      ),
  );

  // Stories individuais
  const storyItems: SearchItem[] = BW_STORIES.map((s) => ({
    label: s.name,
    itemId: `/bw/components?story=${s.id}`,
  }));

  return [...navItems, ...componentItems, ...storyItems];
}

@Component({
  selector: 'bdl-docs-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, BuiAppNavBar, BuiSideNav, BuiCombobox],
  templateUrl: './bw-docs-shell.component.html',
  styleUrl: './bw-docs-shell.component.scss',
  host: {
    class: 'bw-root bdl-docs-shell',
    '[attr.data-bw-theme]': 'mode()',
    '[attr.dir]': 'direction()',
  },
})
export class BwDocsShellComponent {
  private readonly theme = inject(BwThemeService);
  private readonly router = inject(Router);

  protected readonly mode = this.theme.mode;
  protected readonly direction = this.theme.direction;
  protected readonly navOpen = signal(false);

  protected readonly navItems: SideNavItem[] = buildSideNavItems();

  protected readonly topItems: AppNavItem[] = [
    { label: 'theme', info: 'theme' },
  ];

  protected readonly navItemTpl =
    viewChild<TemplateRef<{ $implicit: AppNavItem }>>('navItemTpl');

  private readonly allSearchItems = buildSearchItems();
  protected readonly searchQuery = signal('');

  protected readonly filteredSearchItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allSearchItems;
    return this.allSearchItems.filter((item) =>
      item.label.toLowerCase().includes(q),
    );
  });

  protected readonly getSearchLabel = (item: unknown) =>
    (item as SearchItem).label;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.normalizeUrl(this.router.url)),
      startWith(this.normalizeUrl(this.router.url)),
    ),
    { initialValue: this.normalizeUrl(this.router.url) },
  );

  protected readonly activeItemId = this.currentUrl;

  protected toggleMode(): void {
    this.theme.toggleMode();
  }

  protected toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  protected onSearchSelect(item: unknown): void {
    const { itemId } = item as SearchItem;
    const [path, query] = itemId.split('?');
    if (query) {
      const params = new URLSearchParams(query);
      const story = params.get('story');
      void this.router.navigate([path], { queryParams: story ? { story } : {} });
    } else {
      void this.router.navigateByUrl(itemId);
    }
  }

  protected onNavChange(event: NavChangeEvent): void {
    const id = event.item.itemId;
    if (!id) return;
    const [path, query] = id.split('?');
    if (query) {
      const params = new URLSearchParams(query);
      const story = params.get('story');
      void this.router.navigate([path], { queryParams: story ? { story } : {} });
    } else {
      void this.router.navigateByUrl(id);
    }
    this.closeNav();
  }

  private normalizeUrl(url: string): string {
    const [path, query] = url.split('?');
    if (path === '/bw/components' && query) {
      const params = new URLSearchParams(query);
      const story = params.get('story');
      return story ? `/bw/components?story=${story}` : path;
    }
    return path;
  }
}
