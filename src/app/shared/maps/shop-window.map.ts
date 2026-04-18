import { List } from '@shared/interfaces/base/pages-total-records';
import { ShopWindowListResponse } from '@shared/interfaces/dto/response/shop-window';
import { ShopWindow } from '@shared/interfaces/entity/shop-window';

export class ShopWindowMap {
  public static toEntityList(dto: ShopWindowListResponse): List<ShopWindow[]> {
    return { ...dto, data: dto.data };
  }
}
