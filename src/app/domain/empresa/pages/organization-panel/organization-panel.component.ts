import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { LearnMoreDrawerComponent } from '@domain/empresa/components/learn-more-drawer/learn-more-drawer.component';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';

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

  readonly organization = this.context.organization;
  readonly isLoading = this.context.isLoading;
  readonly error = this.context.error;
  readonly listLink = `/${environment.ROUTES.EMPRESA.LIST}`;

  readonly tabs: readonly PanelTab[] = [
    { label: 'Gerenciar Produtos', icon: 'inventory_2', segment: 'produtos' },
    { label: 'Triagens', icon: 'view_kanban', segment: 'triagens' },
    { label: 'Página da Empresa', icon: 'language', segment: 'pagina' },
    { label: 'Pessoas & Permissões', icon: 'group', segment: 'pessoas' },
    { label: 'Creators & Grupos', icon: 'movie', segment: 'creators' },
    { label: 'Métricas', icon: 'analytics', segment: 'metricas' },
  ];

  readonly basePath = computed(() => {
    const slug = this.organization()?.slug;
    return slug ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}` : this.listLink;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.context.load(slug);
    }
  }

  ngOnDestroy(): void {
    this.context.clear();
  }

  tabLink(segment: string): string {
    return `${this.basePath()}/${segment}`;
  }

  retry(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.context.clear();
      this.context.load(slug);
    }
  }
}
