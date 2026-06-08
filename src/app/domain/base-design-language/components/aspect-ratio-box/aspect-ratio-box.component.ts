import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, numberAttribute } from '@angular/core';

/**
 * AspectRatioBox — clone fiel do `baseui/aspect-ratio-box`. Mantém uma proporção
 * (`aspectRatio = largura / altura`) usando o truque do `padding-top` num pseudo
 * `::before` (`100 / aspectRatio %`) + `::after` clearfix. Sem largura própria → ocupa
 * a do pai; a altura segue a proporção. O conteúdo vai num `bui-aspect-ratio-box-body`.
 */
@Component({
  selector: 'bui-aspect-ratio-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styleUrl: './aspect-ratio-box.component.scss',
  host: {
    'data-baseweb': 'aspect-ratio-box',
    class: 'bui-arb',
    '[style.--bui-arb-pad]': 'padCss()',
  },
})
export class AspectRatioBox {
  /** Proporção largura/altura. Default `1` (quadrado). Ex.: `16/9`. */
  readonly aspectRatio = input(1, { transform: numberAttribute });

  protected readonly padCss = computed(() => `${100 / this.aspectRatio()}%`);
}

/**
 * AspectRatioBoxBody — clone do `AspectRatioBoxBody`. `position:absolute`, `top/bottom:0`,
 * `width:100%` (preenche a caixa de proporção). Estilo extra (flex, borda) via `style`.
 */
@Component({
  selector: 'bui-aspect-ratio-box-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styleUrl: './aspect-ratio-box.component.scss',
  host: {
    'data-baseweb': 'aspect-ratio-box-body',
    class: 'bui-arb-body',
  },
})
export class AspectRatioBoxBody {}
