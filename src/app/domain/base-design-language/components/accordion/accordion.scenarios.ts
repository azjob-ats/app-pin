import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { Accordion } from './accordion.component';
import { Panel } from './panel.component';

/** Scenarios portadas de `src/accordion/__tests__/*.scenario.tsx`. */

@Component({
  selector: 'bui-s-accordion', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    <bui-panel title="Accordion panel 1">panel 1</bui-panel>
    <bui-panel title="Accordion panel 2">panel 2</bui-panel>
    <bui-panel title="Accordion panel 3">panel 3</bui-panel>
  </bui-accordion>`,
})
export class AccordionScenario {}

@Component({
  selector: 'bui-s-accordion-expanded', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    <bui-panel title="Default panel">stateless panel</bui-panel>
    <bui-panel title="Expanded provided as prop" [expanded]="true">stateless panel</bui-panel>
    <bui-panel title="Initial state expanded" [initialExpanded]="true">stateful panel</bui-panel>
  </bui-accordion>`,
})
export class ExpandedScenario {}

// Original: `<Accordion disabled>` com 2 panels colapsados. `disabled` propaga a todos;
// no clone aplicamos por panel (mesmo resultado visual).
@Component({
  selector: 'bui-s-accordion-disabled', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    <bui-panel title="Default panel" [disabled]="true">stateless panel</bui-panel>
    <bui-panel title="Expanded provided as prop" [disabled]="true">stateless panel</bui-panel>
  </bui-accordion>`,
})
export class DisabledScenario {}

// Original: Accordion `accordion={false}` (multi-open), expanded inicial [L1, L2],
// override Content `fontFamily: 'fantasy'`.
@Component({
  selector: 'bui-s-accordion-controlled', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  styles: `.bui-s-fantasy .bui-panel__content { font-family: fantasy; }`,
  template: `<div class="bui-s-fantasy"><bui-accordion>
    <bui-panel title="Litany I" [expanded]="open().has('L1')" (expandedChange)="toggle('L1', $event)">I must not fear.</bui-panel>
    <bui-panel title="Litany II" [expanded]="open().has('L2')" (expandedChange)="toggle('L2', $event)">Fear is the mind-killer.</bui-panel>
    <bui-panel title="Litany III" [expanded]="open().has('L3')" (expandedChange)="toggle('L3', $event)">Fear is the little-death that brings total obliteration.</bui-panel>
  </bui-accordion></div>`,
})
export class ControlledScenario {
  protected readonly open = signal<Set<string>>(new Set(['L1', 'L2']));
  protected toggle(key: string, isOpen: boolean): void {
    this.open.update((s) => {
      const n = new Set(s);
      isOpen ? n.add(key) : n.delete(key);
      return n;
    });
  }
}

// Original: StatelessAccordion `accordion={false}` (multi-open), expanded inicial [P1, P2].
@Component({
  selector: 'bui-s-accordion-stateless', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    <bui-panel title="Panel 1" [expanded]="open().has('P1')" (expandedChange)="toggle('P1', $event)">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</bui-panel>
    <bui-panel title="Panel 2" [expanded]="open().has('P2')" (expandedChange)="toggle('P2', $event)">Quisque luctus eu sem et pharetra.</bui-panel>
    <bui-panel title="Panel 3" [expanded]="open().has('P3')" (expandedChange)="toggle('P3', $event)">Proin egestas dui sed semper iaculis.</bui-panel>
  </bui-accordion>`,
})
export class StatelessAccordionScenario {
  protected readonly open = signal<Set<string>>(new Set(['P1', 'P2']));
  protected toggle(key: string, isOpen: boolean): void {
    this.open.update((s) => {
      const n = new Set(s);
      isOpen ? n.add(key) : n.delete(key);
      return n;
    });
  }
}

// Original: override de `ToggleIcon` — troca o chevron por texto "expand(override)" /
// "collapse(override)" conforme estado. 2 panels; "hello_world" começa expandido.
@Component({
  selector: 'bui-s-accordion-override', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    <bui-panel title="hello" [expanded]="a()" (expandedChange)="a.set($event)">
      <span buiPanelToggle>{{ a() ? 'collapse(override)' : 'expand(override)' }}</span>
      hello puppeteer!
    </bui-panel>
    <bui-panel title="hello_world" [expanded]="b()" (expandedChange)="b.set($event)">
      <span buiPanelToggle>{{ b() ? 'collapse(override)' : 'expand(override)' }}</span>
      hello world!
    </bui-panel>
  </bui-accordion>`,
})
export class PanelOverrideScenario {
  protected readonly a = signal(false);
  protected readonly b = signal(true);
}
