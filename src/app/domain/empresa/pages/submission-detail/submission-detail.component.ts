import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import { PRODUCT_TYPE_META } from '@domain/empresa/constants/product-presets';
import {
  pipelineFor,
  submissionPhaseMeta,
} from '@domain/empresa/constants/submission-pipelines';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { SubmissionDetailFacade } from '@domain/empresa/services/submission-detail.facade';

@Component({
  selector: 'app-submission-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './submission-detail.component.html',
  styleUrl: './submission-detail.component.scss',
})
export class SubmissionDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly context = inject(OrganizationContextService);
  private readonly facade = inject(SubmissionDetailFacade);

  readonly submission = this.facade.submission;
  readonly isLoading = this.facade.isLoading;
  readonly isMoving = this.facade.isMoving;
  readonly isSavingNote = this.facade.isSavingNote;
  readonly error = this.facade.error;

  readonly noteControl = new FormControl('', { nonNullable: true });
  readonly noteDirty = signal<boolean>(false);
  private lastSavedNote = '';

  constructor() {
    // Hydrate the note input whenever a fresh submission lands.
    effect(() => {
      const s = this.submission();
      if (!s) return;
      this.lastSavedNote = s.internalNotes;
      this.noteControl.setValue(s.internalNotes, { emitEvent: false });
      this.noteDirty.set(false);
    });
  }

  readonly typeMeta = computed(() => {
    const s = this.submission();
    return s ? PRODUCT_TYPE_META[s.productType] : null;
  });

  readonly phaseMeta = computed(() => {
    const s = this.submission();
    return s ? submissionPhaseMeta(s.phase) ?? null : null;
  });

  readonly pipeline = computed(() => {
    const s = this.submission();
    return s ? pipelineFor(s.productType) : [];
  });

  readonly currentPhaseIndex = computed<number>(() => {
    const s = this.submission();
    if (!s) return -1;
    return this.pipeline().findIndex((p) => p.id === s.phase);
  });

  readonly nextPhase = computed<SubmissionPhase | null>(() => {
    const idx = this.currentPhaseIndex();
    if (idx < 0) return null;
    const next = this.pipeline()[idx + 1];
    return next ? next.id : null;
  });

  readonly rejectedPhase = computed<SubmissionPhase | null>(() => {
    // Convention: rejection phase is the last in pipelines that include one
    // (job_rejected, service_lost). For pipelines without a rejection phase,
    // returns null and the Reprovar button is hidden.
    const pipeline = this.pipeline();
    if (pipeline.length === 0) return null;
    const last = pipeline[pipeline.length - 1];
    const isRejection =
      last.id === SubmissionPhase.JobRejected || last.id === SubmissionPhase.ServiceLost;
    return isRejection ? last.id : null;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const id = this.route.snapshot.paramMap.get('submissionId');
    if (!slug || !id) {
      this.facade.reset();
      return;
    }
    if (this.context.organization()?.slug !== slug) {
      this.context.load(slug);
    }
    this.facade.load(slug, id);
    this.noteControl.valueChanges.subscribe(() => {
      this.noteDirty.set(this.noteControl.value !== this.lastSavedNote);
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected basePath(): string {
    const slug = this.context.organization()?.slug ?? this.route.snapshot.paramMap.get('slug');
    return slug ? `/${environment.ROUTES.EMPRESA.PANEL_PATH}/${slug}` : '/empresa';
  }

  protected backToTriageLink(): string {
    return `${this.basePath()}/triagens`;
  }

  protected productLink(): string {
    const productId = this.submission()?.productId ?? '';
    return `${this.basePath()}/produtos/${productId}`;
  }

  protected publicProfileLink(): string {
    const email = this.submission()?.candidate.email ?? '';
    const handle = email.split('@')[0] || 'candidato';
    return `/${handle}`;
  }

  protected advance(): void {
    const slug = this.context.organization()?.slug;
    const next = this.nextPhase();
    if (!slug || !next) return;
    this.facade.move(slug, next);
  }

  protected reject(): void {
    const slug = this.context.organization()?.slug;
    const rejected = this.rejectedPhase();
    if (!slug || !rejected) return;
    this.facade.move(slug, rejected);
  }

  protected saveNote(): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    const value = this.noteControl.value;
    this.facade.saveNote(slug, value);
    this.lastSavedNote = value;
    this.noteDirty.set(false);
  }

  protected screeningTrack = (
    _: number,
    item: Submission['screeningAnswers'][number],
  ) => item.questionId;
  protected answerTrack = (
    _: number,
    item: Submission['answers'][number],
  ) => item.fieldId;
  protected historyTrack = (
    _: number,
    item: Submission['history'][number],
  ) => item.id;
}
