import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Button } from '../../../components/button/button.component';
import { BwDocExample, BwDocPage, BwDocSection } from '../../../documentation/doc-kit/bw-doc-kit';
import { BwYardComponent } from '../../../playground/bw-yard.component';
import { BwYardCodeFn, BwYardControl } from '../../../playground/yard.model';

/** Página de documentação fiel do Button (Yard-first), clone do baseweb.design/components/button. */
@Component({
  selector: 'bdl-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BwYardComponent, BwDocPage, BwDocSection, BwDocExample],
  templateUrl: './button.page.component.html',
  styles: `
    .bdl-api { width: 100%; border-collapse: collapse; border: 1px solid var(--bw-border-opaque); border-radius: var(--bw-radius-300); overflow: hidden; font: var(--bw-font-ParagraphSmall); }
    .bdl-api th, .bdl-api td { padding: var(--bw-sizing-scale400) var(--bw-sizing-scale500); text-align: left; border-bottom: 1px solid var(--bw-border-opaque); vertical-align: top; }
    .bdl-api th { background: var(--bw-background-secondary); font: var(--bw-font-LabelSmall); color: var(--bw-content-secondary); }
    .bdl-api td { color: var(--bw-content-secondary); }
    .bdl-api code { font-family: var(--bw-font-family-mono); font-size: 12px; color: var(--bw-content-accent); }
    .bdl-api tbody tr:last-child td { border-bottom: none; }
  `,
})
export class BwButtonPageComponent {
  protected readonly controls: BwYardControl[] = [
    { name: 'children', label: 'children', type: 'string', default: 'Hello' },
    { name: 'kind', type: 'enum', options: ['primary', 'secondary', 'tertiary', 'dangerPrimary', 'dangerSecondary', 'dangerTertiary'], default: 'primary' },
    { name: 'size', type: 'enum', options: ['mini', 'compact', 'default', 'large'], default: 'default' },
    { name: 'shape', type: 'enum', options: ['default', 'pill', 'circle', 'square'], default: 'default' },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'isLoading', type: 'boolean', default: false },
    { name: 'isSelected', type: 'boolean', default: false },
    { name: 'startEnhancer', type: 'boolean', default: false, advanced: true },
    { name: 'block', type: 'boolean', default: false, advanced: true },
  ];

  protected readonly codeFn: BwYardCodeFn = (s) => {
    const attrs = [`kind="${s['kind']}"`, `size="${s['size']}"`];
    if (s['shape'] !== 'default') attrs.push(`shape="${s['shape']}"`);
    if (s['disabled']) attrs.push('[disabled]="true"');
    if (s['isLoading']) attrs.push('[isLoading]="true"');
    if (s['isSelected']) attrs.push('[isSelected]="true"');
    if (s['block']) attrs.push('[block]="true"');
    const label = (s['children'] as string) || 'Button';
    const body = s['startEnhancer']
      ? `\n  <span buiStartEnhancer class="material-symbols-rounded">add</span>\n  ${label}\n`
      : label;
    return `<bui-button ${attrs.join(' ')}>${body}</bui-button>`;
  };

  protected readonly themeCode = `// tokens consumidos pelo Button
--bw-button-primary-fill     // = background-inverse-primary
--bw-button-primary-text     // = content-inverse-primary
--bw-button-secondary-fill   // = background-secondary
--bw-button-tertiary-fill    // transparent
--bw-overlay-hover / --bw-overlay-pressed   // hover/active`;

  protected readonly kinds = ['primary', 'secondary', 'tertiary', 'dangerPrimary', 'dangerSecondary', 'dangerTertiary'] as const;
  protected readonly sizes = ['mini', 'compact', 'default', 'large'] as const;

  protected readonly inputs = [
    { name: 'kind', type: "'primary' | 'secondary' | 'tertiary' | 'dangerPrimary' | 'dangerSecondary' | 'dangerTertiary'", def: "'primary'" },
    { name: 'size', type: "'mini' | 'compact' | 'default' | 'large'", def: "'default'" },
    { name: 'shape', type: "'default' | 'pill' | 'round' | 'circle' | 'square' | 'rectangular' | 'rounded'", def: "'default'" },
    { name: 'disabled', type: 'boolean', def: 'false' },
    { name: 'isLoading', type: 'boolean', def: 'false' },
    { name: 'isSelected', type: 'boolean', def: 'false' },
    { name: 'block', type: 'boolean', def: 'false' },
    { name: 'href', type: 'string | null', def: 'null' },
    { name: '(buttonClick)', type: 'MouseEvent', def: '—' },
  ];
}
