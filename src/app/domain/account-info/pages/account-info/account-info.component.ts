import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AccountInfoMenuComponent } from '@shared/components/account-info-menu/account-info-menu.component';

@Component({
  selector: 'app-account-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountInfoMenuComponent],
  template: `<app-account-info-menu />`,
})
export class AccountInfoComponent {}
