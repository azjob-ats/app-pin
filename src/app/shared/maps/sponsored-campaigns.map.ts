import {
  EligibleVideoResponse,
  ScoreBreakdownResponse,
  SponsoredRuleResponse,
} from '@shared/interfaces/dto/response/sponsored-campaigns';
import {
  EligibleVideo,
  ScoreBreakdown,
  SponsoredRule,
  SponsoredRuleType,
} from '@shared/interfaces/entity/sponsored-campaigns';

const VALID_RULE_TYPES: ReadonlySet<SponsoredRuleType> = new Set(['do', 'dont', 'policy']);

export class SponsoredCampaignsMap {
  public static toVideo(dto: EligibleVideoResponse): EligibleVideo {
    return { ...dto };
  }

  public static toScore(dto: ScoreBreakdownResponse): ScoreBreakdown {
    return { ...dto };
  }

  public static toRule(dto: SponsoredRuleResponse): SponsoredRule {
    const type = VALID_RULE_TYPES.has(dto.type as SponsoredRuleType)
      ? (dto.type as SponsoredRuleType)
      : 'policy';
    return { id: dto.id, type, text: dto.text };
  }
}
