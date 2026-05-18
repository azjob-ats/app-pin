export interface EligibilityChecklist {
  hasRealCreator: boolean;
  hasLongVideo: boolean;
  passedModeration: boolean;
  hasRealInteraction: boolean;
  lowRejectionRate: boolean;
  goodRetention: boolean;
}

export interface EligibleVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  channelName: string;
  retentionPercent: number;
  conversionRate: number;
  relevanceScore: number;
  eligible: boolean;
  checklist: EligibilityChecklist;
  blockedReason: string | null;
}

export interface ScoreBreakdown {
  organicPerformanceWeight: number;
  contentQualityWeight: number;
  conversionHistoryWeight: number;
  campaignValueWeight: number;
}

export type SponsoredRuleType = 'do' | 'dont' | 'policy';

export interface SponsoredRule {
  id: string;
  type: SponsoredRuleType;
  text: string;
}
