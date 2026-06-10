import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { BuiAppNavBar, NavItem, setItemActive } from './app-nav-bar.component';

/* ── helpers ────────────────────────────────────────────────────────────────── */

const USER_ITEMS: NavItem[] = [
  { label: 'Account item1' },
  { label: 'Account item2' },
  { label: 'Account item3' },
  { label: 'Account item4' },
];

const MAIN_ITEMS_NESTED: NavItem[] = [
  { label: 'Primary A' },
  { label: 'Primary B' },
  {
    label: 'Primary C',
    children: [
      { label: 'Secondary A' },
      { label: 'Secondary B' },
      { label: 'Secondary C' },
      { label: 'Secondary D' },
    ],
  },
  {
    label: 'Primary D',
    children: [
      {
        label: 'Secondary E',
        children: [
          { label: 'Tertiary A' },
          { label: 'Tertiary B' },
        ],
      },
      { label: 'Secondary F' },
    ],
  },
];

/* ── app-nav-bar ────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-app-nav-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      title="Uber Something"
      [mainItems]="mainItems()"
      [userItems]="userItems"
      username="Umka Marshmallow"
      usernameSubtitle="5.0"
      (mainItemSelect)="onMainSelect($event)"
    />
  `,
})
export class AppNavBarScenario {
  protected readonly userItems = USER_ITEMS;
  protected readonly mainItems = signal<NavItem[]>(MAIN_ITEMS_NESTED);

  protected onMainSelect(item: NavItem): void {
    this.mainItems.update((items) => setItemActive(items, item));
  }
}

/* ── get-unique-identifier ──────────────────────────────────────────────────── */

const UNIQUE_ID_ITEMS: NavItem[] = [
  { label: 'label', info: { id: 1 } },
  { label: 'label', info: { id: 2 } },
  { label: 'label', info: { id: 3 } },
  { label: 'label', info: { id: 4 } },
];

@Component({
  selector: 'bui-s-app-nav-bar-unique-id',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      title="get unique identifier"
      [mainItems]="mainItems()"
      (mainItemSelect)="onMainSelect($event)"
    />
  `,
})
export class AppNavBarGetUniqueIdentifierScenario {
  protected readonly mainItems = signal<NavItem[]>(UNIQUE_ID_ITEMS);

  protected onMainSelect(item: NavItem): void {
    this.mainItems.update((items) =>
      setItemActive(items, item, (i) => (i.info as { id: number }).id)
    );
  }
}

/* ── icon-overrides ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-app-nav-bar-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      title="Icon overrides"
      [mainItems]="mainItems()"
      [userItems]="userItems"
      username="User"
      (mainItemSelect)="onMainSelect($event)"
    />
  `,
})
export class AppNavBarIconOverridesScenario {
  protected readonly userItems = USER_ITEMS;
  protected readonly mainItems = signal<NavItem[]>([
    { label: 'Primary A' },
    { label: 'Primary B' },
    { label: 'Primary C', children: [{ label: 'Child A' }, { label: 'Child B' }] },
  ]);

  protected onMainSelect(item: NavItem): void {
    this.mainItems.update((items) => setItemActive(items, item));
  }
}

/* ── is-main-item-active ────────────────────────────────────────────────────── */

const IS_ACTIVE_ITEMS: NavItem[] = [
  { label: 'Primary A' },
  { label: 'Primary B' },
  {
    label: 'Primary C',
    children: [
      { label: 'Secondary A' },
      { label: 'Secondary B' },
      { label: 'Secondary C' },
      { label: 'Secondary D' },
    ],
  },
];

@Component({
  selector: 'bui-s-app-nav-bar-is-main-item-active',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      title="is-main-item-active"
      [mainItems]="items"
      [userItems]="userItems"
      [isMainItemActive]="isActive"
      (mainItemSelect)="activeLabel.set($event.label)"
    />
  `,
})
export class AppNavBarIsMainItemActiveScenario {
  protected readonly items = IS_ACTIVE_ITEMS;
  protected readonly userItems = USER_ITEMS;
  protected readonly activeLabel = signal('Secondary A');
  protected readonly isActive = (item: NavItem) => item.label === this.activeLabel();
}

/* ── map-item-to-node ───────────────────────────────────────────────────────── */

const COLOR_ITEMS: NavItem[] = [
  { label: 'main one',   info: { color: 'blue' } },
  { label: 'main two',   info: { color: 'red' } },
  { label: 'main three', info: { color: 'purple' } },
  { label: 'main four',  info: { color: 'orange' } },
];

@Component({
  selector: 'bui-s-app-nav-bar-map-item-to-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      title="map item to node"
      [mainItems]="mainItems()"
      [userItems]="userItems"
      [mapItemToNode]="itemTpl"
      (mainItemSelect)="onMainSelect($event)"
    />
    <ng-template #itemTpl let-item>
      <span [style.color]="item.info?.color">{{ item.label }}</span>
    </ng-template>
  `,
})
export class AppNavBarMapItemToNodeScenario {
  protected readonly userItems: NavItem[] = [
    { label: 'user one',   info: { color: 'green' } },
    { label: 'user two',   info: { color: 'yellow' } },
    { label: 'user three', info: { color: 'lightskyblue' } },
    { label: 'user four',  info: { color: 'lightgreen' } },
  ];
  protected readonly mainItems = signal<NavItem[]>(COLOR_ITEMS);

  protected onMainSelect(item: NavItem): void {
    this.mainItems.update((items) => setItemActive(items, item));
  }
}

/* ── overrides ──────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-app-nav-bar-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      title="Overrides"
      [mainItems]="mainItems()"
      [userItems]="userItems"
      username="User"
      (mainItemSelect)="onMainSelect($event)"
    />
  `,
})
export class AppNavBarOverridesScenario {
  protected readonly userItems = USER_ITEMS;
  protected readonly mainItems = signal<NavItem[]>([
    { label: 'Item A' },
    { label: 'Item B' },
    { label: 'Item C' },
  ]);

  protected onMainSelect(item: NavItem): void {
    this.mainItems.update((items) => setItemActive(items, item));
  }
}

/* ── title-node ─────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-s-app-nav-bar-title-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAppNavBar],
  template: `
    <bui-app-nav-bar
      [titleTemplate]="titleTpl"
      [mainItems]="mainItems()"
      (mainItemSelect)="onMainSelect($event)"
    />
    <ng-template #titleTpl>
      <span style="display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700">
        <span style="color:#276ef1;font-size:24px">◆</span>
        Custom Title
      </span>
    </ng-template>
  `,
})
export class AppNavBarTitleNodeScenario {
  protected readonly mainItems = signal<NavItem[]>([
    { label: 'Item A' },
    { label: 'Item B' },
    { label: 'Item C' },
  ]);

  protected onMainSelect(item: NavItem): void {
    this.mainItems.update((items) => setItemActive(items, item));
  }
}
