import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, computed, input } from '@angular/core';

export type NavAlign = 'left' | 'center' | 'right';

/**
 * HeaderNavigation — clone de `baseui/header-navigation`. `<nav>` flex com `ul[buiNavList]`
 * (alinhadas left/center/right) e `li[buiNavItem]`. Nenhum token novo.
 */
@Component({
  selector: 'bui-header-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './header-navigation.component.scss',
  template: `<ng-content />`,
  host: { 'data-baseweb': 'header-navigation', role: 'navigation', class: 'bui-header-nav' },
})
export class BuiHeaderNavigation {}

/** Lista de navegação alinhada (left/center/right). Host = `<ul>`. */
@Directive({
  selector: 'ul[buiNavList]',
  host: { '[class]': 'cls()' },
})
export class BuiNavList {
  readonly align = input<NavAlign>('left');
  protected readonly cls = computed(() => `bui-header-nav__list bui-header-nav__list--${this.align()}`);
}

/** Item de navegação. Host = `<li>`. */
@Directive({
  selector: 'li[buiNavItem]',
  host: { class: 'bui-header-nav__item' },
})
export class BuiNavItem {}
