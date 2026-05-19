export interface CreateSubmissionRequest {
  answers: Array<{ fieldId: string; value: string }>;
  screeningAnswers?: Array<{ questionId: string; answer: string }>;
}

export interface MoveSubmissionRequest {
  phase: string;
}

export interface AddSubmissionNoteRequest {
  note: string;
}

export interface AssignSubmissionRequest {
  memberId: string;
}

export interface SubmissionListQueryRequest {
  productType?: string;
  productId?: string;
  assignedTo?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
