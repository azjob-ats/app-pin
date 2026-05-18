import { MetricsPeriod } from '@shared/enums/metrics-period.enum';
import {
  ChannelGrowthPointResponse,
  MetricsInsightResponse,
  MetricsKpiResponse,
  MetricsOverviewResponse,
  RetentionPointResponse,
  VideoMetricResponse,
} from '@shared/interfaces/dto/response/metrics';
import {
  ChannelGrowthPoint,
  MetricsInsight,
  MetricsInsightTone,
  MetricsKpi,
  MetricsOverview,
  RetentionPoint,
  VideoMetric,
} from '@shared/interfaces/entity/metrics';

const INSIGHT_TONES: ReadonlySet<MetricsInsightTone> = new Set(['positive', 'warning', 'neutral']);

export class MetricsMap {
  public static toOverview(dto: MetricsOverviewResponse): MetricsOverview {
    return {
      period: MetricsMap.toPeriod(dto.period),
      generatedAt: new Date(dto.generatedAt),
      kpis: MetricsMap.toKpi(dto.kpis),
      topVideos: dto.topVideos.map((video) => MetricsMap.toVideo(video)),
      growth: dto.growth.map((point) => MetricsMap.toGrowth(point)),
      insights: dto.insights.map((insight) => MetricsMap.toInsight(insight)),
    };
  }

  public static toKpi(dto: MetricsKpiResponse): MetricsKpi {
    return { ...dto };
  }

  public static toVideo(dto: VideoMetricResponse): VideoMetric {
    return {
      ...dto,
      publishedAt: new Date(dto.publishedAt),
      retentionCurve: dto.retentionCurve.map((point) => MetricsMap.toRetention(point)),
    };
  }

  public static toRetention(dto: RetentionPointResponse): RetentionPoint {
    return { ...dto };
  }

  public static toGrowth(dto: ChannelGrowthPointResponse): ChannelGrowthPoint {
    return {
      date: new Date(dto.date),
      subscribers: dto.subscribers,
      views: dto.views,
    };
  }

  public static toInsight(dto: MetricsInsightResponse): MetricsInsight {
    const tone = INSIGHT_TONES.has(dto.tone as MetricsInsightTone)
      ? (dto.tone as MetricsInsightTone)
      : 'neutral';
    return {
      id: dto.id,
      tone,
      title: dto.title,
      message: dto.message,
    };
  }

  private static toPeriod(value: string): MetricsPeriod {
    const allowed = Object.values(MetricsPeriod) as string[];
    return allowed.includes(value) ? (value as MetricsPeriod) : MetricsPeriod.Last30Days;
  }
}
