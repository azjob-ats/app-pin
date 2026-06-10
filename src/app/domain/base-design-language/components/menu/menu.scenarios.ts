import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiMenu, BuiNestedMenus, MenuItem } from './menu.component';
import { BuiPopover } from '../popover/popover.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

/** Scenarios portadas de `src/menu/__tests__/*.scenario.tsx`. */
const W = 'width:200px';

// menu.scenario.tsx — 12 itens (Item Three disabled), List 200px.
@Component({
  selector: 'bui-s-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu style="${W}" [items]="items" />`,
})
export class MenuScenario {
  protected readonly items: MenuItem[] = [
    { label: 'Item One' }, { label: 'Item Two' }, { label: 'Item Three', disabled: true },
    { label: 'Item Four' }, { label: 'Item Five' }, { label: 'Item Six' }, { label: 'Item Seven' },
    { label: 'Item Eight' }, { label: 'Item Nine' }, { label: 'Item Ten' }, { label: 'Item Eleven' }, { label: 'Item Twelve' },
  ];
}

// menu-empty.scenario.tsx — sem itens → "No results".
@Component({
  selector: 'bui-s-menu-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu style="${W}" [items]="[]" />`,
})
export class MenuEmptyScenario {}

// menu-dividers.scenario.tsx — itens com separadores.
@Component({
  selector: 'bui-s-menu-dividers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu style="${W}" [items]="items" />`,
})
export class MenuDividersScenario {
  protected readonly items: MenuItem[] = [
    { label: 'Menu option A' }, { label: 'Menu option B' }, { divider: true },
    { label: 'Menu option X' }, { label: 'Menu option Y' }, { label: 'Menu option Z' }, { divider: true },
    { label: 'Menu option 1' }, { label: 'Menu option 2' }, { label: 'Menu option 3' },
  ];
}

// menu-stateful.scenario.tsx — StatefulMenu, highlightedIndex=5, List 350×300.
@Component({
  selector: 'bui-s-menu-stateful',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu style="width:350px" [initialHighlight]="5" [items]="items" />`,
})
export class MenuStatefulScenario {
  protected readonly items: MenuItem[] = Array.from({ length: 12 }, (_, i) =>
    ({ label: ['Item One', 'Item Two', 'Item Three', 'Item Four', 'Item Five', 'Item Six', 'Item Seven', 'Item Eight', 'Item Nine', 'Item Ten', 'Item Eleven', 'Item Twelve'][i], disabled: i === 2 }));
}

// menu-profile-menu.scenario.tsx — 4 perfis (title/subtitle/body), List 350px.
@Component({
  selector: 'bui-s-menu-profile-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu style="width:350px" [items]="items" />`,
})
export class MenuProfileMenuScenario {
  protected readonly items: MenuItem[] = Array.from({ length: 4 }, () =>
    ({ profile: { title: 'David Smith', subtitle: 'Senior Engineering Manager', body: 'Uber Everything' } }));
}

// menu-propagation.scenario.tsx — menu de 4 itens (a propagação é comportamental).
@Component({
  selector: 'bui-s-menu-propagation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu [items]="items" />`,
})
export class MenuPropagationScenario {
  protected readonly items: MenuItem[] = [
    { label: 'Item One' }, { label: 'Item Two' }, { label: 'Item Three' }, { label: 'Item Four' },
  ];
}

// menu-grouped-items.scenario.tsx — grupos com cabeçalho.
@Component({
  selector: 'bui-s-menu-grouped-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu],
  template: `<bui-menu style="${W}" [items]="items" />`,
})
export class MenuGroupedItemsScenario {
  protected readonly items: MenuItem[] = [
    { label: 'Black' },
    { header: 'Group 1' }, { label: 'AliceBlue' }, { label: 'Aqua' }, { label: 'Aquamarine' },
    { header: 'Group 2' }, { label: 'AntiqueWhite' }, { label: 'Azure' }, { label: 'Beige' },
  ];
}

const RECENT_FILES: MenuItem[] = [
  { label: 'Reopen Closed Editor' },
  { label: '~/workspace/baseui' },
  { label: '~/workspace/styletron' },
  { label: '~/workspace/my-project' },
  { label: 'More...' },
  { label: 'Clear Recently Opened' },
];

