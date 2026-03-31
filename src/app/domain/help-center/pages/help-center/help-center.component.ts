import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HelpCenterMenuComponent } from '@shared/components/help-center-menu/help-center-menu.component';

@Component({
  selector: 'app-help-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HelpCenterMenuComponent],
  template: `<app-help-center-menu />`,
})
export class HelpCenterComponent {}
