import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DeleteAccountMenuComponent } from '@shared/components/delete-account-menu/delete-account-menu.component';

@Component({
  selector: 'app-delete-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeleteAccountMenuComponent],
  template: `<app-delete-account-menu />`,
})
export class DeleteAccountComponent {}
