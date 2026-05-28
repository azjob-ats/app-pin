import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { Organization } from '@shared/interfaces/entity/empresa-organization';
import { OrganizationListFacade } from '@domain/empresa/services/organization-list.facade';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import {
  EmpresaOrgCardComponent,
  OrgCardMenuAction,
} from '@domain/empresa/components/empresa-org-card/empresa-org-card.component';

@Component({
  selector: 'app-organization-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, EmpresaPageHeaderComponent, EmpresaOrgCardComponent],
  host: {
    '(document:click)': 'closeMenu()',
    '(document:keydown.escape)': 'closeMenu()',
  },
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.scss',
})
export class OrganizationListComponent implements OnInit {
  private readonly facade = inject(OrganizationListFacade);
  private readonly router = inject(Router);

  readonly items = this.facade.items;
  readonly hasItems = this.facade.hasItems;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;

  readonly openMenuId = signal<string | null>(null);

  readonly newOrganizationLink = `/${environment.ROUTES.EMPRESA.NEW}`;

  readonly orderedItems = computed(() =>
    [...this.items()].sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return a.name.localeCompare(b.name, 'pt-BR');
      return a.isFavorite ? -1 : 1;
    }),
  );

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  ngOnInit(): void {
    this.facade.load();
  }

  openOrganization(org: Organization): void {
    this.router.navigateByUrl(`/${environment.ROUTES.EMPRESA.PANEL_PATH}/${org.slug}`);
  }

  toggleFavorite(org: Organization): void {
    this.facade.toggleFavorite(org.slug);
  }

  toggleMenu(org: Organization): void {
    this.openMenuId.update((current) => (current === org.id ? null : org.id));
  }

  onMenuAction(action: OrgCardMenuAction, org: Organization): void {
    this.openMenuId.set(null);
    // TODO: wire actual menu actions (members route, leave membership, delete org)
    void action;
    void org;
  }

  retry(): void {
    this.facade.load();
  }
}
