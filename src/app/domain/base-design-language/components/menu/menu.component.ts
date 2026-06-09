import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output, signal } from '@angular/core';

export type MenuSize = 'default' | 'compact';

/** Item do Menu. `divider`/`header` p/ separador/cabeçalho; `profile` p/ item de perfil. */
export interface MenuItem {
  label?: string;
  disabled?: boolean;
  divider?: boolean;
  header?: string;
  profile?: { title: string; subtitle?: string; body?: string };
}

/**
 * Menu — clone fiel do `baseui/menu` (lista de opções). `<ul role="listbox">` com itens
 * `role="option"`; item destacado (hover/teclado) recebe `menuFillHover`. Base do dropdown
 * do Select. `items` (com `disabled`/`divider`/`header`), `size`.
 */
@Component({
  selector: 'bui-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './menu.component.scss',
  template: `
    <ul class="bui-menu__list" role="listbox" [attr.aria-label]="ariaLabel()" [class.bui-menu__list--compact]="size() === 'compact'" tabindex="0">
      @if (items().length === 0) {
        <li class="bui-menu__empty" role="presentation">{{ emptyText() }}</li>
      }
      @for (item of items(); track $index) {
        @if (item.divider) {
          <li class="bui-menu__divider" role="separator"></li>
        } @else if (item.header) {
          <li class="bui-menu__header" role="presentation">{{ item.header }}</li>
        } @else if (item.profile; as p) {
          <li
            class="bui-menu__profile"
            role="option"
            [class.bui-menu__item--highlighted]="$index === highlighted()"
            (mouseenter)="onEnter($index, item)"
            (click)="select($index, item)"
          >
            <div class="bui-menu__profile-img"></div>
            <div class="bui-menu__profile-labels">
              <h6 class="bui-menu__profile-title">{{ p.title }}</h6>
              @if (p.subtitle) { <p class="bui-menu__profile-subtitle">{{ p.subtitle }}</p> }
              @if (p.body) { <p class="bui-menu__profile-body">{{ p.body }}</p> }
            </div>
          </li>
        } @else {
          <li
            class="bui-menu__item"
            role="option"
            [class.bui-menu__item--highlighted]="$index === highlighted() && !item.disabled"
            [class.bui-menu__item--disabled]="item.disabled"
            [attr.aria-disabled]="item.disabled || null"
            [attr.aria-selected]="$index === highlighted() && !item.disabled"
            (mouseenter)="onEnter($index, item)"
            (click)="select($index, item)"
          >
            {{ item.label }}
          </li>
        }
      }
    </ul>
  `,
  host: { 'data-baseweb': 'menu', class: 'bui-menu' },
})
export class BuiMenu {
  readonly items = input<MenuItem[]>([]);
  readonly size = input<MenuSize>('default');
  readonly emptyText = input('No results');
  readonly ariaLabel = input('Menu');
  /** Índice destacado inicial (StatefulMenu initialState.highlightedIndex). */
  readonly initialHighlight = input(-1);
  readonly itemSelect = output<MenuItem>();

  protected readonly highlighted = signal(-1);

  constructor() {
    queueMicrotask(() => this.highlighted.set(this.initialHighlight()));
  }

  protected onEnter(i: number, item: MenuItem): void {
    if (!item.disabled) this.highlighted.set(i);
  }
  protected select(i: number, item: MenuItem): void {
    if (item.disabled) return;
    this.highlighted.set(i);
    this.itemSelect.emit(item);
  }
}
