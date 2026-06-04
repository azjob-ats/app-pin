import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BwThemeMode } from '../../shared/bw-theme.service';
import { bwLink } from '../navigation/nav.config';

/** Cabeçalho do site de docs: marca, busca, link "Components"→Ladle, toggle de tema. */
@Component({
  selector: 'bdl-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
  templateUrl: './bw-topbar.component.html',
  styleUrl: './bw-topbar.component.scss',
  host: { class: 'bdl-topbar' },
})
export class BwTopbarComponent {
  readonly mode = input.required<BwThemeMode>();

  readonly query = output<string>();
  readonly toggleMode = output<void>();
  readonly toggleSidebar = output<void>();

  protected readonly homeLink = bwLink('');
  protected readonly ladleLink = bwLink('ladle');
  protected readonly blogLink = bwLink('blog');
  protected readonly version = 'v18.1.0';

  protected onInput(event: Event): void {
    this.query.emit((event.target as HTMLInputElement).value);
  }
}
