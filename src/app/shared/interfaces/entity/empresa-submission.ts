import { ProductType } from '@shared/enums/product-type.enum';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';

export interface SubmissionAnswer {
  fieldId: string;
  label: string;
  value: string;
}

export interface SubmissionScreeningAnswer {
  questionId: string;
  question: string;
  idealAnswer: string;
  answer: string;
  required: boolean;
  matchesIdeal: boolean;
}

export interface SubmissionHistoryEntry {
  id: string;
  actor: string;
  action: string;
  fromPhase: SubmissionPhase | null;
  toPhase: SubmissionPhase | null;
  note: string;
  createdAt: Date;
}

export interface SubmissionCandidate {
  name: string;
  email: string;
  avatarUrl: string;
  contextLine: string;
}

export interface SubmissionSource {
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  pitchId: string | null;
  pitchTitle: string;
}

export interface Submission {
  id: string;
  organizationId: string;
  productId: string;
  productType: ProductType;
  productTitle: string;
  phase: SubmissionPhase;
  candidate: SubmissionCandidate;
  source: SubmissionSource | null;
  answers: SubmissionAnswer[];
  screeningAnswers: SubmissionScreeningAnswer[];
  internalNotes: string;
  assignedTo: string | null;
  history: SubmissionHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}
