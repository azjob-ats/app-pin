import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BW_NAV } from '../navigation/nav.data';
import { bwLink } from '../navigation/nav.config';
import { BwNavCategory } from '../navigation/nav.model';

/** Sidebar do docs — plana (categorias em caixa alta + subgrupos + itens), como o Base Web. */
@Component({
  selector: 'bdl-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bw-sidebar.component.html',
  styleUrl: './bw-sidebar.component.scss',
  host: { class: 'bdl-sidebar' },
})
export class BwSidebarComponent {
  readonly query = input<string>('');
  protected readonly link = bwLink;

  protected readonly nav = computed<BwNavCategory[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return BW_NAV;
    return BW_NAV.map((cat) => ({
      ...cat,
      groups: cat.groups
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) => i.label.toLowerCase().includes(q) || (i.keywords ?? []).some((k) => k.includes(q)),
          ),
        }))
        .filter((g) => g.items.length > 0),
    })).filter((c) => c.groups.length > 0);
  });
}
