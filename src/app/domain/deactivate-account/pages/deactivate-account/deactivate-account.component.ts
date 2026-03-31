import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DeactivateAccountMenuComponent } from '@shared/components/deactivate-account-menu/deactivate-account-menu.component';

@Component({
  selector: 'app-deactivate-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeactivateAccountMenuComponent],
  template: `<app-deactivate-account-menu />`,
})
export class DeactivateAccountComponent {}
