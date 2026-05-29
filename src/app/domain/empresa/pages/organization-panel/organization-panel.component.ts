import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { LearnMoreDrawerComponent } from '@domain/empresa/components/learn-more-drawer/learn-more-drawer.component';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { DepartmentContextService } from '@domain/empresa/services/department-context.service';

interface PanelTab {
  readonly label: string;
  readonly icon: string;
  readonly segment: string;
}

@Component({
  selector: 'app-organization-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, LearnMoreDrawerComponent],
  templateUrl: './organization-panel.component.html',
  styleUrl: './organization-panel.component.scss',
})
export class OrganizationPanelComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly context = inject(OrganizationContextService);
  private readonly deptContext = inject(DepartmentContextService);

  readonly organization = this.context.organization;
  readonly department = this.deptContext.department;
  readonly isLoading = computed(() => this.context.isLoading() || this.deptContext.isLoading());
  readonly error = computed(() => this.context.error() ?? this.deptContext.error());
  readonly listLink = `/${environment.ROUTES.EMPRESA.LIST}`;

  private readonly orgSlug = signal<string>('');
  private readonly deptSlug = signal<string>('');

  readonly departmentsLink = computed(() =>
    `/${environment.ROUTES.EMPRESA.DEPARTMENT_PATH}/${this.orgSlug()}`,
  );

  readonly tabs: readonly PanelTab[] = [
    { label: 'Gerenciar Produtos', icon: 'inventory_2', segment: 'produtos' },
    { label: 'Triagens', icon: 'view_kanban', segment: 'triagens' },
    { label: 'Página da Empresa', icon: 'language', segment: 'pagina' },
    { label: 'Pessoas & Permissões', icon: 'group', segment: 'pessoas' },
    { label: 'Creators & Grupos', icon: 'movie', segment: 'creators' },
    { label: 'Métricas', icon: 'analytics', segment: 'metricas' },
  ];

  readonly basePath = computed(() => {
    const org = this.orgSlug();
    const dept = this.deptSlug();
    return org && dept
      ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${org}/${dept}`
      : this.departmentsLink();
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const deptSlug = this.route.snapshot.paramMap.get('deptSlug') ?? '';
    this.orgSlug.set(slug);
    this.deptSlug.set(deptSlug);
    if (slug) {
      this.context.load(slug);
    }
    if (slug && deptSlug) {
      this.deptContext.load(slug, deptSlug);
    }
  }

  ngOnDestroy(): void {
    this.context.clear();
    this.deptContext.clear();
  }

  tabLink(segment: string): string {
    return `${this.basePath()}/${segment}`;
  }

  retry(): void {
    const slug = this.orgSlug();
    const deptSlug = this.deptSlug();
    if (slug) {
      this.context.clear();
      this.context.load(slug);
    }
    if (slug && deptSlug) {
      this.deptContext.clear();
      this.deptContext.load(slug, deptSlug);
    }
  }
}
