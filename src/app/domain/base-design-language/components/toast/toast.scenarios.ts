import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BuiToast, BuiToasterContainer, BuiToasterService } from './toast.component';

// toast--toast
@Component({
  selector: 'bui-toast-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiToast],
  template: `
    <div style="padding:16px;max-width:360px">
      <bui-toast>Default info notification</bui-toast>
      <bui-toast [closeable]="false">
        Info notification with no close button
      </bui-toast>
      <bui-toast kind="positive">Positive notification</bui-toast>
      <bui-toast kind="warning">Warning notification</bui-toast>
      <bui-toast kind="negative">Negative notification</bui-toast>
    </div>
  `,
})
export class ToastScenario {}

// toast--toaster
@Component({
  selector: 'bui-toaster-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiToasterContainer],
  template: `
    <div style="padding:16px">
      <bui-toaster-container [autoHideDuration]="3000" [closeable]="false" placement="bottomRight" />
      <div style="display:flex;gap:8px">
        <button (click)="showInfo()">Info toast</button>
        <button (click)="showInfoSameKey()">Info toast (same key)</button>
      </div>
    </div>
  `,
})
export class ToasterScenario {
  private readonly svc = inject(BuiToasterService);
  private _updateText = 'not updated';

  showInfo(): void {
    this.svc.info('hi', { autoHideDuration: 3000 });
  }

  showInfoSameKey(): void {
    this.svc.info(this._updateText, { key: 'same-key', autoHideDuration: 3000 });
    this._updateText = 'updated';
  }
}

// toast--toaster-focus
@Component({
  selector: 'bui-toaster-focus-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiToasterContainer],
  template: `
    <div style="padding:16px">
      <bui-toaster-container placement="bottomRight" />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies lacus non quam placerat vehicula.</p>
      <p>Maecenas ullamcorper volutpat lectus, eget placerat nisi hendrerit at. Sed at erat mauris.</p>
      <button id="default" (click)="activateToast()">Activate toast</button>
      <p>Praesent non sodales nunc. Quisque sagittis, ligula eu lacinia fringilla, urna nisi porttitor ligula, ac fringilla felis leo eu augue.</p>
      <p>Integer eget ligula magna. Morbi tincidunt fringilla consequat.</p>
      <button>This does nothing</button>
    </div>
  `,
})
export class ToasterFocusScenario {
  private readonly svc = inject(BuiToasterService);

  activateToast(): void {
    this.svc.positive('Your toast is ready.', { autoHideDuration: 5000 });
  }
}

// toast--toast-application-state
@Component({
  selector: 'bui-toast-application-state-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiToast],
  template: `
    <div id="test-container" style="padding:16px;max-width:360px">
      @for (item of values(); track item) {
        <div [attr.data-testid]="item">
          <bui-toast [closeable]="true" (toastClose)="handleClose(item)">
            <span>{{ item }}</span>
          </bui-toast>
        </div>
      }
    </div>
  `,
})
export class ToastApplicationStateScenario {
  readonly values = signal([0, 1, 2]);

  handleClose(n: number): void {
    this.values.update((vs) => vs.filter((v) => v !== n));
  }
}
