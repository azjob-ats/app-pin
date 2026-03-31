import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ConnectedDevicesMenuComponent } from '@shared/components/connected-devices-menu/connected-devices-menu.component';

@Component({
  selector: 'app-connected-devices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConnectedDevicesMenuComponent],
  template: `<app-connected-devices-menu />`,
})
export class ConnectedDevicesComponent {}
