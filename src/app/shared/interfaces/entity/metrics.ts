import { MetricsPeriod } from '@shared/enums/metrics-period.enum';

export interface MetricsKpi {
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

export interface RetentionPoint {
  second: number;
  retention: number;
}

export interface VideoMetric {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
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
  retentionCurve: RetentionPoint[];
}

export interface ChannelGrowthPoint {
  date: Date;
  subscribers: number;
  views: number;
}

export type MetricsInsightTone = 'positive' | 'warning' | 'neutral';

export interface MetricsInsight {
  id: string;
  tone: MetricsInsightTone;
  title: string;
  message: string;
}

export interface MetricsOverview {
  period: MetricsPeriod;
  generatedAt: Date;
  kpis: MetricsKpi;
  topVideos: VideoMetric[];
  growth: ChannelGrowthPoint[];
  insights: MetricsInsight[];
}
