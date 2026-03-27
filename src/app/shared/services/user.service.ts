import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '@shared/interfaces/user.interface';
import { MOCK_USERS, MOCK_CURRENT_USER } from '@shared/mocks/users.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  private following = new Set<string>();

  getCurrentUser(): Observable<User> {
    return of(MOCK_CURRENT_USER).pipe(delay(200));
  }

  getUserByUsername(username: string): Observable<User> {
    const user = MOCK_USERS.find(u => u.username === username) ?? MOCK_USERS[0];
    return of(user).pipe(delay(300));
  }

  toggleFollow(userId: string): Observable<boolean> {
    const isFollowing = this.following.has(userId);
    if (isFollowing) {
      this.following.delete(userId);
    } else {
      this.following.add(userId);
    }
    return of(!isFollowing).pipe(delay(200));
  }

  isFollowing(userId: string): boolean {
    return this.following.has(userId);
  }

  getSuggestedUsers(): Observable<User[]> {
    return of(MOCK_USERS).pipe(delay(300));
  }
}
