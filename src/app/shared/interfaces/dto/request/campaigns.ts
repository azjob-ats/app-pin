export interface CampaignListQueryRequest {
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PricingCalendarQueryRequest {
  keyword: string;
  from: string;
}

export interface ProjectionRequest {
  keyword: string;
  videoId: string;
  hours: { date: string; hour: number }[];
}

export interface CreateCampaignRequest {
  keyword: string;
  videoId: string;
  hours: { date: string; hour: number }[];
}
