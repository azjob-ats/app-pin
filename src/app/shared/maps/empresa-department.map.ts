import { List } from '@shared/interfaces/base/pages-total-records';
import {
  DepartmentListResponse,
  DepartmentResponse,
} from '@shared/interfaces/dto/response/empresa-department';
import { Department } from '@shared/interfaces/entity/empresa-department';

export class DepartmentMap {
  public static toDepartment(dto: DepartmentResponse): Department {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
      icon: dto.icon,
      color: dto.color,
      isFavorite: dto.isFavorite,
      membersCount: dto.membersCount,
      productsCount: dto.productsCount,
      submissionsCount: dto.submissionsCount,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  public static toList(dto: DepartmentListResponse): List<Department[]> {
    return {
      data: dto.data.map((item) => DepartmentMap.toDepartment(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }
}
