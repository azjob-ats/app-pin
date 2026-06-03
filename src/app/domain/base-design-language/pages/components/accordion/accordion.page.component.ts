import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Accordion } from '../../../components/accordion/accordion.component';
import { Panel } from '../../../components/accordion/panel.component';
import { BwDocExample, BwDocPage, BwDocSection } from '../../../documentation/doc-kit/bw-doc-kit';
import { BwYardComponent } from '../../../playground/bw-yard.component';
import { BwYardCodeFn, BwYardControl } from '../../../playground/yard.model';

/** Doc page fiel do Accordion (Yard-first). */
@Component({
  selector: 'bdl-accordion-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Accordion, Panel, BwYardComponent, BwDocPage, BwDocSection, BwDocExample],
  templateUrl: './accordion.page.component.html',
})
export class BwAccordionPageComponent {
  protected readonly controls: BwYardControl[] = [
    { name: 'title', type: 'string', default: 'Accordion panel' },
    { name: 'initialExpanded', type: 'boolean', default: false },
    { name: 'disabled', type: 'boolean', default: false },
  ];

  protected readonly codeFn: BwYardCodeFn = (s) => {
    const attrs = [`title="${s['title']}"`];
    if (s['initialExpanded']) attrs.push('[initialExpanded]="true"');
    if (s['disabled']) attrs.push('[disabled]="true"');
    return `<bui-accordion>\n  <bui-panel ${attrs.join(' ')}>Panel content</bui-panel>\n</bui-accordion>`;
  };

  protected readonly themeCode = `// tokens consumidos pelo Accordion
--bw-border-opaque       // divisória entre panels
--bw-content-primary     // título/conteúdo
--bw-content-tertiary    // chevron
--bw-font-LabelMedium    // header
--bw-font-ParagraphSmall // conteúdo`;
}
