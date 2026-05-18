import { CampaignStatus } from '@shared/enums/campaign-status.enum';
import { HourAvailability } from '@shared/enums/hour-availability.enum';

export interface HourCell {
  hour: number;
  price: number;
  status: HourAvailability;
}

export interface PricingDay {
  date: Date;
  hours: HourCell[];
}

export interface PricingCalendar {
  keyword: string;
  from: Date;
  to: Date;
  days: PricingDay[];
}

export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  costPerConversion: number;
  spent: number;
  remaining: number;
}

export interface CampaignProjection {
  estimatedImpressions: number;
  estimatedClicks: number;
  estimatedConversions: number;
  relevanceScore: number;
  winProbability: number;
}

export interface CardSummary {
  brand: string;
  last4: string;
  expirationMonth: number;
  expirationYear: number;
  holderName: string;
}

export interface CampaignVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  channelName: string;
}

export interface CampaignHour {
  date: Date;
  hour: number;
  price: number;
}

export interface Campaign {
  id: string;
  keyword: string;
  status: CampaignStatus;
  video: CampaignVideo;
  windowFrom: Date;
  windowTo: Date;
  hours: CampaignHour[];
  totalCost: number;
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  card: CardSummary | null;
  performance: CampaignPerformance | null;
  projection: CampaignProjection | null;
}
