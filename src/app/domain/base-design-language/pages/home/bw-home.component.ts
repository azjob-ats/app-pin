import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../components/button/button.component';
import { bwLink } from '../../documentation/navigation/nav.config';

interface HomeCard {
  title: string;
  text: string;
  link: string;
  external?: boolean;
}

/** Home do site — fiel à landing do documentation-site do Base Web. */
@Component({
  selector: 'bdl-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, Button],
  templateUrl: './bw-home.component.html',
  styleUrl: './bw-home.component.scss',
})
export class BwHomeComponent {
  protected readonly link = bwLink;

  protected readonly cards: HomeCard[] = [
    { title: 'Setup Base Web', text: 'Adicione o Design System ao seu projeto e comece em minutos.', link: 'getting-started/setup' },
    { title: 'Learning Base Web', text: 'Entenda os conceitos, tokens e padrões por trás dos componentes.', link: 'getting-started/learn' },
    { title: 'Theming', text: 'Customize cores, tipografia e tokens — light e dark.', link: 'guides/theming' },
    { title: 'Components', text: 'Explore a galeria completa de componentes.', link: 'components' },
    { title: 'Blog', text: 'Novidades, decisões de design e bastidores do Base Web.', link: 'blog' },
  ];
}
