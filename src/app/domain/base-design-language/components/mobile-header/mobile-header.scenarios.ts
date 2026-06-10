import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '../button/button.component';
import { BuiArrowLeft, BuiCheck, BuiDelete, BuiPlus } from '../icon/icon.component';
import { BuiMobileHeader } from './mobile-header.component';

// mobile-header--mobile-header-fixed
@Component({
  selector: 'bui-mh-fixed-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiMobileHeader, Button],
  template: `
    <div>
      <div style="margin-bottom:20px">
        <bui-button (buttonClick)="expanded.set(!expanded())">{{ expanded() ? 'Collapse' : 'Expand' }}</bui-button>
      </div>
      <div style="display:flex;gap:20px">
        <!-- Card 1: Icon buttons -->
        <div class="bui-mh-phone">
          <bui-mobile-header
            title="Header title"
            [expanded]="expanded()"
            [navButton]="nav1"
            [actionButtons]="actions1"
          />
          <div class="bui-mh-body" tabindex="0">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>

        <!-- Card 2: Long title -->
        <div class="bui-mh-phone">
          <bui-mobile-header
            title="Excessively long title that truncates"
            [expanded]="expanded()"
            [navButton]="nav2"
            [actionButtons]="actions1"
          />
          <div class="bui-mh-body" tabindex="0">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>

        <!-- Card 3: Text buttons -->
        <div class="bui-mh-phone">
          <bui-mobile-header
            title="Text buttons"
            [expanded]="expanded()"
            [navButton]="nav3"
            [actionButtons]="actions3"
          />
          <div class="bui-mh-body" tabindex="0">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bui-mh-phone {
      width: 375px; height: 667px; border: 1px solid #ECECEC;
      border-radius: 12px; background-color: #ECECEC; overflow: auto;
    }
    .bui-mh-body { padding: 12px; height: calc(100% - 48px); overflow: auto; box-sizing: border-box; }
  `],
})
export class MobileHeaderFixedScenario {
  expanded = signal(false);
  nav1 = { renderIcon: BuiArrowLeft, onClick: () => console.log('nav'), label: 'Go back' };
  nav2 = { renderIcon: BuiDelete, onClick: () => console.log('nav'), label: 'Go back' };
  nav3 = { label: 'Action', onClick: () => console.log('nav action') };
  actions1 = [
    { renderIcon: BuiCheck, onClick: () => console.log('check'), label: 'Confirm entries' },
    { renderIcon: BuiPlus, onClick: () => console.log('plus'), label: 'Add a new entry' },
  ];
  actions3 = [{ label: 'Action', onClick: () => console.log('action') }];
}

// mobile-header--mobile-header-floating
@Component({
  selector: 'bui-mh-floating-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiMobileHeader],
  template: `
    <div style="display:flex;gap:20px">
      <!-- Card 1 -->
      <div class="bui-mh-phone" style="position:relative">
        <div class="bui-mh-header-container">
          <bui-mobile-header
            type="floating"
            [navButton]="nav1"
            [actionButtons]="actions1"
          />
        </div>
        <div class="bui-mh-body" tabindex="0" style="height:100%;width:100%;overflow:auto;background:#ddd">
          <p style="padding:80px 16px 16px">Map area</p>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bui-mh-phone" style="position:relative">
        <div class="bui-mh-header-container">
          <bui-mobile-header
            type="floating"
            [navButton]="nav2"
            [actionButtons]="actions2"
          />
        </div>
        <div class="bui-mh-body" tabindex="0" style="height:100%;width:100%;overflow:auto;background:#ddd">
          <p style="padding:80px 16px 16px">Map area</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bui-mh-phone" style="position:relative">
        <div class="bui-mh-header-container">
          <bui-mobile-header
            type="floating"
            [navButton]="nav3"
            [actionButtons]="actions3"
          />
        </div>
        <div class="bui-mh-body" tabindex="0" style="height:100%;overflow:auto">
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bui-mh-phone {
      width: 375px; height: 667px; border: 1px solid #ECECEC;
      border-radius: 12px; background-color: #ECECEC; overflow: auto;
    }
    .bui-mh-header-container {
      width: 100%; position: absolute; pointer-events: none; z-index: 1;
    }
  `],
})
export class MobileHeaderFloatingScenario {
  nav1 = { renderIcon: BuiArrowLeft, onClick: () => console.log('nav'), label: 'Go back' };
  nav2 = { renderIcon: BuiArrowLeft, onClick: () => console.log('nav'), label: 'Open menu' };
  nav3 = { onClick: () => console.log('nav'), label: 'Go Back' };
  actions1 = [
    { renderIcon: BuiCheck, onClick: () => console.log('check'), label: 'Confirm entries' },
    { renderIcon: BuiPlus, onClick: () => console.log('plus'), label: 'Add a new entry' },
  ];
  actions2 = [{ onClick: () => console.log('money'), label: '$25.18' }];
  actions3 = [{ onClick: () => console.log('action'), label: 'Action' }];
}
