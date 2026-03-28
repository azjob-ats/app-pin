import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '@shared/interfaces/entity/user';
import { UsersApi } from '@shared/apis/users.api';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly usersApi = inject(UsersApi);

  getCurrentUser(): Observable<User> {
    return this.usersApi.getCurrentUser().pipe(
      map((response) => response.data!),
    );
  }

  getUserByUsername(username: string): Observable<User> {
    return this.usersApi.getById(username).pipe(
      map((response) => response.data!),
    );
  }

  toggleFollow(userId: string): Observable<boolean> {
    return this.usersApi.toggleFollow(userId).pipe(
      map((response) => response.data?.isFollowing ?? false),
    );
  }

  getSuggestedUsers(): Observable<User[]> {
    return this.usersApi.list(1, 10).pipe(
      map((response) => response.data?.data ?? []),
    );
  }
}
