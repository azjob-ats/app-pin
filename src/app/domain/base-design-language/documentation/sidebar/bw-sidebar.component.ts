import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BW_NAV } from '../navigation/nav.data';
import { bwLink } from '../navigation/nav.config';
import { BwNavCategory } from '../navigation/nav.model';

/** Navegação lateral do site de docs — hierarquia idêntica ao routes.jsx do Base Web. */
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
  private readonly collapsed = signal<Set<string>>(new Set());
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

  protected isCollapsed(label: string): boolean {
    return this.collapsed().has(label);
  }
  protected toggle(label: string): void {
    this.collapsed.update((s) => {
      const n = new Set(s);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });
  }
}
