export interface EligibilityChecklistResponse {
  hasRealCreator: boolean;
  hasLongVideo: boolean;
  passedModeration: boolean;
  hasRealInteraction: boolean;
  lowRejectionRate: boolean;
  goodRetention: boolean;
}

export interface EligibleVideoResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  channelName: string;
  retentionPercent: number;
  conversionRate: number;
  relevanceScore: number;
  eligible: boolean;
  checklist: EligibilityChecklistResponse;
  blockedReason: string | null;
}

export interface ScoreBreakdownResponse {
  organicPerformanceWeight: number;
  contentQualityWeight: number;
  conversionHistoryWeight: number;
  campaignValueWeight: number;
}

export interface SponsoredRuleResponse {
  id: string;
  type: string;
  text: string;
}
