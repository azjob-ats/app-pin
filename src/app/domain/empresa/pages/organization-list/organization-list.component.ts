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
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { Organization } from '@shared/interfaces/entity/empresa-organization';
import { OrganizationListFacade } from '@domain/empresa/services/organization-list.facade';

@Component({
  selector: 'app-organization-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, EmptyStateComponent],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.scss',
})
export class OrganizationListComponent implements OnInit {
  private readonly facade = inject(OrganizationListFacade);
  private readonly router = inject(Router);

  readonly items = this.facade.items;
  readonly favorites = this.facade.favorites;
  readonly hasItems = this.facade.hasItems;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;

  readonly openMenuId = signal<string | null>(null);

  readonly newOrganizationLink = `/${environment.ROUTES.EMPRESA.NEW}`;

  readonly orderedItems = computed(() => {
    return [...this.items()].sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return a.name.localeCompare(b.name, 'pt-BR');
      return a.isFavorite ? -1 : 1;
    });
  });

  ngOnInit(): void {
    this.facade.load();
  }

  panelLink(slug: string): string {
    return `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}`;
  }

  openOrganization(org: Organization): void {
    this.router.navigateByUrl(this.panelLink(org.slug));
  }

  toggleFavorite(event: Event, org: Organization): void {
    event.stopPropagation();
    this.facade.toggleFavorite(org.slug);
  }

  toggleMenu(event: Event, org: Organization): void {
    event.stopPropagation();
    this.openMenuId.update((current) => (current === org.id ? null : org.id));
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  retry(): void {
    this.facade.load();
  }
}
