import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BwLadleGroup, ladleGroups } from '../../ladle/stories.registry';
import { bwLink } from '../../documentation/navigation/nav.config';
import { BwThemeService } from '../../shared/bw-theme.service';

type Width = 'full' | '1024' | '768' | '360';

/**
 * Casca do Ladle (clone): busca + árvore colapsável de TODOS os componentes (com
 * stories como folhas) + toolbar global (tema, largura/viewport, RTL, copiar, código).
 * Roteamento por `?story=<grupo>--<nome>`.
 */
@Component({
  selector: 'bdl-ladle-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, NgComponentOutlet],
  templateUrl: './bw-ladle-shell.component.html',
  styleUrl: './bw-ladle-shell.component.scss',
  host: {
    class: 'bw-root bdl-ladle',
    '[attr.data-bw-theme]': 'mode()',
    '[attr.dir]': 'direction()',
  },
})
export class BwLadleShellComponent {
  private readonly theme = inject(BwThemeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly mode = this.theme.mode;
  protected readonly direction = this.theme.direction;
  protected readonly docsLink = bwLink('');

  private readonly allGroups = ladleGroups();
  protected readonly query = signal('');
  protected readonly expanded = signal<Set<string>>(new Set());
  protected readonly width = signal<Width>('full');
  protected readonly showCode = signal(false);
  protected readonly copied = signal(false);

  private readonly storyId = toSignal(
    this.route.queryParamMap.pipe(map((q) => q.get('story') ?? '')),
    { initialValue: '' },
  );
  private readonly themeParam = toSignal(
    this.route.queryParamMap.pipe(map((q) => q.get('theme'))),
    { initialValue: null },
  );
  protected readonly currentId = this.storyId;
  protected readonly current = computed(() =>
    this.allGroups.flatMap((g) => g.stories).find((s) => s.id === this.storyId()),
  );
  protected readonly storyComponent = signal<Type<unknown> | null>(null);

  protected readonly groups = computed<BwLadleGroup[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.allGroups;
    return this.allGroups
      .map((g) => ({
        ...g,
        stories: g.stories.filter((s) => s.name.toLowerCase().includes(q)),
      }))
      .filter((g) => g.label.toLowerCase().includes(q) || g.stories.length > 0);
  });

  protected readonly canvasMaxWidth = computed(() =>
    this.width() === 'full' ? '100%' : `${this.width()}px`,
  );

  constructor() {
    // Sincroniza tema via URL (?theme=dark) — paridade com o Ladle do Base Web.
    effect(() => {
      const t = this.themeParam();
      if (t === 'dark' || t === 'light') {
        this.theme.setMode(t);
      }
    });
    effect(() => {
      const entry = this.current();
      if (entry) {
        // auto-expande o grupo da story atual
        this.expanded.update((set) => new Set(set).add(entry.group));
        void entry.load().then((c) => this.storyComponent.set(c));
      } else {
        this.storyComponent.set(null);
      }
    });
  }

  protected isExpanded(slug: string): boolean {
    return this.expanded().has(slug) || !!this.query().trim();
  }
  protected toggleGroup(slug: string): void {
    this.expanded.update((set) => {
      const n = new Set(set);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });
  }
  protected select(id: string): void {
    void this.router.navigate([], { queryParams: { story: id }, queryParamsHandling: 'merge' });
  }
  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  protected toggleMode(): void {
    this.theme.toggleMode();
  }
  protected toggleDir(): void {
    this.theme.toggleDirection();
  }
  protected cycleWidth(): void {
    const order: Width[] = ['full', '1024', '768', '360'];
    this.width.update((w) => order[(order.indexOf(w) + 1) % order.length]);
  }
  protected copyLink(): void {
    void navigator.clipboard?.writeText(window.location.href).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1200);
    });
  }
}
