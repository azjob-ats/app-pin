import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BwSidebarComponent } from '../../documentation/sidebar/bw-sidebar.component';
import { BwTopbarComponent } from '../../documentation/topbar/bw-topbar.component';
import { BwThemeService } from '../../shared/bw-theme.service';

/**
 * Casca do site de documentação. Carrega `.bw-root` (tokens via SCSS) e compõe
 * topbar + sidebar colapsável + área de conteúdo. Reflete tema/direção do BwThemeService.
 */
@Component({
  selector: 'bdl-docs-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, BwTopbarComponent, BwSidebarComponent],
  templateUrl: './bw-docs-shell.component.html',
  styleUrl: './bw-docs-shell.component.scss',
  host: {
    class: 'bw-root bdl-docs-shell',
    '[attr.data-bw-theme]': 'mode()',
    '[attr.dir]': 'direction()',
    '[class.bdl-docs-shell--nav-open]': 'navOpen()',
  },
})
export class BwDocsShellComponent {
  private readonly theme = inject(BwThemeService);
  protected readonly mode = this.theme.mode;
  protected readonly direction = this.theme.direction;
  protected readonly query = signal('');
  protected readonly navOpen = signal(false);

  protected toggleMode(): void {
    this.theme.toggleMode();
  }
  protected setQuery(v: string): void {
    this.query.set(v);
  }
  protected toggleNav(): void {
    this.navOpen.update((v) => !v);
  }
  protected closeNav(): void {
    this.navOpen.set(false);
  }
}
