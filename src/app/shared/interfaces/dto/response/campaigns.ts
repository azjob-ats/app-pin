export interface HourCellResponse {
  hour: number;
  price: number;
  status: string;
}

export interface PricingDayResponse {
  date: string;
  hours: HourCellResponse[];
}

export interface PricingCalendarResponse {
  keyword: string;
  from: string;
  to: string;
  days: PricingDayResponse[];
}

export interface CampaignPerformanceResponse {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  costPerConversion: number;
  spent: number;
  remaining: number;
}

export interface CampaignProjectionResponse {
  estimatedImpressions: number;
  estimatedClicks: number;
  estimatedConversions: number;
  relevanceScore: number;
  winProbability: number;
}

export interface CardSummaryResponse {
  brand: string;
  last4: string;
  expirationMonth: number;
  expirationYear: number;
  holderName: string;
}

export interface CampaignVideoResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  channelName: string;
}

export interface CampaignHourResponse {
  date: string;
  hour: number;
  price: number;
}

export interface CampaignResponse {
  id: string;
  keyword: string;
  status: string;
  video: CampaignVideoResponse;
  windowFrom: string;
  windowTo: string;
  hours: CampaignHourResponse[];
  totalCost: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  card: CardSummaryResponse | null;
  performance: CampaignPerformanceResponse | null;
  projection: CampaignProjectionResponse | null;
}

export interface CampaignListResponse {
  data: CampaignResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
