import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  BuiModal,
  BuiModalHeader,
  BuiModalBody,
  BuiModalFooter,
  BuiModalButton,
} from './modal.component';
import { Button } from '../button/button.component';
import { Select } from '../select/select.component';

const BODY_TEXT =
  'Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare faucibus ex, non facilisis nisl. Maecenas aliquet mauris ut tempus.';

// modal--modal
@Component({
  selector: 'bui-modal-default-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiModal, BuiModalHeader, BuiModalBody, BuiModalFooter, BuiModalButton, Button],
  template: `
    <div style="padding:16px">
      <bui-button (buttonClick)="isOpen.set(true)">Open Modal</bui-button>
      <bui-modal [isOpen]="isOpen()" (modalClose)="isOpen.set(false)" size="default">
        <bui-modal-header>Hello world</bui-modal-header>
        <bui-modal-body>{{ body }}</bui-modal-body>
        <bui-modal-footer>
          <bui-modal-button (buttonClick)="isOpen.set(false)">Cancel</bui-modal-button>
          <bui-modal-button (buttonClick)="isOpen.set(false)">Okay</bui-modal-button>
        </bui-modal-footer>
      </bui-modal>
    </div>
  `,
})
export class ModalScenario {
  isOpen = signal(true);
  body = BODY_TEXT;
}

// modal--modal-uncloseable
@Component({
  selector: 'bui-modal-uncloseable-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiModal, BuiModalHeader, BuiModalBody, BuiModalFooter, BuiModalButton, Button],
  template: `
    <div style="padding:16px">
      <bui-button (buttonClick)="isOpen.set(true)">Open Modal</bui-button>
      <bui-modal [isOpen]="isOpen()" [closeable]="false" (modalClose)="isOpen.set(false)" size="default">
        <bui-modal-header>Hello world</bui-modal-header>
        <bui-modal-body>{{ body }}</bui-modal-body>
        <bui-modal-footer>
          <bui-modal-button (buttonClick)="isOpen.set(false)">Cancel</bui-modal-button>
          <bui-modal-button (buttonClick)="isOpen.set(false)">Okay</bui-modal-button>
        </bui-modal-footer>
      </bui-modal>
    </div>
  `,
})
export class ModalUncloseableScenario {
  isOpen = signal(true);
  body = BODY_TEXT;
}

// modal--modal-select
@Component({
  selector: 'bui-modal-select-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiModal, BuiModalHeader, BuiModalBody, Button, Select],
  template: `
    <div style="padding:16px">
      <bui-button (buttonClick)="isOpen.set(true)">Open Modal</bui-button>
      <bui-modal [isOpen]="isOpen()" (modalClose)="isOpen.set(false)">
        <bui-modal-header>Hello world</bui-modal-header>
        <bui-modal-body>
          <bui-select
            [options]="colors"
            labelKey="id"
            valueKey="color"
            placeholder="Start searching"
          />
        </bui-modal-body>
      </bui-modal>
    </div>
  `,
})
export class ModalSelectScenario {
  isOpen = signal(true);
  colors = [
    { id: 'AliceBlue', color: '#F0F8FF' },
    { id: 'AntiqueWhite', color: '#FAEBD7' },
    { id: 'Aqua', color: '#00FFFF' },
    { id: 'Aquamarine', color: '#7FFFD4' },
    { id: 'Azure', color: '#F0FFFF' },
    { id: 'Beige', color: '#F5F5DC' },
  ];
}

// modal--modal-rtl
@Component({
  selector: 'bui-modal-rtl-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiModal, BuiModalHeader, BuiModalBody, BuiModalFooter, BuiModalButton, Button],
  template: `
    <div style="padding:16px" dir="rtl">
      <bui-button (buttonClick)="isOpen.set(true)">Open Modal</bui-button>
      <bui-modal [isOpen]="isOpen()" (modalClose)="isOpen.set(false)" size="default">
        <bui-modal-header>Hello world</bui-modal-header>
        <bui-modal-body>{{ body }}</bui-modal-body>
        <bui-modal-footer>
          <bui-modal-button (buttonClick)="isOpen.set(false)">Cancel</bui-modal-button>
          <bui-modal-button (buttonClick)="isOpen.set(false)">Okay</bui-modal-button>
        </bui-modal-footer>
      </bui-modal>
    </div>
  `,
})
export class ModalRtlScenario {
  isOpen = signal(true);
  body = BODY_TEXT;
}
