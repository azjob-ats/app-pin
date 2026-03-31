import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DownloadDataMenuComponent } from '@shared/components/download-data-menu/download-data-menu.component';

@Component({
  selector: 'app-download-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DownloadDataMenuComponent],
  template: `<app-download-data-menu />`,
})
export class DownloadDataComponent {}
