import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NotificationSettingsMenuComponent } from '@shared/components/notification-settings-menu/notification-settings-menu.component';

@Component({
  selector: 'app-notification-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationSettingsMenuComponent],
  template: `<app-notification-settings-menu />`,
})
export class NotificationSettingsComponent {}
