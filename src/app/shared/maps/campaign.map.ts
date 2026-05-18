import { CampaignStatus } from '@shared/enums/campaign-status.enum';
import { HourAvailability } from '@shared/enums/hour-availability.enum';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  CampaignListResponse,
  CampaignPerformanceResponse,
  CampaignProjectionResponse,
  CampaignResponse,
  CardSummaryResponse,
  CampaignHourResponse,
  CampaignVideoResponse,
  HourCellResponse,
  PricingCalendarResponse,
  PricingDayResponse,
} from '@shared/interfaces/dto/response/campaigns';
import {
  Campaign,
  CampaignHour,
  CampaignPerformance,
  CampaignProjection,
  CampaignVideo,
  CardSummary,
  HourCell,
  PricingCalendar,
  PricingDay,
} from '@shared/interfaces/entity/campaign';

const VALID_STATUSES = new Set(Object.values(CampaignStatus) as string[]);
const VALID_AVAILABILITY = new Set(Object.values(HourAvailability) as string[]);

export class CampaignMap {
  public static toCampaign(dto: CampaignResponse): Campaign {
    return {
      id: dto.id,
      keyword: dto.keyword,
      status: CampaignMap.toStatus(dto.status),
      video: CampaignMap.toVideo(dto.video),
      windowFrom: new Date(dto.windowFrom),
      windowTo: new Date(dto.windowTo),
      hours: dto.hours.map((hour) => CampaignMap.toHour(hour)),
      totalCost: dto.totalCost,
      createdAt: new Date(dto.createdAt),
      startedAt: dto.startedAt ? new Date(dto.startedAt) : null,
      endedAt: dto.endedAt ? new Date(dto.endedAt) : null,
      card: dto.card ? CampaignMap.toCard(dto.card) : null,
      performance: dto.performance ? CampaignMap.toPerformance(dto.performance) : null,
      projection: dto.projection ? CampaignMap.toProjection(dto.projection) : null,
    };
  }

  public static toList(dto: CampaignListResponse): List<Campaign[]> {
    return {
      data: dto.data.map((item) => CampaignMap.toCampaign(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }

  public static toPricingCalendar(dto: PricingCalendarResponse): PricingCalendar {
    return {
      keyword: dto.keyword,
      from: new Date(dto.from),
      to: new Date(dto.to),
      days: dto.days.map((day) => CampaignMap.toPricingDay(day)),
    };
  }

  public static toProjection(dto: CampaignProjectionResponse): CampaignProjection {
    return { ...dto };
  }

  private static toPricingDay(dto: PricingDayResponse): PricingDay {
    return {
      date: new Date(dto.date),
      hours: dto.hours.map((hour) => CampaignMap.toHourCell(hour)),
    };
  }

  private static toHourCell(dto: HourCellResponse): HourCell {
    const status = VALID_AVAILABILITY.has(dto.status)
      ? (dto.status as HourAvailability)
      : HourAvailability.Available;
    return { hour: dto.hour, price: dto.price, status };
  }

  private static toVideo(dto: CampaignVideoResponse): CampaignVideo {
    return { ...dto };
  }

  private static toHour(dto: CampaignHourResponse): CampaignHour {
    return { date: new Date(dto.date), hour: dto.hour, price: dto.price };
  }

  private static toCard(dto: CardSummaryResponse): CardSummary {
    return { ...dto };
  }

  private static toPerformance(dto: CampaignPerformanceResponse): CampaignPerformance {
    return { ...dto };
  }

  private static toStatus(value: string): CampaignStatus {
    return VALID_STATUSES.has(value) ? (value as CampaignStatus) : CampaignStatus.Pending;
  }
}
