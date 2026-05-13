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
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ResumeProgressBarComponent } from '@domain/resume-complete/components/resume-progress-bar/resume-progress-bar.component';
import { ResumeTrackNodeComponent } from '@domain/resume-complete/components/resume-track-node/resume-track-node.component';
import { TrackBottomSheetComponent } from '@domain/resume-complete/components/track-bottom-sheet/track-bottom-sheet.component';
import { ResumeFacade } from '@domain/resume-complete/services/resume.facade';
import {
  RESUME_TRACKS,
  ResumeTrackDefinition,
  findTrackDefinition,
} from '@domain/resume-complete/tokens/resume-tracks.config';
import { ResumeTrack, TrackProgressStatus } from '@shared/enums/resume-track.enum';
import {
  CertificationResponse,
  EducationResponse,
  ExperienceResponse,
} from '@shared/interfaces/dto/response/creator-portfolio';
import { ResumePayloadResponse } from '@shared/interfaces/dto/response/resume';
import {
  Certification,
  ContactInfo,
  Education,
  Experience,
  Language,
} from '@shared/interfaces/entity/creator-portfolio';
import { CurrentUserService } from '@shared/services/current-user.service';
import { map, take } from 'rxjs';

export type TrackSavePatch = Partial<{
  skills: string[];
  handle: string | null;
  displayName: string | null;
  headline: string | null;
  about: string;
  contact: ContactInfo;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  certifications: Certification[];
  pronoun: string | null;
  isPcd: boolean;
  pcdNotes: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
}>;

import { AboutTrackComponent } from '../tracks/about/about-track.component';
import { CertificationsTrackComponent } from '../tracks/certifications/certifications-track.component';
import { ContactTrackComponent } from '../tracks/contact/contact-track.component';
import { EducationTrackComponent } from '../tracks/education/education-track.component';
import { ExperienceTrackComponent } from '../tracks/experience/experience-track.component';
import { LanguagesTrackComponent } from '../tracks/languages/languages-track.component';
import { MediaTrackComponent } from '../tracks/media/media-track.component';
import { PronounPcdTrackComponent } from '../tracks/pronoun-pcd/pronoun-pcd-track.component';
import { SkillsTrackComponent } from '../tracks/skills/skills-track.component';

@Component({
  selector: 'app-resume-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonComponent,
    ResumeProgressBarComponent,
    ResumeTrackNodeComponent,
    TrackBottomSheetComponent,
    SkillsTrackComponent,
    AboutTrackComponent,
    ContactTrackComponent,
    PronounPcdTrackComponent,
    LanguagesTrackComponent,
    ExperienceTrackComponent,
    EducationTrackComponent,
    CertificationsTrackComponent,
    MediaTrackComponent,
  ],
  templateUrl: './resume-shell.component.html',
  styleUrl: './resume-shell.component.scss',
})
export class ResumeShellComponent {
  private readonly facade = inject(ResumeFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly currentUser = inject(CurrentUserService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tracks = RESUME_TRACKS;
  readonly Track = ResumeTrack;

  readonly isLoading = this.facade.isLoading;
  readonly loadError = this.facade.loadError;
  readonly progress = this.facade.tracks;
  readonly completedCount = this.facade.completedCount;
  readonly totalTracks = this.facade.totalTracks;
  readonly canPublish = this.facade.canPublish;
  readonly savingState = this.facade.savingState;
  readonly publishError = this.facade.publishError;
  readonly payload = this.facade.payload;
  readonly activeTrack = this.facade.activeTrack;

  readonly previewLink = `/${environment.ROUTES.RESUME.PREVIEW}`;

  readonly currentTrackIndex = computed(() => {
    const items = this.progress();
    return items.findIndex((t) => t.status !== TrackProgressStatus.Completed);
  });

  readonly activeDef = computed<ResumeTrackDefinition | null>(() => {
    const id = this.activeTrack();
    return id ? (findTrackDefinition(id) ?? null) : null;
  });

  private readonly routeTrackId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('trackId'))),
    { initialValue: this.route.snapshot.paramMap.get('trackId') ?? null },
  );

  constructor() {
    this.facade.load();

    effect(() => {
      const id = this.routeTrackId();
      if (!id) {
        this.facade.openTrack(null);
        return;
      }
      const found = RESUME_TRACKS.find((t) => t.id === id);
      this.facade.openTrack(found ? found.id : null);
    });

    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  selectTrack(id: ResumeTrack): void {
    void this.router.navigate(['/resume/complete', id]);
  }

  closeSheet(): void {
    void this.router.navigate(['/resume/complete']);
  }

  openPreview(): void {
    void this.router.navigateByUrl(this.previewLink);
  }

  saveActive(patch: TrackSavePatch): void {
    const active = this.activeTrack();
    if (!active) return;
    this.facade
      .saveTrack(active, this.serialize(patch))
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.savingState() === 'saved') {
          this.closeSheet();
        }
      });
  }

  private serialize(patch: TrackSavePatch): Partial<ResumePayloadResponse> {
    const out: Partial<ResumePayloadResponse> = {};
    if ('skills' in patch) out.skills = patch.skills;
    if ('handle' in patch) out.handle = patch.handle;
    if ('displayName' in patch) out.displayName = patch.displayName;
    if ('headline' in patch) out.headline = patch.headline;
    if ('about' in patch) out.about = patch.about;
    if ('contact' in patch) out.contact = patch.contact;
    if ('languages' in patch) out.languages = patch.languages;
    if ('pronoun' in patch) out.pronoun = patch.pronoun;
    if ('isPcd' in patch) out.isPcd = patch.isPcd;
    if ('pcdNotes' in patch) out.pcdNotes = patch.pcdNotes;
    if ('avatarUrl' in patch) out.avatarUrl = patch.avatarUrl;
    if ('coverUrl' in patch) out.coverUrl = patch.coverUrl;
    if ('experiences' in patch && patch.experiences) {
      out.experiences = patch.experiences.map((e) => this.serializeExperience(e));
    }
    if ('educations' in patch && patch.educations) {
      out.educations = patch.educations.map((e) => this.serializeEducation(e));
    }
    if ('certifications' in patch && patch.certifications) {
      out.certifications = patch.certifications.map((c) => this.serializeCertification(c));
    }
    return out;
  }

  private serializeExperience(e: Experience): ExperienceResponse {
    return {
      id: e.id,
      role: e.role,
      companyName: e.companyName,
      companyLogoUrl: e.companyLogoUrl,
      employmentType: e.employmentType,
      workMode: e.workMode,
      location: e.location,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate ? e.endDate.toISOString() : null,
      isCurrent: e.isCurrent,
      description: e.description,
    };
  }

  private serializeEducation(e: Education): EducationResponse {
    return {
      id: e.id,
      institutionName: e.institutionName,
      institutionLogoUrl: e.institutionLogoUrl,
      course: e.course,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate ? e.endDate.toISOString() : null,
    };
  }

  private serializeCertification(c: Certification): CertificationResponse {
    return {
      id: c.id,
      name: c.name,
      issuerName: c.issuerName,
      issuerLogoUrl: c.issuerLogoUrl,
      issuedAt: c.issuedAt.toISOString(),
      expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
      credentialUrl: c.credentialUrl,
    };
  }

  publish(): void {
    this.facade
      .publish()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((portfolio) => {
        if (portfolio) {
          void this.router.navigate(['/creator', this.currentUser.currentHandle()]);
        }
      });
  }
}
