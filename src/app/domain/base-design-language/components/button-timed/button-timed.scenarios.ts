import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '../button/button.component';
import { BuiButtonTimed } from './button-timed.component';

@Component({
  selector: 'bui-bt-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonTimed, Button],
  template: `
    <div>
      <bui-button kind="secondary" (buttonClick)="paused.set(!paused())">
        {{ paused() ? 'Run' : 'Pause' }}
      </bui-button>

      <div>
        <bui-button-timed [initialTime]="2" [paused]="paused()" (buttonTimedClick)="finished1.set(true)">
          Countdown
        </bui-button-timed>
        @if (finished1()) { <span style="margin-left:20px;color:red">Time!</span> }
      </div>

      <div>
        <bui-button-timed [initialTime]="10" [paused]="paused()" (buttonTimedClick)="finished2.set(true)">
          Countdown
        </bui-button-timed>
        @if (finished2()) { <span style="margin-left:20px;color:blue">Time!</span> }
      </div>

      <div>
        <bui-button-timed [initialTime]="30" [paused]="paused()" (buttonTimedClick)="finished3.set(true)">
          Countdown
        </bui-button-timed>
        @if (finished3()) { <span style="margin-left:20px;color:gold">Time!</span> }
      </div>

      <div>
        <bui-button-timed [initialTime]="75" [paused]="paused()" (buttonTimedClick)="finished4.set(true)">
          Countdown
        </bui-button-timed>
        @if (finished4()) { <span style="margin-left:20px;color:green">Time!</span> }
      </div>
    </div>
  `,
})
export class ButtonTimedScenario {
  paused = signal(true);
  finished1 = signal(false);
  finished2 = signal(false);
  finished3 = signal(false);
  finished4 = signal(false);
}
