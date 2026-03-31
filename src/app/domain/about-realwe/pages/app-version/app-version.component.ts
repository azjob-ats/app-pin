import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppVersionMenuComponent } from '@shared/components/app-version-menu/app-version-menu.component';

@Component({
  selector: 'app-app-version',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppVersionMenuComponent],
  template: `<app-app-version-menu />`,
})
export class AppVersionComponent {}
