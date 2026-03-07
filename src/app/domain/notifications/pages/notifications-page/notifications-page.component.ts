import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Notification } from '../../../../shared/interfaces/notification.interface';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
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

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
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

  getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
      new_follower: 'person_add',
      pin_saved: 'bookmark_added',
      pin_comment: 'chat_bubble',
      board_follow: 'bookmarks',
      mention: 'alternate_email',
      pin_react: 'favorite',
    };
    return icons[type] ?? 'notifications';
  }
}
