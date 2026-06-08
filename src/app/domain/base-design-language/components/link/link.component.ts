import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';

/**
 * Link — clone fiel do `baseui/link` (`StyledLink`). Aplica-se a uma âncora:
 * `<a buiLink href="…">`. Cor `linkText`(=contentPrimary), `font350` com `font-size`/
 * `line-height` herdados do pai, sublinhado `under`. Estados: hover/visited/active e
 * foco. O tracking JS de `focusVisible` do original é substituído pelo `:focus-visible`
 * nativo (arquitetura Angular independente).
 *
 * `animateUnderline`: troca o sublinhado por gradiente animado que varre em hover.
 */
@Component({
  selector: 'a[buiLink]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styleUrl: './link.component.scss',
  host: {
    'data-baseweb': 'link',
    class: 'bui-link',
    '[class.bui-link--animate]': 'animateUnderline()',
  },
})
export class Link {
  /** Sublinhado animado (gradiente que varre em hover) no lugar do `text-decoration`. */
  readonly animateUnderline = input(false, { transform: booleanAttribute });
}
