import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { PortfolioCommunityComponent } from '@domain/creator-portfolio/components/portfolio-community/portfolio-community.component';
import { PortfolioCredentialsComponent } from '@domain/creator-portfolio/components/portfolio-credentials/portfolio-credentials.component';
import { PortfolioHeroComponent } from '@domain/creator-portfolio/components/portfolio-hero/portfolio-hero.component';
import { PortfolioHighlightsComponent } from '@domain/creator-portfolio/components/portfolio-highlights/portfolio-highlights.component';
import { PortfolioMetricsComponent } from '@domain/creator-portfolio/components/portfolio-metrics/portfolio-metrics.component';
import { PortfolioTimelineComponent } from '@domain/creator-portfolio/components/portfolio-timeline/portfolio-timeline.component';
import { CreatorPortfolioFacade } from '@domain/creator-portfolio/services/creator-portfolio.facade';
import { CurrentUserService } from '@shared/services/current-user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-creator-portfolio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    PortfolioHeroComponent,
    PortfolioMetricsComponent,
    PortfolioTimelineComponent,
    PortfolioHighlightsComponent,
    PortfolioCredentialsComponent,
    PortfolioCommunityComponent,
  ],
  templateUrl: './creator-portfolio.component.html',
  styleUrl: './creator-portfolio.component.scss',
})
export class CreatorPortfolioComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(CreatorPortfolioFacade);
  private readonly currentUser = inject(CurrentUserService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly handle = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('handle') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('handle') ?? '' },
  );

  readonly portfolio = this.facade.portfolio;
  readonly isLoading = this.facade.isLoading;
  readonly errorKind = this.facade.errorKind;
  readonly errorMessage = this.facade.errorMessage;

  readonly isOwner = computed(() => {
    const p = this.portfolio();
    return p ? this.currentUser.isOwner(p.handle) : false;
  });

  readonly isDraftForViewer = computed(() => {
    const p = this.portfolio();
    if (!p) return false;
    return !p.isPublished;
  });

  readonly searchLink = `/${environment.ROUTES.SEARCH.ROOT}`;
  readonly resumeLink = `/${environment.ROUTES.RESUME.COMPLETE}`;

  constructor() {
    effect(() => {
      const handle = this.handle();
      if (handle) {
        this.facade.load(handle);
      }
    });

    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  onFollow(): void {
    // TODO: integrar com endpoint de follow quando existir
  }

  onContact(): void {
    // TODO: abrir Bottom Sheet de contato (Sprint Inscrição contact-flow)
  }

  onEdit(): void {
    void this.router.navigateByUrl(this.resumeLink);
  }

  onOpenHighlight(pinId: string): void {
    // TODO: navegar para /:username/watch/:titleLink quando o highlight tiver mapping
    void this.router.navigateByUrl(`/${pinId}`);
  }
}
