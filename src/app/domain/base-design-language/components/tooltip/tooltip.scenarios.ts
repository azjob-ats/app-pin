import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BuiTooltip, BuiStatefulTooltip } from './tooltip.component';
import { Button } from '../button/button.component';

// tooltip--tooltip
@Component({
  selector: 'bui-tooltip-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiTooltip],
  template: `
    <div style="padding:32px">
      <bui-tooltip content="Tooltips display short messages.">
        <span>such as this</span>
      </bui-tooltip>
    </div>
  `,
})
export class TooltipScenario {}

// tooltip--tooltip-complex
@Component({
  selector: 'bui-tooltip-complex-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiTooltip],
  template: `
    <div style="padding:32px">
      This&nbsp;
      <bui-tooltip
        content="feat: super cool feature #123"
        [showArrow]="true"
      >
        <span style="border-bottom:1px dotted currentColor;color:var(--bw-colors-primary500,var(--bw-colors-contentAccent));cursor:pointer">
          commit
        </span>
      </bui-tooltip>
      &nbsp;introduced a new feature.
    </div>
  `,
})
export class TooltipComplexScenario {}

// tooltip--tooltip-interactive-element
@Component({
  selector: 'bui-tooltip-interactive-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiTooltip, Button],
  template: `
    <div style="padding:32px;display:flex;gap:8px">
      <bui-tooltip content="Tooltips display short messages.">
        <bui-button>Button</bui-button>
      </bui-tooltip>
      <bui-tooltip content="Tooltips display short messages.">
        <bui-button>Button</bui-button>
      </bui-tooltip>
    </div>
  `,
})
export class TooltipInteractiveElementScenario {}

// tooltip--tooltip-arrow-margin
@Component({
  selector: 'bui-tooltip-arrow-margin-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTooltip],
  template: `
    <div style="padding:32px">
      <bui-tooltip
        content="Tooltips display short messages."
        [showArrow]="true"
        [popoverMargin]="20"
      >
        <span>such as this</span>
      </bui-tooltip>
    </div>
  `,
})
export class TooltipArrowMarginScenario {}
