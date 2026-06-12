import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';

export interface NavItem {
  title: string;
  itemId?: string;
  disabled?: boolean;
  subNav?: NavItem[];
}

export interface NavChangeEvent {
  item: NavItem;
  event: MouseEvent;
}

/**
 * Recursive nav item — renders a link (leaf) or a group label + optional subNav list.
 * Group labels (no itemId) are always bold + uppercase; leaf links are normal weight.
 */
@Component({
  selector: 'bui-side-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (item().itemId) {
      <a
        class="bui-sn__link"
        [attr.href]="item().itemId"
        (click)="onLinkClick($event)"
      >
        <div
          class="bui-sn__item bui-sn__item--selectable"
          [class.bui-sn__item--active]="isActive()"
          [class.bui-sn__item--disabled]="item().disabled"
          [style.padding-left]="paddingLeft()"
        >{{ item().title }}</div>
      </a>
    } @else {
      <div
        class="bui-sn__item bui-sn__item--group"
        [style.padding-left]="paddingLeft()"
      >{{ item().title }}</div>
    }

    @if (item().subNav?.length) {
      <ul class="bui-sn__sub" role="list">
        @for (sub of item().subNav!; track sub.itemId ?? sub.title) {
          <li class="bui-sn__li">
            <bui-side-nav-item
              [item]="sub"
              [level]="level() + 1"
              [activeItemId]="activeItemId()"
              (navChange)="navChange.emit($event)"
            />
          </li>
        }
      </ul>
    }
  `,
})
export class BuiSideNavItem {
  readonly item = input.required<NavItem>();
  readonly level = input(1);
  readonly activeItemId = input('/');

  readonly navChange = output<NavChangeEvent>();

  readonly isActive = computed(() => this.item().itemId === this.activeItemId());
  readonly paddingLeft = computed(() => `calc(var(--bw-sizing-scale800, 32px) * ${this.level()})`);

  onLinkClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.item().disabled) {
      this.navChange.emit({ item: this.item(), event });
    }
  }
}

/**
 * BuiSideNav — clone de baseui/side-navigation.
 * Navegação lateral com suporte a itens aninhados arbitrários, seleção e disabled.
 */
@Component({
  selector: 'bui-side-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSideNavItem],
  styleUrl: './side-navigation.component.scss',
  template: `
    <nav
      class="bui-sn"
      data-baseweb="side-navigation"
      role="navigation"
    >
      <ul class="bui-sn__sub" role="list">
        @for (item of items(); track item.itemId ?? item.title) {
          <li class="bui-sn__li">
            <bui-side-nav-item
              [item]="item"
              [level]="1"
              [activeItemId]="activeItemId()"
              (navChange)="onChange.emit($event)"
            />
          </li>
        }
      </ul>
    </nav>
  `,
})
export class BuiSideNav {
  readonly items = input<NavItem[]>([]);
  readonly activeItemId = input('/');

  readonly onChange = output<NavChangeEvent>();
}
