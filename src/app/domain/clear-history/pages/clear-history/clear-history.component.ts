import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ClearHistoryMenuComponent } from '@shared/components/clear-history-menu/clear-history-menu.component';

@Component({
  selector: 'app-clear-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClearHistoryMenuComponent],
  template: `<app-clear-history-menu />`,
})
export class ClearHistoryComponent {}
