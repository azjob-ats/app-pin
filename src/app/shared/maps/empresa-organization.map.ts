import { List } from '@shared/interfaces/base/pages-total-records';
import {
  OrganizationListResponse,
  OrganizationResponse,
} from '@shared/interfaces/dto/response/empresa-organization';
import { Organization } from '@shared/interfaces/entity/empresa-organization';

export class OrganizationMap {
  public static toOrganization(dto: OrganizationResponse): Organization {
    return {
      id: dto.id,
      slug: dto.slug,
      name: dto.name,
      corporateEmail: dto.corporateEmail,
      website: dto.website,
      socialLinks: [...dto.socialLinks],
      bannerUrl: dto.bannerUrl,
      logoUrl: dto.logoUrl,
      about: dto.about,
      publicPageEnabled: dto.publicPageEnabled,
      isFavorite: dto.isFavorite,
      membersCount: dto.membersCount,
      productsCount: dto.productsCount,
      submissionsCount: dto.submissionsCount,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  public static toList(dto: OrganizationListResponse): List<Organization[]> {
    return {
      data: dto.data.map((item) => OrganizationMap.toOrganization(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }
}
