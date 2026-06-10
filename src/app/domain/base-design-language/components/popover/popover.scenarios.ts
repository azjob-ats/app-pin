import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiPopover, PopoverPlacement, PopoverTrigger } from './popover.component';
import { Button } from '../button/button.component';
import { ProgressBar } from '../progress-bar/progress-bar.component';
import { Select, Option } from '../select/select.component';

/** Scenarios portadas de `src/popover/__tests__/*.scenario.tsx`. */

const PLACEMENTS: PopoverPlacement[] = [
  'auto', 'topLeft', 'top', 'topRight',
  'rightTop', 'right', 'rightBottom',
  'bottomRight', 'bottom', 'bottomLeft',
  'leftBottom', 'left', 'leftTop',
];

const COLOR_OPTS: Option[] = [
  { id: 'AliceBlue', label: 'AliceBlue' },
  { id: 'AntiqueWhite', label: 'AntiqueWhite' },
  { id: 'Aqua', label: 'Aqua' },
  { id: 'Aquamarine', label: 'Aquamarine' },
  { id: 'Azure', label: 'Azure' },
  { id: 'Beige', label: 'Beige' },
];

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

// popover-autofocus.scenario.tsx — StatefulPopover with focusable input in content.
@Component({
  selector: 'bui-s-popover-auto-focus-without-focus-lock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="padding:60px">
      <bui-popover triggerType="click">
        <bui-button>Click me</bui-button>
        <div buiPopoverContent style="padding:20px">
          Hello, there!
          <input placeholder="Focusable Element" aria-label="Focusable Element" />
        </div>
      </bui-popover>
    </div>
  `,
})
export class PopoverAutoFocusWithoutFocusLockScenario {}

// popover-dynamic-triggertype.scenario.tsx — triggerType switches between hover and click.
@Component({
  selector: 'bui-s-popover-dynamic-trigger-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover],
  template: `
    <div style="padding:60px">
      <bui-popover
        [isOpen]="isOpen()"
        [triggerType]="triggerType()"
        (isOpenChange)="onOpenChange($event)"
      >
        <button
          (click)="onTriggerClick()"
          (mouseenter)="onMouseEnter()"
          (mouseleave)="onMouseLeave()"
        >click or hover me</button>
        <div buiPopoverContent>
          <p [id]="triggerType() === 'hover' ? 'content-hover' : 'content-click'">
            {{ triggerType() === 'hover' ? 'hover' : 'click' }}
          </p>
        </div>
      </bui-popover>
      <p id="outside-target">click outside target</p>
    </div>
  `,
})
export class PopoverDynamicTriggerTypeScenario {
  protected readonly isOpen = signal(false);
  protected readonly triggerType = signal<PopoverTrigger>('hover');

  protected onTriggerClick(): void { this.triggerType.set('click'); }
  protected onMouseEnter(): void {
    if (this.triggerType() === 'hover') this.isOpen.set(true);
  }
  protected onMouseLeave(): void {
    if (this.triggerType() === 'hover') { this.isOpen.set(false); this.triggerType.set('hover'); }
  }
  protected onOpenChange(open: boolean): void {
    if (!open) { this.isOpen.set(false); this.triggerType.set('hover'); }
  }
}

// popover-focus-loop.scenario.tsx — focusLock hover trigger with tabIndex div.
@Component({
  selector: 'bui-s-popover-focus-loop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover],
  template: `
    <div style="padding:60px">
      <bui-popover triggerType="hover">
        <button>hover</button>
        <div buiPopoverContent data-e2e="content" tabindex="0" style="padding:8px">hello</div>
      </bui-popover>
    </div>
  `,
})
export class PopoverFocusLoopScenario {}

// popover-large-margin.scenario.tsx — popoverMargin=30, two popovers (with/without arrow).
@Component({
  selector: 'bui-s-popover-large-margin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="background-color:lightskyblue;padding:80px 40px">
      <div style="margin-bottom:32px">
        <bui-popover [isOpen]="true" [popoverMargin]="30" accessibilityType="tooltip">
          <bui-button>Open</bui-button>
          <div buiPopoverContent style="padding:8px">content</div>
        </bui-popover>
      </div>
      <div>
        <bui-popover [isOpen]="true" [popoverMargin]="30" accessibilityType="tooltip" showArrow>
          <bui-button>Open</bui-button>
          <div buiPopoverContent style="padding:8px">content</div>
        </bui-popover>
      </div>
    </div>
  `,
})
export class PopoverLargeMarginScenario {}

// popover-position.scenario.tsx — all PLACEMENT values shown simultaneously.
@Component({
  selector: 'bui-s-popover-position',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover],
  template: `
    <div>
      <div style="background-color:lightskyblue;display:flex;flex-direction:column;align-items:center;
                  height:500px;flex-wrap:wrap;padding-top:24px;overflow:auto">
        @for (p of placements; track p) {
          <div style="padding:64px 48px">
            <bui-popover [isOpen]="true" [placement]="p" showArrow>
              <span>{{ p }}</span>
              <div buiPopoverContent style="padding:12px">content</div>
            </bui-popover>
          </div>
        }
      </div>
    </div>
  `,
})
export class PopoverPositionScenario {
  protected readonly placements = PLACEMENTS;
}

