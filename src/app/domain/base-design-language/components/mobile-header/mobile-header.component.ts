import {
  ChangeDetectionStrategy,
  Component,
  Type,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

export type MobileHeaderType = 'fixed' | 'floating';

export interface MobileHeaderButton {
  /** Icon component (Type<unknown>) or null for text-only */
  renderIcon?: Type<unknown>;
  onClick?: () => void;
  label?: string;
}

@Component({
  selector: 'bui-mobile-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgComponentOutlet],
  styleUrl: './mobile-header.component.scss',
  template: `
    <div
      class="bui-mh"
      [class.bui-mh--fixed]="type() === 'fixed'"
      [class.bui-mh--floating]="type() === 'floating'"
      [class.bui-mh--expanded]="expanded()"
      data-baseweb="mobile-header"
    >
      <!-- Nav button (col 1) -->
      <div
        class="bui-mh__nav"
        [class.bui-mh__nav--text]="navButton() && !navButton()!.renderIcon && type() === 'fixed'"
        [class.bui-mh__nav--padded]="type() === 'floating' || (navButton() && !!navButton()!.renderIcon)"
      >
        @if (navButton(); as nb) {
          <button
            class="bui-button bui-button--tertiary bui-button--shape-pill bui-mh__btn"
            [class.bui-mh__btn--icon]="!!nb.renderIcon"
            [class.bui-mh__btn--floating]="type() === 'floating'"
            [attr.aria-label]="nb.label"
            (click)="nb.onClick && nb.onClick()"
          >
            @if (nb.renderIcon) {
              <ng-container *ngComponentOutlet="nb.renderIcon; inputs: {size: '32'}" />
            } @else {
              {{ nb.label }}
            }
          </button>
        }
      </div>

      <!-- Title (col 2, fixed only) -->
      @if (type() === 'fixed') {
        <div
          class="bui-mh__title"
          [class.bui-mh__title--expanded]="expanded()"
        >{{ title() }}</div>
      }

      <!-- Action buttons (col 3) -->
      @if (actionButtons().length > 0) {
        <div class="bui-mh__actions">
          @for (btn of actionButtons().slice(0, 2); track $index) {
            <button
              class="bui-button bui-button--tertiary bui-button--shape-pill bui-mh__btn"
              [class.bui-mh__btn--icon]="!!btn.renderIcon"
              [class.bui-mh__btn--floating]="type() === 'floating'"
              [attr.aria-label]="btn.label"
              (click)="btn.onClick && btn.onClick()"
            >
              @if (btn.renderIcon) {
                <ng-container *ngComponentOutlet="btn.renderIcon; inputs: {size: '32'}" />
              } @else {
                {{ btn.label }}
              }
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class BuiMobileHeader {
  readonly type = input<MobileHeaderType>('fixed');
  readonly title = input('');
  readonly expanded = input(false, { transform: booleanAttribute });
  readonly navButton = input<MobileHeaderButton | null>(null);
  readonly actionButtons = input<MobileHeaderButton[]>([]);
}