const BREAKPOINTS: MenuItem[] = [
  { label: 'Conditional Breakpoint...' },
  { label: 'Inline Breakpoint' },
  { label: 'Function Breakpoint...' },
  { label: 'Logpoint...' },
];

const FILE_ITEMS: MenuItem[] = [
  { label: 'New File' },
  { label: 'New Window' },
  { label: 'Open...' },
  { label: 'Open Workspace...' },
  { label: 'Open Recent ->', children: RECENT_FILES },
  { label: 'Add Folder to Workspace...' },
  { label: 'Save' },
  { label: 'Save As...' },
  { label: 'Toggle Breakpoint' },
  { label: 'New Breakpoint ->', children: BREAKPOINTS },
  { label: 'Close Folder' },
  { label: 'Close Window' },
];

// menu-child.scenario.tsx — nested menus with child submenus on hover
@Component({
  selector: 'bui-s-menu-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu, BuiNestedMenus],
  template: `
    <div style="margin:20px">
      <bui-nested-menus>
        <bui-menu style="width:300px;overflow:auto" [items]="items" ariaLabel="File menu" size="compact" (itemSelect)="log($event)" />
      </bui-nested-menus>
      <ul id="menu-child-click-log">
        @for (e of clickLog(); track $index) { <li>{{ e }}</li> }
      </ul>
    </div>
  `,
})
export class MenuChildScenario {
  protected readonly items = FILE_ITEMS;
  protected readonly clickLog = signal<string[]>([]);
  protected log(item: MenuItem): void {
    this.clickLog.update((log) => [...log, item.label ?? '']);
  }
}

// menu-child-render-all.scenario.tsx — same but renderAll (all child menus in DOM)
@Component({
  selector: 'bui-s-menu-child-render-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu, BuiNestedMenus],
  template: `
    <bui-nested-menus>
      <bui-menu
        style="width:300px;overflow:auto"
        [items]="items"
        ariaLabel="File menu"
        size="compact"
        renderAll
      />
    </bui-nested-menus>
  `,
})
export class MenuChildRenderAllScenario {
  protected readonly items: MenuItem[] = [
    { label: 'Server' },
    { label: 'Side' },
    { label: 'Rendered ->', children: [
      { label: 'Rendered' }, { label: 'SSR' }, { label: '(check source!)' },
      { label: 'And' }, { label: 'When' }, { label: 'Closed' },
    ]},
  ];
}

// menu-child-in-popover.scenario.tsx — nested menu inside a popover
@Component({
  selector: 'bui-s-menu-child-in-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiMenu, BuiNestedMenus, BuiPopover],
  template: `
    <bui-popover>
      <button>click</button>
      <bui-nested-menus buiPopoverContent>
        <bui-menu style="width:300px;overflow:auto" [items]="items" ariaLabel="File menu" size="compact" />
      </bui-nested-menus>
    </bui-popover>
    <div style="background:lightgreen;position:absolute;z-index:1;height:400px;width:100%;top:100px">overlay</div>
  `,
})
export class MenuChildInPopoverScenario {
  protected readonly items = FILE_ITEMS;
}

// menu-virtualized.scenario.tsx — 1500 items with CDK virtual scroll
@Component({
  selector: 'bui-s-menu-virtualized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport
      itemSize="36"
      tabindex="0"
      role="listbox"
      aria-label="Large menu"
      style="height:500px;border-radius:8px;box-shadow:var(--bw-shadow-600);background:var(--bw-background-primary);outline:none"
    >
      <div
        *cdkVirtualFor="let item of items; trackBy: trackItem"
        role="option"
        style="font:var(--bw-font-ParagraphSmall);box-sizing:border-box;padding:8px 16px;cursor:pointer;color:var(--bw-content-primary);height:36px;display:flex;align-items:center"
      >{{ item.label }}</div>
    </cdk-virtual-scroll-viewport>
  `,
})
export class MenuVirtualizedScenario {
  protected readonly items = Array.from({ length: 1500 }, (_, i) => ({
    label: `item number: ${i + 1}`,
  }));
  protected trackItem(_: number, item: { label: string }): string {
    return item.label;
  }
}
