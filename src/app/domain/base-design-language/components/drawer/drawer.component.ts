import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import { Button } from '../button/button.component';
import { Select } from '../select/select.component';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'default' | 'full' | 'auto' | (string & {});
export type DrawerCloseSource = 'closeButton' | 'backdrop' | 'escape';

const SIZE_DIM: Record<string, string> = {
  default: '500px',
  full: '100%',
  auto: 'auto',
};

const CLOSE_ICON =
  'M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L12 10.5858L15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711L13.4142 12L16.7071 15.2929C17.0976 15.6834 17.0976 16.3166 16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071L12 13.4142L8.70711 16.7071C8.31658 17.0976 7.68342 17.0976 7.29289 16.7071C6.90237 16.3166 6.90237 15.6834 7.29289 15.2929L10.5858 12L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z';

@Component({
  selector: 'bui-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './drawer.component.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    @if (shouldRender()) {
      <div class="bui-drawer__root" [class.bui-drawer__root--open]="isOpen()" data-baseweb="drawer">
        <div
          class="bui-drawer__backdrop"
          [class.bui-drawer__backdrop--hidden]="!showBackdrop()"
          [class.bui-drawer__backdrop--visible]="isOpen()"
          [class.bui-drawer__backdrop--animate]="animate()"
          (click)="onBackdropClick()"
        ></div>
        <div
          class="bui-drawer__container"
          [class]="containerClass()"
          [style]="containerStyle()"
          role="dialog"
          [attr.aria-modal]="true"
          (click)="$event.stopPropagation()"
        >
          @if (closeable()) {
            <button
              class="bui-drawer__close"
              type="button"
              aria-label="Close"
              (click)="drawerClose.emit('closeButton')"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <path [attr.d]="closeIconPath" />
              </svg>
            </button>
          }
          <div class="bui-drawer__body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class BuiDrawer {
  readonly isOpen = input(false, { transform: booleanAttribute });
  readonly anchor = input<DrawerAnchor>('right');
  readonly size = input<DrawerSize>('default');
  readonly showBackdrop = input(true, { transform: booleanAttribute });
  readonly animate = input(true, { transform: booleanAttribute });
  readonly closeable = input(true, { transform: booleanAttribute });
  readonly renderAll = input(false, { transform: booleanAttribute });
  readonly drawerClose = output<DrawerCloseSource>();

  protected readonly closeIconPath = CLOSE_ICON;

  protected readonly shouldRender = computed(() => this.renderAll() || this.isOpen());

  protected readonly containerClass = computed(() => {
    const parts = [
      'bui-drawer__container',
      `bui-drawer__container--${this.anchor()}`,
    ];
    if (this.isOpen()) parts.push('bui-drawer__container--open');
    if (this.animate()) parts.push('bui-drawer__container--animate');
    return parts.join(' ');
  });

  protected readonly containerStyle = computed(() => {
    const s = this.size();
    const anchor = this.anchor();
    const dim = SIZE_DIM[s] ?? s;
    if (anchor === 'left' || anchor === 'right') return { width: dim };
    return { height: dim };
  });

  protected onBackdropClick(): void {
    this.drawerClose.emit('backdrop');
  }

  protected onEscape(): void {
    if (this.isOpen()) this.drawerClose.emit('escape');
  }
}

export { Button, Select };
