import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HireSupportMenuComponent } from '@shared/components/hire-support-menu/hire-support-menu.component';

@Component({
  selector: 'app-hire-support',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HireSupportMenuComponent],
  template: `<app-hire-support-menu />`,
})
export class HireSupportComponent {}
