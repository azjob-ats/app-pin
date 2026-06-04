import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '../../../components/checkbox/checkbox.component';
import { BwDocExample, BwDocPage, BwDocSection } from '../../../documentation/doc-kit/bw-doc-kit';
import { BwYardComponent } from '../../../playground/bw-yard.component';
import { BwYardCodeFn, BwYardControl } from '../../../playground/yard.model';

/** Doc page fiel do Checkbox (Yard-first). */
@Component({
  selector: 'bdl-checkbox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, Checkbox, BwYardComponent, BwDocPage, BwDocSection, BwDocExample],
  templateUrl: './checkbox.page.component.html',
})
export class BwCheckboxPageComponent {
  protected readonly controls: BwYardControl[] = [
    { name: 'children', type: 'string', default: 'Hello' },
    { name: 'checked', type: 'boolean', default: true },
    { name: 'isIndeterminate', type: 'boolean', default: false },
    { name: 'error', type: 'boolean', default: false },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'labelPlacement', type: 'enum', options: ['right', 'left', 'top', 'bottom'], default: 'right' },
    { name: 'checkmarkType', type: 'enum', options: ['default', 'toggle'], default: 'default' },
  ];

  protected readonly codeFn: BwYardCodeFn = (s) => {
    const attrs: string[] = [];
    if (s['isIndeterminate']) attrs.push('[isIndeterminate]="true"');
    if (s['error']) attrs.push('[error]="true"');
    if (s['disabled']) attrs.push('[disabled]="true"');
    if (s['labelPlacement'] !== 'right') attrs.push(`labelPlacement="${s['labelPlacement']}"`);
    if (s['checkmarkType'] !== 'default') attrs.push(`checkmarkType="${s['checkmarkType']}"`);
    return `<bui-checkbox [(ngModel)]="checked" ${attrs.join(' ')}>${s['children']}</bui-checkbox>`;
  };

  protected readonly themeCode = `// tokens (tick*)
--bw-tick-fill            // caixa não marcada (branco)
--bw-tick-border          // borda não marcada (cinza)
--bw-tick-fill-selected   // marcado (preto)
--bw-tick-fill-error-selected  // erro marcado (vermelho)
--bw-tick-mark-fill       // o "check" (branco)`;
}
