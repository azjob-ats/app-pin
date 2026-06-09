import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiMenu, MenuItem } from './menu.component';

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