// popover-preventScroll-on-focus.scenario.tsx — sticky header with popover, tall page.
@Component({
  selector: 'bui-s-popover-prevent-scroll-on-focus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div>
      <div style="position:sticky;top:0;z-index:100;background:white;padding:8px;
                  display:flex;justify-content:center;border-bottom:1px solid #ccc">
        <bui-popover triggerType="click" renderAll accessibilityType="menu">
          <bui-button>Click Me</bui-button>
          <div buiPopoverContent data-e2e="content" tabindex="0" style="padding:16px">
            <h2 style="margin:0 0 8px">hello</h2>
          </div>
        </bui-popover>
      </div>
      <div style="height:200px;display:flex;justify-content:center;align-items:center;
                  background-color:whitesmoke">
        <p style="text-align:center;max-width:400px">
          Scroll down, then click "Click Me" — the page should not scroll back to top.
        </p>
      </div>
      <div style="height:100vh;background-color:lightgrey;display:flex;justify-content:center;align-items:center">
        <h2>Scroll zone</h2>
      </div>
    </div>
  `,
})
export class PopoverPreventScrollOnFocusScenario {}

// popover-progress-bar.scenario.tsx — ProgressBar wrapped in hover popover.
@Component({
  selector: 'bui-s-popover-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, ProgressBar],
  template: `
    <div style="padding:60px;width:300px">
      <bui-popover triggerType="hover" accessibilityType="tooltip">
        <bui-progress-bar [value]="30" aria-label="Progress" />
        <div buiPopoverContent style="padding:12px 16px;font:var(--bw-font-ParagraphSmall)">hello world</div>
      </bui-popover>
    </div>
  `,
})
export class PopoverProgressBarScenario {}

// popover-render-all.scenario.tsx — renderAll (content stays in DOM when closed).
@Component({
  selector: 'bui-s-popover-render-all',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="padding:60px">
      <bui-popover triggerType="click" renderAll accessibilityType="tooltip">
        <bui-button>Open</bui-button>
        <div buiPopoverContent id="content" style="padding:8px">content</div>
      </bui-popover>
    </div>
  `,
})
export class PopoverRenderAllScenario {}

// popover-reposition.scenario.tsx — click-triggered popover with expandable content.
@Component({
  selector: 'bui-s-popover-reposition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button],
  template: `
    <div style="display:flex;justify-content:center;padding:80px">
      <bui-popover triggerType="click" placement="bottom" accessibilityType="tooltip">
        <bui-button id="e2e-open">Open</bui-button>
        <div buiPopoverContent id="e2e-popover" style="padding:8px">
          <button id="e2e-update" style="margin-right:8px" type="button"
            (click)="expanded.update(v => !v)">update</button>
          @if (expanded()) {
            <span id="e2e-expanded">hello world!</span>
          } @else {
            hello
          }
        </div>
      </bui-popover>
    </div>
  `,
})
export class PopoverRepositionScenario {
  protected readonly expanded = signal(false);
}

// popover-reposition-with-anchor-update.scenario.tsx — multi Select that acts as anchor update.
@Component({
  selector: 'bui-s-popover-reposition-with-anchor-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Select],
  template: `
    <div style="width:200px;padding:20px">
      <bui-select
        [options]="opts"
        [multi]="true"
        [isOpen]="true"
        placeholder="Select color"
        ariaLabel="Select color"
      />
    </div>
  `,
})
export class PopoverRepositionWithAnchorUpdateScenario {
  protected readonly opts = COLOR_OPTS;
}

// popover-scroll.scenario.tsx — two popovers placed after 1500px scroll zone.
@Component({
  selector: 'bui-s-popover-scroll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover],
  template: `
    <div style="height:2000px">
      <div style="height:1500px;display:flex;align-items:flex-start;padding:16px">
        <p>scroll down for test cases</p>
      </div>
      <div style="display:flex;justify-content:center;gap:32px;padding:40px">
        <div id="case-not-focus-locked">
          <bui-popover triggerType="click">
            <button id="button-not-focus-locked">not-focus-locked</button>
            <div buiPopoverContent id="content" style="padding:8px">
              <p>content</p>
              <input aria-label="Content input" />
            </div>
          </bui-popover>
        </div>
        <div id="case-focus-locked">
          <bui-popover triggerType="click">
            <button id="button-focus-locked">focus-locked</button>
            <div buiPopoverContent style="padding:8px">
              <p>content</p>
              <input aria-label="Content input focus locked" />
            </div>
          </bui-popover>
        </div>
      </div>
    </div>
  `,
})
export class PopoverScrollScenario {}

// popover-select.scenario.tsx — Popover with a Select inside the content.
@Component({
  selector: 'bui-s-popover-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPopover, Button, Select],
  template: `
    <div style="padding:40px">
      <div data-e2e="outside-popover" style="margin-bottom:16px">Element outside of the popover to click on</div>
      <bui-popover triggerType="click" accessibilityType="tooltip">
        <bui-button>Open</bui-button>
        <div buiPopoverContent style="padding:8px;min-width:220px">
          <bui-select
            [options]="opts"
            placeholder="Start searching"
            ariaLabel="Start searching"
            [searchable]="true"
          />
        </div>
      </bui-popover>
    </div>
  `,
})
export class PopoverSelectScenario {
  protected readonly opts = COLOR_OPTS;
}
