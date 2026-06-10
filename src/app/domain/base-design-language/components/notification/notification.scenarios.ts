import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiNotification } from './notification.component';

// notification.scenario.tsx — 5 notifications (info default, longa, positive, warning, negative).
@Component({
  selector: 'bui-s-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiNotification],
  template: `<div>
    <bui-notification>Default info notification</bui-notification>
    <bui-notification>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua
    </bui-notification>
    <bui-notification kind="positive">Positive notification</bui-notification>
    <bui-notification kind="warning">Warning notification</bui-notification>
    <bui-notification kind="negative">Negative notification</bui-notification>
  </div>`,
})
export class NotificationScenario {}
