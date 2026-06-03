import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Accordion — fiel a `baseui/accordion` (Root `ul`). Container que empilha `<bui-panel>`.
 * Cada Panel gerencia sua expansão (independente), como o Accordion stateless do Base Web.
 */
@Component({
  selector: 'bui-accordion',
  exportAs: 'buiAccordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content select="bui-panel" />`,
  styles: `
    .bui-accordion, bui-accordion { display: block; width: 100%; list-style: none; }
  `,
  host: { class: 'bui-accordion', role: 'presentation' },
})
export class Accordion {}
