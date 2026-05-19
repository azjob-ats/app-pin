import { ProductType } from '@shared/enums/product-type.enum';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';

export interface SubmissionPhaseMeta {
  readonly id: SubmissionPhase;
  readonly label: string;
  readonly color: string;
}

const JOB_PIPELINE: readonly SubmissionPhaseMeta[] = [
  { id: SubmissionPhase.JobReceived, label: 'Recebidas', color: '#64748b' },
  { id: SubmissionPhase.JobAdequate, label: 'Adequada', color: '#0ea5e9' },
  { id: SubmissionPhase.JobInterview, label: 'Entrevista', color: '#a855f7' },
  { id: SubmissionPhase.JobDocuments, label: 'Documentos', color: '#f59e0b' },
  { id: SubmissionPhase.JobApproved, label: 'Aprovado', color: '#16a34a' },
  { id: SubmissionPhase.JobRejected, label: 'Rejeitado', color: '#dc2626' },
];

const SERVICE_PIPELINE: readonly SubmissionPhaseMeta[] = [
  { id: SubmissionPhase.ServiceReceived, label: 'Recebido', color: '#64748b' },
  { id: SubmissionPhase.ServiceQualified, label: 'Qualificado', color: '#0ea5e9' },
  { id: SubmissionPhase.ServiceMeeting, label: 'Reunião', color: '#a855f7' },
  { id: SubmissionPhase.ServiceProposal, label: 'Proposta', color: '#f59e0b' },
  { id: SubmissionPhase.ServiceClosed, label: 'Fechado', color: '#16a34a' },
  { id: SubmissionPhase.ServiceLost, label: 'Perdido', color: '#dc2626' },
];

const TRAINING_PIPELINE: readonly SubmissionPhaseMeta[] = [
  { id: SubmissionPhase.TrainingEnrolled, label: 'Inscrito', color: '#64748b' },
  { id: SubmissionPhase.TrainingConfirmed, label: 'Confirmado', color: '#0ea5e9' },
  { id: SubmissionPhase.TrainingPresent, label: 'Presente', color: '#a855f7' },
  { id: SubmissionPhase.TrainingCompleted, label: 'Concluído', color: '#16a34a' },
  { id: SubmissionPhase.TrainingCertified, label: 'Certificado', color: '#2563eb' },
];

const NEWS_PIPELINE: readonly SubmissionPhaseMeta[] = [
  { id: SubmissionPhase.NewsReceived, label: 'Recebido', color: '#64748b' },
  { id: SubmissionPhase.NewsSegmented, label: 'Segmentado', color: '#0ea5e9' },
  { id: SubmissionPhase.NewsEngaged, label: 'Engajado', color: '#a855f7' },
  { id: SubmissionPhase.NewsSubscriber, label: 'Assinante', color: '#16a34a' },
];

const EXPERIENCE_PIPELINE: readonly SubmissionPhaseMeta[] = [
  { id: SubmissionPhase.ExperienceRequested, label: 'Solicitado', color: '#64748b' },
  { id: SubmissionPhase.ExperienceScheduled, label: 'Agendado', color: '#0ea5e9' },
  { id: SubmissionPhase.ExperienceConfirmed, label: 'Confirmado', color: '#a855f7' },
  { id: SubmissionPhase.ExperienceFulfilled, label: 'Realizado', color: '#16a34a' },
];

export const SUBMISSION_PIPELINE_BY_TYPE: Readonly<
  Record<ProductType, readonly SubmissionPhaseMeta[]>
> = {
  [ProductType.Job]: JOB_PIPELINE,
  [ProductType.Service]: SERVICE_PIPELINE,
  [ProductType.Training]: TRAINING_PIPELINE,
  [ProductType.News]: NEWS_PIPELINE,
  [ProductType.Experience]: EXPERIENCE_PIPELINE,
};

const PHASE_META_INDEX = (() => {
  const index = new Map<SubmissionPhase, SubmissionPhaseMeta>();
  for (const pipeline of Object.values(SUBMISSION_PIPELINE_BY_TYPE)) {
    for (const meta of pipeline) {
      index.set(meta.id, meta);
    }
  }
  return index;
})();

export function submissionPhaseMeta(phase: SubmissionPhase): SubmissionPhaseMeta | undefined {
  return PHASE_META_INDEX.get(phase);
}

export function pipelineFor(type: ProductType): readonly SubmissionPhaseMeta[] {
  return SUBMISSION_PIPELINE_BY_TYPE[type];
}
