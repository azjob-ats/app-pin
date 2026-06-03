import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bwLink } from '../../documentation/navigation/nav.config';

interface HomeCard { icon: string; title: string; text: string; link: string; }

/** Landing do site de documentação Base Web (Angular). */
@Component({
  selector: 'bdl-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
  templateUrl: './bw-home.component.html',
  styleUrl: './bw-home.component.scss',
})
export class BwHomeComponent {
  protected readonly link = bwLink;
  protected readonly cards: HomeCard[] = [
    { icon: 'rocket_launch', title: 'Getting started', text: 'Setup, theming e como usar o Design System.', link: 'getting-started/setup' },
    { icon: 'palette', title: 'Foundations', text: 'Cores, tipografia, espaçamento, sombras e motion.', link: 'guides/theming' },
    { icon: 'widgets', title: 'Components', text: 'Catálogo de 89 componentes acessíveis Base Web.', link: 'components/button' },
    { icon: 'science', title: 'Components (Ladle)', text: 'Explorador de stories com tema e RTL.', link: 'ladle' },
  ];
}
