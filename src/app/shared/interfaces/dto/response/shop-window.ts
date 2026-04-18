import { List } from '@shared/interfaces/base/pages-total-records';
import { ShopWindow } from '@shared/interfaces/entity/shop-window';

export type ShopWindowResponse = ShopWindow;

export interface ShopWindowListResponse extends List {
  data: ShopWindowResponse[];
}
