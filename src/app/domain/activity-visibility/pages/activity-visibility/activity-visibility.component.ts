import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivityVisibilityMenuComponent } from '@shared/components/activity-visibility-menu/activity-visibility-menu.component';

@Component({
  selector: 'app-activity-visibility',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityVisibilityMenuComponent],
  template: `<app-activity-visibility-menu />`,
})
export class ActivityVisibilityComponent {}
