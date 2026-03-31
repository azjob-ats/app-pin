import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SendFeedbackMenuComponent } from '@shared/components/send-feedback-menu/send-feedback-menu.component';

@Component({
  selector: 'app-send-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SendFeedbackMenuComponent],
  template: `<app-send-feedback-menu />`,
})
export class SendFeedbackComponent {}
