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

@Component({
  selector: 'bui-s-accordion-disabled', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    <bui-panel title="Enabled panel">content</bui-panel>
    <bui-panel title="Disabled panel" [disabled]="true">content</bui-panel>
    <bui-panel title="Disabled expanded" [disabled]="true" [initialExpanded]="true">content</bui-panel>
  </bui-accordion>`,
})
export class DisabledScenario {}

@Component({
  selector: 'bui-s-accordion-controlled', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    @for (i of [0, 1, 2]; track i) {
      <bui-panel
        [title]="'Controlled panel ' + (i + 1)"
        [expanded]="open() === i"
        (expandedChange)="open.set($event ? i : -1)"
      >controlled content {{ i + 1 }}</bui-panel>
    }
  </bui-accordion>`,
})
export class ControlledScenario {
  protected readonly open = signal(0);
}

@Component({
  selector: 'bui-s-accordion-stateless', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  template: `<bui-accordion>
    @for (i of [0, 1, 2]; track i) {
      <bui-panel
        [title]="'Stateless panel ' + (i + 1)"
        [expanded]="expanded().has(i)"
        (expandedChange)="toggle(i, $event)"
      >stateless content {{ i + 1 }}</bui-panel>
    }
  </bui-accordion>`,
})
export class StatelessAccordionScenario {
  protected readonly expanded = signal<Set<number>>(new Set([0]));
  protected toggle(i: number, open: boolean): void {
    this.expanded.update((s) => {
      const n = new Set(s);
      open ? n.add(i) : n.delete(i);
      return n;
    });
  }
}

@Component({
  selector: 'bui-s-accordion-override', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Accordion, Panel],
  styles: `.ovr .bui-panel__header { background: var(--bw-background-secondary); }`,
  template: `<div class="ovr"><bui-accordion>
    <bui-panel title="Panel with overridden header">conteúdo (override de estilo via classe/tokens)</bui-panel>
  </bui-accordion></div>`,
})
export class PanelOverrideScenario {}
