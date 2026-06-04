import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type DividerSize = 'cell' | 'section' | 'module';

/** Divider — fiel ao baseui/divider (border-top borderOpaque; module=4px, demais=1px). */
@Component({
  selector: 'bui-divider',
  exportAs: 'buiDivider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  styles: `
    bui-divider { display:block; border:none; border-top:1px solid var(--bw-border-opaque); }
    bui-divider[data-size="cell"] { margin:var(--bw-sizing-scale300) 0; }
    bui-divider[data-size="section"] { margin:var(--bw-sizing-scale600) 0; }
    bui-divider[data-size="module"] { margin:var(--bw-sizing-scale800) 0; border-top-width:var(--bw-sizing-scale100); }
  `,
  host: { role: 'separator', '[attr.data-size]': 'size()' },
})
export class Divider {
  readonly size = input<DividerSize>('section');
}

@Component({
  selector: 'bui-s-divider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Divider],
  template: `<div style="font:var(--bw-font-ParagraphMedium)">
    <p>cell</p><bui-divider size="cell" /><p>section</p><bui-divider size="section" /><p>module</p><bui-divider size="module" /><p>end</p>
  </div>`,
})
export class DividerScenario {}
