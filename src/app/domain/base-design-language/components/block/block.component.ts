import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/**
 * Block — primitivo de layout do Base Web. Versão Angular enxuta: aceita estilos comuns
 * via inputs (a API de props completa do Block React vira utility classes `.u-*`/style binding).
 */
@Component({
  selector: 'bui-block',
  exportAs: 'buiBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-block { display:block; }`,
  host: {
    '[style.display]': 'display() || null',
    '[style.padding]': 'padding() || null',
    '[style.margin]': 'margin() || null',
    '[style.color]': 'color() || null',
    '[style.background-color]': 'background() || null',
    '[style.font]': 'font() || null',
  },
})
export class Block {
  readonly display = input<string>('');
  readonly padding = input<string>('');
  readonly margin = input<string>('');
  readonly color = input<string>('');
  readonly background = input<string>('');
  readonly font = input<string>('');
}

@Component({
  selector: 'bui-s-block', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Block],
  template: `<bui-block display="flex" padding="16px" background="var(--bw-background-secondary)" color="var(--bw-content-primary)" font="var(--bw-font-ParagraphMedium)">
    Block — primitivo de layout
  </bui-block>`,
})
export class BlockScenario {}
