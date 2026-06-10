import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '../button/button.component';
import { Select } from '../select/select.component';
import { BuiDrawer } from './drawer.component';

// drawer--drawer
@Component({
  selector: 'bui-drawer-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, BuiDrawer],
  template: `
    <bui-button (click)="isOpen.set(true)">Open Drawer</bui-button>
    <bui-drawer
      [isOpen]="isOpen()"
      [animate]="false"
      (drawerClose)="isOpen.set(false)"
    >
      Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare faucibus ex, non
      facilisis nisl. Maecenas aliquet mauris ut tempus.
    </bui-drawer>
  `,
})
export class DrawerScenario {
  isOpen = signal(true);
}

// drawer--hide-backdrop (showBackdrop=false — no scrim; bg override lightskyblue is React API → approximated)
@Component({
  selector: 'bui-drawer-hide-backdrop-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, BuiDrawer],
  template: `
    <bui-button (click)="isOpen.set(true)">Open Drawer</bui-button>
    <bui-drawer
      [isOpen]="isOpen()"
      [animate]="false"
      [showBackdrop]="false"
      (drawerClose)="isOpen.set(false)"
    >
      Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare faucibus ex, non
      facilisis nisl. Maecenas aliquet mauris ut tempus.
    </bui-drawer>
  `,
})
export class DrawerHideBackdropScenario {
  isOpen = signal(true);
}

// drawer--render-all (content always in DOM even when closed)
@Component({
  selector: 'bui-drawer-render-all-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, BuiDrawer],
  template: `
    <bui-button (click)="isOpen.set(true)">Open Drawer</bui-button>
    <bui-drawer
      [isOpen]="isOpen()"
      [animate]="false"
      [renderAll]="true"
      (drawerClose)="isOpen.set(false)"
    >
      <div>
        Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare faucibus ex, non
        facilisis nisl. Maecenas aliquet mauris ut tempus.
      </div>
    </bui-drawer>
  `,
})
export class DrawerRenderAllScenario {
  isOpen = signal(false);
}

// drawer--select (drawer with select inside)
@Component({
  selector: 'bui-drawer-select-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, BuiDrawer, Select],
  template: `
    <bui-button (click)="isOpen.set(true)">Open Drawer</bui-button>
    <bui-drawer
      [isOpen]="isOpen()"
      [animate]="false"
      (drawerClose)="isOpen.set(false)"
    >
      <bui-select
        [options]="options"
        labelKey="id"
        valueKey="color"
        placeholder="Start searching"
        [searchable]="true"
      />
    </bui-drawer>
  `,
})
export class DrawerSelectScenario {
  isOpen = signal(true);
  options = [
    { id: 'AliceBlue', color: '#F0F8FF' },
    { id: 'AntiqueWhite', color: '#FAEBD7' },
    { id: 'Aqua', color: '#00FFFF' },
    { id: 'Aquamarine', color: '#7FFFD4' },
    { id: 'Azure', color: '#F0FFFF' },
    { id: 'Beige', color: '#F5F5DC' },
  ];
}
