import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';
import { MOCK_NOTIFICATIONS } from '../mocks/notifications.mock';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly unreadCount = signal(MOCK_NOTIFICATIONS.filter(n => !n.isRead).length);

  getNotifications(): Observable<Notification[]> {
    return of(MOCK_NOTIFICATIONS).pipe(delay(300));
  }

  markAsRead(id: string): Observable<void> {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (notif && !notif.isRead) {
      notif.isRead = true;
      this.unreadCount.update(c => Math.max(0, c - 1));
    }
    return of(undefined).pipe(delay(100));
  }

  markAllAsRead(): Observable<void> {
    MOCK_NOTIFICATIONS.forEach(n => (n.isRead = true));
    this.unreadCount.set(0);
    return of(undefined).pipe(delay(100));
  }
}
