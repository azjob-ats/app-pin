import { List } from '@shared/interfaces/base/pages-total-records';
import { WinningSlot } from '@shared/interfaces/entity/winning-slot';

export type WinningSlotResponse = WinningSlot;

export interface WinningSlotListResponse extends List {
  data: WinningSlotResponse[];
}
