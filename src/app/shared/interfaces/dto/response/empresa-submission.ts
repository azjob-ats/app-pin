export interface SubmissionAnswerResponse {
  fieldId: string;
  label: string;
  value: string;
}

export interface SubmissionScreeningAnswerResponse {
  questionId: string;
  question: string;
  idealAnswer: string;
  answer: string;
  required: boolean;
  matchesIdeal: boolean;
}

export interface SubmissionHistoryEntryResponse {
  id: string;
  actor: string;
  action: string;
  fromPhase: string | null;
  toPhase: string | null;
  note?: string;
  createdAt: string;
}

export interface SubmissionResponse {
  id: string;
  organizationId: string;
  productId: string;
  productType: string;
  productTitle: string;
  phase: string;
  candidate: {
    name: string;
    email: string;
    avatarUrl: string;
    contextLine: string;
  };
  answers: SubmissionAnswerResponse[];
  screeningAnswers: SubmissionScreeningAnswerResponse[];
  internalNotes: string;
  assignedTo: string | null;
  history: SubmissionHistoryEntryResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionListResponse {
  data: SubmissionResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
