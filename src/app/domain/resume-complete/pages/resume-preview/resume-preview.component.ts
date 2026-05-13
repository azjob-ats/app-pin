import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { PortfolioCommunityComponent } from '@domain/creator-portfolio/components/portfolio-community/portfolio-community.component';
import { PortfolioCredentialsComponent } from '@domain/creator-portfolio/components/portfolio-credentials/portfolio-credentials.component';
import { PortfolioHeroComponent } from '@domain/creator-portfolio/components/portfolio-hero/portfolio-hero.component';
import { PortfolioTimelineComponent } from '@domain/creator-portfolio/components/portfolio-timeline/portfolio-timeline.component';
import { ResumeFacade } from '@domain/resume-complete/services/resume.facade';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';
import { CurrentUserService } from '@shared/services/current-user.service';

@Component({
  selector: 'app-resume-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    PortfolioHeroComponent,
    PortfolioTimelineComponent,
    PortfolioCredentialsComponent,
    PortfolioCommunityComponent,
  ],
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.scss',
})
export class ResumePreviewComponent {
  private readonly facade = inject(ResumeFacade);
  private readonly currentUser = inject(CurrentUserService);
  private readonly router = inject(Router);

  readonly isLoading = this.facade.isLoading;
  readonly draft = this.facade.draft;

  readonly completeLink = `/${environment.ROUTES.RESUME.COMPLETE}`;

  readonly portfolioPreview = computed<CreatorPortfolio | null>(() => {
    const draft = this.draft();
    if (!draft) return null;
    const handle = this.currentUser.currentHandle();
    return {
      handle,
      username: draft.payload.handle ?? null,
      displayName: draft.payload.displayName ?? (handle === 'currentuser' ? 'Você' : handle),
      headline: draft.payload.headline ?? 'Pré-visualização do portfólio',
      avatarUrl: draft.payload.avatarUrl ?? 'https://i.pravatar.cc/240?img=10',
      coverUrl: draft.payload.coverUrl ?? 'https://picsum.photos/seed/preview-cover/1600/520',
      about: draft.payload.about,
      pronoun: draft.payload.pronoun,
      isPcd: draft.payload.isPcd,
      pcdNotes: draft.payload.pcdNotes,
      contact: draft.payload.contact,
      metrics: {
        totalContents: 0,
        averageRetention: 0,
        conversionRate: 0,
        rankingVertical: null,
        totalViews: 0,
      },
      experiences: draft.payload.experiences,
      educations: draft.payload.educations,
      skills: draft.payload.skills,
      languages: draft.payload.languages,
      certifications: draft.payload.certifications,
      highlights: [],
      community: { followers: 0, supportsDM: false },
      socials: [],
      isPublished: draft.isPublished,
    };
  });

  constructor() {
    this.facade.load();
  }

  back(): void {
    void this.router.navigateByUrl(this.completeLink);
  }
}
