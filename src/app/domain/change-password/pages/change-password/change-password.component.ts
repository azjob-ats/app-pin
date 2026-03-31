import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChangePasswordMenuComponent } from '@shared/components/change-password-menu/change-password-menu.component';

@Component({
  selector: 'app-change-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChangePasswordMenuComponent],
  template: `<app-change-password-menu />`,
})
export class ChangePasswordComponent {}
