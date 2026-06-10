import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
  output,
} from '@angular/core';
import { Button } from '../button/button.component';

export type ModalSize = 'default' | 'full' | 'auto';
export type ModalRole = 'dialog' | 'alertdialog';
export type ModalCloseSource = 'closeButton' | 'backdrop' | 'escape';

const CLOSE_ICON =
  'M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L12 10.5858L15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711L13.4142 12L16.7071 15.2929C17.0976 15.6834 17.0976 16.3166 16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071L12 13.4142L8.70711 16.7071C8.31658 17.0976 7.68342 17.0976 7.29289 16.7071C6.90237 16.3166 6.90237 15.6834 7.29289 15.2929L10.5858 12L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z';

// ── BuiModal ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './modal.component.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    <div
      class="bui-modal__root"
      [class.bui-modal__root--open]="isOpen()"
    >
      <div
        class="bui-modal__container"
        [class.bui-modal__container--open]="isOpen()"
        [class.bui-modal__container--animate]="animate()"
        (click)="onBackdropClick()"
      >
        <div
          class="bui-modal__dialog"
          [class.bui-modal__dialog--open]="isOpen()"
          [class.bui-modal__dialog--animate]="animate()"
          [class.bui-modal__dialog--size-full]="size() === 'full'"
          [class.bui-modal__dialog--size-auto]="size() === 'auto'"
          [attr.role]="role()"
          aria-modal="true"
          tabindex="-1"
          (click)="$event.stopPropagation()"
        >
          @if (closeable()) {
            <button
              class="bui-modal__close"
              type="button"
              aria-label="Close"
              (click)="close('closeButton')"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <path [attr.d]="closeIconPath" />
              </svg>
            </button>
          }
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class BuiModal {
  readonly isOpen = input(false, { transform: booleanAttribute });
  readonly closeable = input(true, { transform: booleanAttribute });
  readonly animate = input(true, { transform: booleanAttribute });
  readonly size = input<ModalSize>('default');
  readonly role = input<ModalRole>('dialog');

  readonly modalClose = output<ModalCloseSource>();

  protected readonly closeIconPath = CLOSE_ICON;

  close(source: ModalCloseSource): void {
    this.modalClose.emit(source);
  }

  protected onBackdropClick(): void {
    if (this.closeable()) this.close('backdrop');
  }

  protected onEscape(): void {
    if (this.isOpen() && this.closeable()) this.close('escape');
  }
}

// ── BuiModalHeader ────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-modal-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="bui-modal-header"><ng-content /></div>`,
})
export class BuiModalHeader {}

// ── BuiModalBody ──────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-modal-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="bui-modal-body"><ng-content /></div>`,
})
export class BuiModalBody {}

// ── BuiModalFooter ────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-modal-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="bui-modal-footer"><ng-content /></div>`,
})
export class BuiModalFooter {}

// ── BuiModalButton ────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-modal-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <bui-button kind="secondary" (buttonClick)="onClick()">
      <ng-content />
    </bui-button>
  `,
})
export class BuiModalButton {
  readonly buttonClick = output<void>();
  protected onClick(): void { this.buttonClick.emit(); }
}
