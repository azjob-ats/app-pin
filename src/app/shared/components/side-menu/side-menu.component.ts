import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  output,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuApi } from '@shared/apis/menu.api';
import { MenuSection, MenuSectionDetail, MenuItem } from '@shared/interfaces/entity/menu';
import { ComponentIntegratorComponent } from '@shared/components/component-integrator/component-integrator.component';

type NavLevel = 'sections' | 'items' | 'detail';

interface NavState {
  level: NavLevel;
  section?: MenuSectionDetail;
  item?: MenuItem;
}

@Component({
  selector: 'app-side-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComponentIntegratorComponent],
  styleUrl: './side-menu.component.scss',
  template: `
    @if (loading()) {
      <div class="side-menu-loading" aria-busy="true" aria-label="Carregando menu">
        @for (_ of [1, 2, 3]; track $index) {
          <div class="side-menu-skeleton"></div>
        }
      </div>
    } @else {
      @switch (navState().level) {
        @case ('sections') {
          <ul class="side-menu-list" role="list">
            @for (section of sections(); track section.id) {
              <li>
                <button
                  class="side-menu-row"
                  type="button"
                  [attr.aria-label]="section.name"
                  (click)="openSection(section.id)">
                  <div class="side-menu-row__content">
                    <span class="side-menu-row__title">{{ section.name }}</span>
                    <span class="side-menu-row__desc">{{ section.description }}</span>
                  </div>
                  <span class="material-symbols-rounded side-menu-row__arrow" aria-hidden="true">
                    arrow_forward_ios
                  </span>
                </button>
              </li>
            }
          </ul>
        }

        @case ('items') {
          <ul class="side-menu-list" role="list">
            @for (item of navState().section!.items; track item.name) {
              <li>
                <button
                  class="side-menu-row side-menu-row--with-icon"
                  type="button"
                  [attr.aria-label]="item.name"
                  (click)="openItem(item)">
                  <span class="material-symbols-rounded side-menu-row__icon" aria-hidden="true">
                    {{ item.icon }}
                  </span>
                  <div class="side-menu-row__content">
                    <span class="side-menu-row__title">{{ item.name }}</span>
                    <span class="side-menu-row__desc">{{ item.description }}</span>
                  </div>
                  <span class="material-symbols-rounded side-menu-row__arrow" aria-hidden="true">
                    arrow_forward_ios
                  </span>
                </button>
              </li>
            }
          </ul>
        }

        @case ('detail') {
          @if (navState().item!.text) {
            <p class="side-menu-text">{{ navState().item!.text }}</p>
          } @else if (navState().item!.component) {
            <app-component-integrator
              [componentName]="navState().item!.component!.element" />
          }
        }
      }
    }
  `,
})
export class SideMenuComponent implements OnInit {
  readonly closed = output<void>();

  private readonly menuApi = inject(MenuApi);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly sections = signal<MenuSection[]>([]);
  readonly navState = signal<NavState>({ level: 'sections' });

  readonly currentTitle = computed(() => {
    const state = this.navState();
    if (state.level === 'sections') return 'Mais';
    if (state.level === 'items') return state.section!.name;
    if (state.level === 'detail') return state.item!.name;
    return 'Mais';
  });

  readonly canGoBack = computed(() => this.navState().level !== 'sections');

  ngOnInit(): void {
    this.loadSections();
  }

  goBack(): void {
    const state = this.navState();
    if (state.level === 'detail') {
      this.navState.set({ level: 'items', section: state.section });
    } else if (state.level === 'items') {
      this.navState.set({ level: 'sections' });
    }
  }

  reset(): void {
    this.navState.set({ level: 'sections' });
  }

  openSection(id: string): void {
    this.loading.set(true);
    this.menuApi.getSectionItems(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.navState.set({ level: 'items', section: res.data });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openItem(item: MenuItem): void {
    if (item.routerLink) {
      this.router.navigate([item.routerLink.link]);
      if (item.routerLink.closeMenu) {
        this.closed.emit();
      }
      return;
    }
    this.navState.update((s) => ({ ...s, level: 'detail', item }));
  }

  private loadSections(): void {
    this.loading.set(true);
    this.menuApi.getSections().subscribe({
      next: (res) => {
        this.sections.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
