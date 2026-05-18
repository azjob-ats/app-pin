export interface MetricsKpiResponse {
  totalViews: number;
  avgWatchTimeSeconds: number;
  avgRetentionPercent: number;
  totalConversions: number;
  totalSubscribers: number;
  viewsChangePercent: number;
  watchTimeChangePercent: number;
  retentionChangePercent: number;
  subscribersChangePercent: number;
}

export interface RetentionPointResponse {
  second: number;
  retention: number;
}

export interface VideoMetricResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  durationSeconds: number;
  views: number;
  watchTimeSeconds: number;
  avgRetentionPercent: number;
  hookRetentionPercent: number;
  climaxAtSecond: number;
  climaxRetentionPercent: number;
  dropOffAtSecond: number;
  subscribersGained: number;
  conversions: number;
  retentionCurve: RetentionPointResponse[];
}

export interface ChannelGrowthPointResponse {
  date: string;
  subscribers: number;
  views: number;
}

export interface MetricsInsightResponse {
  id: string;
  tone: string;
  title: string;
  message: string;
}

export interface MetricsOverviewResponse {
  period: string;
  generatedAt: string;
  kpis: MetricsKpiResponse;
  topVideos: VideoMetricResponse[];
  growth: ChannelGrowthPointResponse[];
  insights: MetricsInsightResponse[];
}
