import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { Avatar } from '../avatar/avatar.component';

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  active?: boolean;
  info?: unknown;
  children?: NavItem[];
  navPosition?: { desktop?: string; mobile?: string };
}

type GetUniqueId = (item: NavItem) => string | number;

/* ── Utilities ─────────────────────────────────────────────────────────────── */

function mapItemsActive(items: NavItem[], predicate: (item: NavItem) => boolean): NavItem[] {
  return items.map((current) => {
    const updated: NavItem = { ...current, active: predicate(current) };
    if (updated.children) {
      updated.children = mapItemsActive(updated.children, predicate);
      if (updated.children.some((c) => c.active)) updated.active = true;
    }
    return updated;
  });
}

export function setItemActive(
  items: NavItem[],
  item: NavItem,
  getUniqueIdentifier: GetUniqueId = (i) => i.label
): NavItem[] {
  return mapItemsActive(items, (current) => getUniqueIdentifier(current) === getUniqueIdentifier(item));
}

/* ── AppNavBar ──────────────────────────────────────────────────────────────── */

@Component({
  selector: 'bui-app-nav-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet, OverlayModule, Avatar],
  styleUrl: './app-nav-bar.component.scss',
  template: `
    <div class="bui-anb__root" data-baseweb="app-nav-bar">
      <!-- Desktop Nav -->
      <div class="bui-anb__desktop">
        <div class="bui-anb__menu">
          <!-- Title/Logo -->
          <div class="bui-anb__name">
            @if (titleTemplate()) {
              <ng-container [ngTemplateOutlet]="titleTemplate()!" />
            } @else {
              {{ title() }}
            }
          </div>

          <!-- Primary nav items -->
          <nav class="bui-anb__primary" aria-label="Main navigation">
            @for (item of mainItems(); track item.label) {
              <div
                class="bui-anb__item"
                [class.bui-anb__item--active]="isActive(item)"
                tabindex="0"
                [attr.aria-selected]="isActive(item)"
                (click)="selectMain(item)"
                (keydown.enter)="selectMain(item)"
              >
                @if (mapItemToNode()) {
                  <ng-container [ngTemplateOutlet]="mapItemToNode()!" [ngTemplateOutletContext]="{ $implicit: item }" />
                } @else {
                  {{ item.label }}
                }
              </div>
            }
          </nav>

          <!-- User menu -->
          @if (userItems().length || username()) {
            <div class="bui-anb__user">
              <button
                #userOrigin="cdkOverlayOrigin"
                cdkOverlayOrigin
                class="bui-anb__user-btn"
                type="button"
                [attr.aria-label]="'User menu for ' + (username() || 'user')"
                [attr.aria-expanded]="userMenuOpen()"
                (click)="userMenuOpen.update((v) => !v)"
              >
                <bui-avatar [name]="username()" size="scale900" />
                @if (username()) {
                  <span class="bui-anb__username">{{ username() }}</span>
                }
              </button>
              <ng-template
                cdkConnectedOverlay
                [cdkConnectedOverlayOrigin]="userOrigin"
                [cdkConnectedOverlayOpen]="userMenuOpen()"
                [cdkConnectedOverlayPositions]="userMenuPositions"
                [cdkConnectedOverlayHasBackdrop]="true"
                cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
                cdkConnectedOverlayPanelClass="bw-root"
                (backdropClick)="userMenuOpen.set(false)"
              >
                <div class="bui-anb__user-dropdown">
                  @if (username()) {
                    <div class="bui-anb__user-profile">
                      <bui-avatar [name]="username()" size="scale1400" />
                      <div class="bui-anb__user-info">
                        <div class="bui-anb__user-name">{{ username() }}</div>
                        @if (usernameSubtitle()) {
                          <div class="bui-anb__user-subtitle">{{ usernameSubtitle() }}</div>
                        }
                      </div>
                    </div>
                  }
                  @for (item of userItems(); track item.label) {
                    <div
                      class="bui-anb__user-item"
                      tabindex="0"
                      (click)="selectUser(item)"
                      (keydown.enter)="selectUser(item)"
                    >
                      {{ item.label }}
                    </div>
                  }
                </div>
              </ng-template>
            </div>
          }
        </div>
      </div>

      <!-- Secondary nav (when active primary has children) -->
      @if (secondaryItems().length) {
        <nav class="bui-anb__secondary" aria-label="Secondary navigation">
          @for (item of secondaryItems(); track item.label) {
            <div
              class="bui-anb__item bui-anb__item--secondary"
              [class.bui-anb__item--active]="isActive(item)"
              tabindex="0"
              [attr.aria-selected]="isActive(item)"
              (click)="selectMain(item)"
              (keydown.enter)="selectMain(item)"
            >
              @if (mapItemToNode()) {
                <ng-container [ngTemplateOutlet]="mapItemToNode()!" [ngTemplateOutletContext]="{ $implicit: item }" />
              } @else {
                {{ item.label }}
              }
            </div>
          }
        </nav>
      }
    </div>
  `,
})
export class BuiAppNavBar {
  readonly title = input<string>('');
  readonly titleTemplate = input<TemplateRef<void> | null>(null);
  readonly mainItems = input<NavItem[]>([]);
  readonly userItems = input<NavItem[]>([]);
  readonly username = input<string>('');
  readonly usernameSubtitle = input<string>('');
  readonly userImgUrl = input<string>('');
  readonly isMainItemActive = input<((item: NavItem) => boolean) | null>(null);
  readonly mapItemToNode = input<TemplateRef<{ $implicit: NavItem }> | null>(null);

  readonly mainItemSelect = output<NavItem>();
  readonly userItemSelect = output<NavItem>();

  protected readonly userMenuOpen = signal(false);

  protected readonly userMenuPositions = [
    { originX: 'end' as const, originY: 'bottom' as const, overlayX: 'end' as const, overlayY: 'top' as const },
  ];

  protected isActive(item: NavItem): boolean {
    const fn = this.isMainItemActive();
    return fn ? fn(item) : !!item.active;
  }

  protected readonly secondaryItems = computed((): NavItem[] => {
    const active = this.mainItems().find((i) => this.isActive(i) && i.children?.length);
    return active?.children ?? [];
  });

  protected selectMain(item: NavItem): void {
    this.mainItemSelect.emit(item);
  }

  protected selectUser(item: NavItem): void {
    this.userMenuOpen.set(false);
    this.userItemSelect.emit(item);
  }
}
