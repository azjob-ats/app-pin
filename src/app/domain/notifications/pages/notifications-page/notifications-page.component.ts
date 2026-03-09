import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Notification } from '../../../../shared/interfaces/notification.interface';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { NotificationItemComponent } from '../../../../shared/components/notification-item/notification-item.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, EmptyStateComponent, NotificationItemComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent implements OnInit {
  readonly notifications = signal<Notification[]>([]);
  readonly isLoading = signal(true);

  readonly notifService = inject(NotificationService);

  ngOnInit(): void {
    this.notifService.getNotifications().subscribe(notifs => {
      this.notifications.set(notifs);
      this.isLoading.set(false);
    });
  }

  markAllRead(): void {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.update(ns => ns.map(n => ({ ...n, isRead: true })));
    });
  }

  markRead(id: string): void {
    this.notifService.markAsRead(id).subscribe(() => {
      this.notifications.update(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
    });
  }

  get unreadCount(): number {
    return this.notifications().filter(n => !n.isRead).length;
  }

  get todayNotifs(): Notification[] {
    const now = Date.now();
    return this.notifications().filter(n => (now - new Date(n.createdAt).getTime()) < 24 * 3600 * 1000);
  }

  get earlierNotifs(): Notification[] {
    const now = Date.now();
    return this.notifications().filter(n => (now - new Date(n.createdAt).getTime()) >= 24 * 3600 * 1000);
  }

}
