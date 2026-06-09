import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';

export type BreadcrumbSeparator = 'chevron' | 'pseudo' | 'icon-override';

/**
 * Breadcrumbs — clone fiel de `baseui/breadcrumbs`. `<nav><ol>` com itens `<li>` projetados
 * (links/`<span>`); o separador (ChevronRight 16px, `breadcrumbsSeparatorFill`) é renderizado
 * via `::after` mascarado entre os itens — `showTrailingSeparator` mostra também após o último.
 *
 * **Independência Angular:** o original embrulha cada child num `ListItem` + `Separator` em runtime;
 * aqui o consumidor escreve os `<li>` e o separador vem do CSS (`li:not(:last-child)::after`),
 * preservando a marcação semântica `nav > ol > li`. `separator="pseudo"` troca o chevron por `>`
 * (story pseudo); `"icon-override"` aproxima o override de ícone (X verde) — API de tema do React.
 */
@Component({
  selector: 'bui-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './breadcrumbs.component.scss',
  template: `
    <nav [attr.aria-label]="ariaLabel()" data-baseweb="breadcrumbs">
      <ol class="bui-breadcrumbs__list"><ng-content /></ol>
    </nav>
  `,
  host: {
    class: 'bui-breadcrumbs',
    '[class.bui-breadcrumbs--trailing]': 'showTrailingSeparator()',
    '[class.bui-breadcrumbs--pseudo]': "separator() === 'pseudo'",
    '[class.bui-breadcrumbs--icon-override]': "separator() === 'icon-override'",
  },
})
export class BuiBreadcrumbs {
  readonly ariaLabel = input<string>('Breadcrumbs navigation');
  readonly showTrailingSeparator = input(false, { transform: booleanAttribute });
  readonly separator = input<BreadcrumbSeparator>('chevron');
}
