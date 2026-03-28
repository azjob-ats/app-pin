import { List } from '@shared/interfaces/base/pages-total-records';
import { UserListResponse, UserResponse } from '@shared/interfaces/dto/response/user';
import { User } from '@shared/interfaces/entity/user';

export class UserMap {
  public static toEntity(dto: UserResponse): User {
    return {
      id: dto.id,
      username: dto.username,
      displayName: dto.displayName,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      coverUrl: dto.coverUrl,
      followersCount: dto.followersCount,
      followingCount: dto.followingCount,
      pinsCount: dto.pinsCount,
      boardsCount: dto.boardsCount,
      isFollowing: dto.isFollowing,
      website: dto.website,
      location: dto.location,
      monthlyViews: dto.monthlyViews,
    };
  }

  public static toEntityList(dto: UserListResponse): List<User[]> {
    return {
      ...dto,
      data: dto.data.map(UserMap.toEntity),
    };
  }
}
