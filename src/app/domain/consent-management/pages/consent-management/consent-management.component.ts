import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ConsentManagementMenuComponent } from '@shared/components/consent-management-menu/consent-management-menu.component';

@Component({
  selector: 'app-consent-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConsentManagementMenuComponent],
  template: `<app-consent-management-menu />`,
})
export class ConsentManagementComponent {}
