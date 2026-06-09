import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiPopover } from './popover.component';
import { Button } from '../button/button.component';

/** Scenarios portadas de `src/popover/__tests__/*.scenario.tsx`. */

// popover.scenario.tsx — isOpen (sempre aberto), Button trigger, content "content".
@Component({
  selector: 'bui-s-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="padding:60px">
      <bui-popover [isOpen]="true">
        <bui-button>Open</bui-button>
        <div buiPopoverContent style="padding:8px">content</div>
      </bui-popover>
    </div>
  `,
})
export class PopoverScenario {}

// popover-click.scenario.tsx — StatefulPopover (clique alterna).
@Component({
  selector: 'bui-s-popover-click',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="padding:60px">
      <bui-popover triggerType="click">
        <bui-button>Open</bui-button>
        <div buiPopoverContent style="padding:8px">content</div>
      </bui-popover>
    </div>
  `,
})
export class PopoverClickScenario {}

// popover-hover.scenario.tsx — StatefulPopover triggerType hover.
@Component({
  selector: 'bui-s-popover-hover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="padding:60px">
      <bui-popover triggerType="hover">
        <bui-button>Open</bui-button>
        <div buiPopoverContent style="padding:8px">content</div>
      </bui-popover>
    </div>
  `,
})
export class PopoverHoverScenario {}
