import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Notification, NotificationType } from '@shared/interfaces/notification.interface';

const NOTIF_ICONS: Record<NotificationType, string> = {
  new_follower: 'person_add',
  pin_saved: 'bookmark_added',
  pin_comment: 'chat_bubble',
  board_follow: 'bookmarks',
  mention: 'alternate_email',
  pin_react: 'favorite',
};

@Component({
  selector: 'app-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div
      class="notif-item"
      [class.notif-item--unread]="!notification().isRead"
      (click)="read.emit(notification().id)"
      role="listitem"
      [attr.aria-label]="notification().message"
    >
      <!-- Avatar / icon -->
      <div class="notif-item__avatar-wrap">
        @if (notification().actor?.avatarUrl) {
          <img
            [src]="notification().actor!.avatarUrl"
            [alt]="notification().actor!.displayName"
            class="notif-item__avatar"
            loading="lazy"
          />
        } @else {
          <div class="notif-item__icon-avatar" aria-hidden="true">
            <span class="material-symbols-rounded">{{ icon() }}</span>
          </div>
        }
        <div class="notif-item__type-badge" aria-hidden="true">
          <span class="material-symbols-rounded">{{ icon() }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="notif-item__content">
        <p class="notif-item__text">
          @if (notification().actor) {
            <strong>{{ notification().actor!.displayName }}</strong>
          }
          {{ notification().message }}
        </p>
        <span class="notif-item__time">{{ timeAgo(notification().createdAt) }}</span>
      </div>

      <!-- Pin thumbnail -->
      @if (notification().pin?.imageUrl) {
        <a
          [routerLink]="['/pin', notification().pin!.id]"
          class="notif-item__thumb"
          (click)="$event.stopPropagation()"
          [attr.aria-label]="notification().pin?.title || 'Ver pin'"
        >
          <img [src]="notification().pin!.imageUrl" [alt]="notification().pin?.title || ''" loading="lazy" />
        </a>
      }

      <!-- Board thumbnail -->
      @if (notification().board?.coverImageUrl && !notification().pin) {
        <div class="notif-item__thumb">
          <img
            [src]="notification().board!.coverImageUrl!"
            [alt]="notification().board?.name || ''"
            loading="lazy"
          />
        </div>
      }

      @if (!notification().isRead) {
        <div class="notif-item__unread-dot" aria-label="Não lida"></div>
      }
    </div>
  `,
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
  readonly notification = input.required<Notification>();
  readonly read = output<string>();

  icon(): string {
    return NOTIF_ICONS[this.notification().type] ?? 'notifications';
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

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
