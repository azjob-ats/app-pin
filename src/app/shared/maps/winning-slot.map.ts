import { List } from '@shared/interfaces/base/pages-total-records';
import { WinningSlotListResponse } from '@shared/interfaces/dto/response/winning-slot';
import { WinningSlot } from '@shared/interfaces/entity/winning-slot';

export class WinningSlotMap {
  public static toEntityList(dto: WinningSlotListResponse): List<WinningSlot[]> {
    return { ...dto, data: dto.data };
  }
}
