import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { Department } from '@shared/interfaces/entity/empresa-department';
import { DepartmentListFacade } from '@domain/empresa/services/department-list.facade';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import { PanelPageComponent } from '@domain/empresa/pages/panel-page/panel-page.component';
import {
  EmpresaDeptCardComponent,
  DeptCardMenuAction,
} from '@domain/empresa/components/empresa-dept-card/empresa-dept-card.component';

type HomeTab = 'departamentos' | 'pagina';

@Component({
  selector: 'app-department-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, EmpresaPageHeaderComponent, EmpresaDeptCardComponent, PanelPageComponent],
  host: {
    '(document:click)': 'closeMenu()',
    '(document:keydown.escape)': 'closeMenu()',
  },
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit {
  private readonly facade = inject(DepartmentListFacade);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly items = this.facade.items;
  readonly hasItems = this.facade.hasItems;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly organization = this.orgContext.organization;

  readonly openMenuId = signal<string | null>(null);
  readonly activeTab = signal<HomeTab>('departamentos');

  private readonly orgSlug = signal<string>('');

  readonly listLink = `/${environment.ROUTES.EMPRESA.LIST}`;
  readonly newDepartmentLink = computed(() =>
    `/${environment.ROUTES.EMPRESA.DEPARTMENT_NEW.replace(':slug', this.orgSlug())}`,
  );

  readonly orderedItems = computed(() =>
    [...this.items()].sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return a.name.localeCompare(b.name, 'pt-BR');
      return a.isFavorite ? -1 : 1;
    }),
  );

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.orgSlug.set(slug);
    if (this.route.snapshot.queryParamMap.get('tab') === 'pagina') {
      this.activeTab.set('pagina');
    }
    if (slug) {
      this.orgContext.load(slug);
      this.facade.load(slug);
    }
  }

  setTab(tab: HomeTab): void {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: tab === 'departamentos' ? {} : { tab },
      replaceUrl: true,
    });
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  openDepartment(dept: Department): void {
    this.router.navigateByUrl(
      `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${this.orgSlug()}/${dept.slug}`,
    );
  }

  toggleFavorite(dept: Department): void {
    this.facade.toggleFavorite(this.orgSlug(), dept.slug);
  }

  toggleMenu(dept: Department): void {
    this.openMenuId.update((current) => (current === dept.id ? null : dept.id));
  }

  onMenuAction(action: DeptCardMenuAction, dept: Department): void {
    this.openMenuId.set(null);
    // TODO: wire department menu actions (edit, delete)
    void action;
    void dept;
  }

  retry(): void {
    if (this.orgSlug()) {
      this.facade.load(this.orgSlug());
    }
  }
}
