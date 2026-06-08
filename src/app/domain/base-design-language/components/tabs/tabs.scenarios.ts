import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiTab, BuiTabs } from './tabs.component';

/** Scenarios portadas de `src/tabs/__tests__/*.scenario.tsx`. */

// tabs.scenario.tsx — StatefulTabs com 3 abas.
@Component({
  selector: 'bui-s-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTabs, BuiTab],
  template: `
    <bui-tabs>
      <bui-tab title="Tab Link 1">Tab 1 content</bui-tab>
      <bui-tab title="Tab Link 2">Tab 2 content</bui-tab>
      <bui-tab title="Tab Link 3">Tab 3 content</bui-tab>
    </bui-tabs>
  `,
})
export class TabsScenario {}

// tabs-one-child.scenario.tsx — StatefulTabs com 1 aba.
@Component({
  selector: 'bui-s-tabs-one-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTabs, BuiTab],
  template: `
    <bui-tabs>
      <bui-tab title="Tab Link 1">Tab 1 content</bui-tab>
    </bui-tabs>
  `,
})
export class TabsOneChildScenario {}

// tabs-controlled.scenario.tsx — Tabs controlado; o painel mostra content[activeKey].
@Component({
  selector: 'bui-s-tabs-controlled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTabs, BuiTab],
  template: `
    <bui-tabs [activeKey]="activeKey()" (activeKeyChange)="activeKey.set($event)">
      <bui-tab title="Tab Link 1"><div>{{ content[+activeKey()] }}</div></bui-tab>
      <bui-tab title="Tab Link 2"><div>{{ content[+activeKey()] }}</div></bui-tab>
      <bui-tab title="Tab Link 3"><div>{{ content[+activeKey()] }}</div></bui-tab>
    </bui-tabs>
  `,
})
export class TabsControlledScenario {
  protected readonly activeKey = signal('0');
  protected readonly content = ['Tab Content 1', 'Tab Content 2', 'Tab Content 3'];
}
