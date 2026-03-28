import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Notification } from '@shared/interfaces/entity/notification';
import { NotificationsApi } from '@shared/apis/notifications.api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsApi = inject(NotificationsApi);

  readonly unreadCount = signal(0);

  getNotifications(): Observable<Notification[]> {
    return this.notificationsApi.list().pipe(
      tap((response) => {
        const items = response.data?.data ?? [];
        this.unreadCount.set(items.filter((n) => !n.isRead).length);
      }),
      map((response) => response.data?.data ?? []),
    );
  }

  markAsRead(id: string): Observable<void> {
    return this.notificationsApi.markAsRead(id).pipe(
      tap((response) => {
        if (response.data && !response.data.isRead) return;
        this.unreadCount.update((c) => Math.max(0, c - 1));
      }),
      map(() => undefined),
    );
  }

  markAllAsRead(): Observable<void> {
    return this.notificationsApi.markAllAsRead().pipe(
      tap(() => this.unreadCount.set(0)),
      map(() => undefined),
    );
  }
}
