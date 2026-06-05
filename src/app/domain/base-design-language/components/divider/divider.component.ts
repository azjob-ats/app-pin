import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** Tamanhos do Divider (Base Web SIZE). `cell`/`section` = 1px; `module` = 4px. */
export type DividerSize = 'cell' | 'section' | 'module';

/**
 * Divider — clone fiel do `baseui/divider`. Renderiza um `<hr role="separator">` com
 * borda superior `borderOpaque`; espessura 1px (`cell`/`section`) ou `scale100`=4px
 * (`module`). Aplica-se a um elemento `<hr>`: `<hr buiDivider size="module">`.
 */
@Component({
  selector: 'hr[buiDivider]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  styleUrl: './divider.component.scss',
  host: {
    role: 'separator',
    'aria-hidden': 'true',
    class: 'bui-divider',
    '[class.bui-divider--module]': 'size() === "module"',
  },
})
export class Divider {
  /** Espessura/uso do divisor. Default `section` (1px). */
  readonly size = input<DividerSize>('section');
}
