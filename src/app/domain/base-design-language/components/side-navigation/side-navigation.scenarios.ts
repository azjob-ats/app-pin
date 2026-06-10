import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BuiSideNav, NavItem } from './side-navigation.component';

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Colors',
    subNav: [
      {
        title: 'Shades',
        itemId: '/',
        subNav: [
          { title: 'Light', itemId: '#level1.1.1.1' },
        ],
      },
    ],
  },
  { title: 'Sizing', itemId: '#level1.2', disabled: true },
  { title: 'Typography', itemId: '#level1.3' },
];

// side-navigation--nav
@Component({
  selector: 'bui-sn-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSideNav],
  template: `
    <div style="padding:16px;width:240px">
      <bui-side-nav
        [items]="items"
        [activeItemId]="activeId()"
        (onChange)="activeId.set($event.item.itemId ?? activeId())"
      />
    </div>
  `,
})
export class SideNavScenario {
  items = NAV_ITEMS;
  activeId = signal('/');
}

// side-navigation--nav-long
@Component({
  selector: 'bui-sn-long-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSideNav],
  template: `
    <div style="padding:16px;width:240px;height:400px;overflow:auto">
      <bui-side-nav
        [items]="items"
        [activeItemId]="activeId()"
        (onChange)="activeId.set($event.item.itemId ?? activeId())"
      />
    </div>
  `,
})
export class SideNavLongScenario {
  items: NavItem[] = Array.from({ length: 300 }, (_, i) => ({
    title: `item ${i + 1}`,
    itemId: String(i),
  }));
  activeId = signal('0');
}
